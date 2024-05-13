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

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showTerminal, setShowTerminal] = useState(false);
  const [validPath, setValidPath] = useState(true);

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
      const loginTimeStr = localStorage.getItem("loginTime");
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
        clearInterval(intervalId); // Clear the interval when showTerminal is false or tab is hidden
        pauseTime = Date.now(); // Store the timestamp when the timer was paused
      }
    }, 30 * 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // If tab becomes visible, calculate remaining time and start the timer
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
        // If tab becomes hidden, pause the timer and store the pause time
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
    const userRole = localStorage.getItem("userRole");
    // if (userRole && !currentPath.includes(`/${userRole}/`) || "/search") {
    //   router.replace("/_error");
    // }
  }, [showTerminal]);

  return (
    <PrimeReactProvider>
      <Provider store={store}>
        {showTerminal && <AICHAT openMsg={true} />}
        <Component {...pageProps} />
        {showTerminal && <Footer />}
      </Provider>
    </PrimeReactProvider>
  );
}

export default wrapper.withRedux(MyApp);
