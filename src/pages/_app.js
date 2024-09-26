import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { wrapper, store } from "../stores/index";
import { Provider, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PrimeReactProvider } from "primereact/api";
import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from "../jsx/layouts/Footer";
import AICHAT from "../components/aiChat";
import { refreshToken } from "../stores/authflow/actions";
import ConnectWebSocket from "../components/websocket";
import { getStorage } from "../utils/storages";

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showTerminal, setShowTerminal] = useState(false);
  let loginCheck =  typeof window !== 'undefined' ? getStorage('loginCheck') : null;

  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault(); 
    };
    document.addEventListener("contextmenu", handleContextmenu);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    fetch(currentPath)
      .then((response) => {
        if (!response.ok) {
          setShowTerminal(false);
        } else {
          if (
            currentPath === "/" ||
            currentPath?.includes("/login") ||
            currentPath?.includes("/ehrlogin") ||
            currentPath?.includes("/twofactorAuthentication/") ||
            currentPath?.includes("search") ||
            currentPath?.includes("/reviewer/patients/details")
          ) {
            setShowTerminal(false);
          } else {
            setShowTerminal(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [router]);

  useEffect(() => {
    let intervalId;
    let pauseTime = 0;

    const checkLoginTime = () => {
      const loginTimeStr = getStorage("loginTime");
      const loginTime = parseInt(loginTimeStr);

      if (!isNaN(loginTime)) {
        const timeElapsed = Date.now() - loginTime;
        if (timeElapsed > 30 * 60 * 1000) {
          dispatch(refreshToken());
        }
      }
    };

    if (showTerminal) {
      checkLoginTime();
    }

    intervalId = setInterval(() => {
      if (showTerminal && document.visibilityState === "visible") {
        checkLoginTime();
      } else {
        clearInterval(intervalId);
        pauseTime = Date.now();
      }
    }, 30 * 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (showTerminal) {
          const remainingTime = 30 * 60 * 1000 - (Date.now() - pauseTime);
          if (remainingTime > 0) {
            setTimeout(() => {
              checkLoginTime();
              intervalId = setInterval(checkLoginTime, 30 * 60 * 1000);
            }, remainingTime);
          } else {
            checkLoginTime();
            intervalId = setInterval(checkLoginTime, 30 * 60 * 1000);
          }
        }
      } else {
        clearInterval(intervalId);
        pauseTime = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, showTerminal]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const userRole = getStorage("userRole");
  }, [showTerminal]);

  const hideFooterPaths = [
    "/admin/patients/details",
    "/reviewer/patients/details",
    "/supervisor/patients/details",
    "/tenantAdmin/patients/details",
  ];
  const showFooter = !hideFooterPaths.includes(router.pathname);

  return (
    <PrimeReactProvider>
      <Provider store={store}>
        {showTerminal && <AICHAT openMsg={true} />}
        <Component {...pageProps} />
        {loginCheck == "true" && <ConnectWebSocket />}
        {showFooter && showTerminal && <Footer />}
      </Provider>
    </PrimeReactProvider>
  );
}

export default wrapper.withRedux(MyApp);
