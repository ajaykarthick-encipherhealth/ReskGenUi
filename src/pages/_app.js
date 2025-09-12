import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import Router from "next/router";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { wrapper, store } from "../stores/index";
import { Provider } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { PrimeReactProvider } from "primereact/api";
import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from "../jsx/layouts/Footer";
import dynamic from "next/dynamic";
import { getStorage, setStorage } from "../utils/storages";
import { serverControl } from "../utils/config";
import { authRequestPortal, requestPortal } from "../utils/network";
// Defer heavy sweetalert2 until used to reduce main thread work
let Swal;
import InternetError from "../utils/internetError";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "../../lib/msalInstance";
import { Poppins, Manrope } from "next/font/google";
import {
  clearInactivityTimer,
  resetInactivityTimer,
  startInactivityTimer,
} from "../utils/inactiveTracker";
import { ssoLogout } from "../../lib/authService";
import Script from "next/script";

// Defer heavy components to reduce main-thread work on initial load
const AICHAT = dynamic(() => import("../components/aiChat"), { ssr: false });
const ConnectWebSocket = dynamic(() => import("../components/websocket"), {
  ssr: false,
});
const Header = dynamic(() => import("../jsx/layouts/nav/Header"), {
  ssr: false,
});

// Self-host Google fonts via next/font to avoid render-blocking CSS
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-poppins",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [showTerminal, setShowTerminal] = useState(false);
  let loginCheck =
    typeof window !== "undefined" ? Boolean(getStorage("loginCheck")) : false;

  const refreshToken = async () => {
    const refreshToken = getStorage("refreshToken");
    const options = {
      method: "POST",
      body: JSON.stringify({ refreshToken: refreshToken }),
    };
    const response = await requestPortal(
      `securityservice/token/refreshtoken`,
      options
    );
    if (response?.status === "SUCCESS") {
      const newToken = response?.response;
      setStorage("refreshTokenTime", Date.now());
      setStorage("token", newToken);
      setStorage("loginTime", Date.now());
    }
    return response;
  };

  const isTableElement = (element) => {
    return ["TABLE", "TR", "TD", "TH"].includes(element.tagName);
  };

  const applyHoverEffect = (target, isEntering, pathname) => {
    if (
      target.id === "badge" ||
      target.classList.contains("ant-badge") ||
      target.classList.contains("timeline-panel") ||
      target.classList.contains("ant-badge-count") ||
      target.classList.contains("ant-steps-item-container") ||
      target.classList.contains("fileprocessingstepper") ||
      target.classList.contains("fileprocessing") ||
      target.classList.contains("ant-progress-inner") ||
      target.closest(".ant-select-dropdown") ||
      target.closest(".ant-select-selector") ||
      target.closest(".ant-spin")
    ) {
      return;
    }

    if (
      target.classList.contains("ant-steps-item") &&
      target.classList.contains("ant-steps-item-process") &&
      target.classList.contains("ant-steps-item-active") &&
      target.classList.contains("ant-progress-circle-path")
    ) {
      return;
    }

    if (
      (target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer") &&
      !isTableElement(target)
    ) {
      if (isEntering) {
        target.style.transition = "all 0.5s ease-in-out";
        if (pathname.endsWith("/fileprocessing")) {
          target.style.removeProperty("transform");
          return;
        }

        if (target.id === "auditbtn") {
          target.style.transform = "scale(1)";
        } else if (target.id === "dosSelect") {
          target.style.transform = "scale(1.01)";
        } else {
          target.style.transform = pathname.endsWith("/report")
            ? "scale(1.01)"
            : pathname.endsWith("/details")
            ? "scale(1.05)"
            : "scale(1.02)";
        }
        target.classList.add("hover-effect");
      } else {
        target.classList.add("hover-effect-remove");
        target.style.transform = "scale(1)";
        setTimeout(() => {
          target.classList.remove("hover-effect", "hover-effect-remove");
        }, 300);
      }
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (router.pathname.endsWith("/report")) {
        return;
      }

      let target = event.target;
      while (target && target !== document.body) {
        if (
          (target.tagName === "A" ||
            target.tagName === "BUTTON" ||
            target.classList.contains("cursor-pointer") ||
            window.getComputedStyle(target).cursor === "pointer") &&
          !isTableElement(target)
        ) {
          // target.classList.add("smooth-transition");
          break;
        }
        target = target.parentElement;
      }
    };

    const handleMouseEnter = (event) => {
      if (event.target instanceof Element) {
        applyHoverEffect(event.target, true, router.pathname);
      }
    };

    const handleMouseLeave = (event) => {
      if (event.target instanceof Element) {
        applyHoverEffect(event.target, false, router.pathname);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, [router.pathname]);

  useEffect(() => {
    if (serverControl === "production") {
      const handleKeyDown = (event) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          (event.key === "a" || event.key === "s")
        ) {
          event.preventDefault();
        }
      };
      const handleContextmenu = (e) => {
        e.preventDefault();
      };
      document.addEventListener("contextmenu", handleContextmenu);
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", (e) => {
        if (
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Shift") ||
          (e.key === "p" && e.ctrlKey) ||
          (e.key === "Print" && e.ctrlKey)
        ) {
          e.preventDefault();
          e.stopPropagation();
          const overlay = document.createElement("div");
          overlay.style.position = "fixed";
          overlay.style.top = "0";
          overlay.style.left = "0";
          overlay.style.width = "100%";
          overlay.style.height = "100%";
          overlay.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
          overlay.style.zIndex = "9999";
          document.body.style.filter = "blur(10px)";
          document.body.appendChild(overlay);
          setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.style.filter = "none";
          }, 2000);
        }
      });
      return () => {
        document.removeEventListener("contextmenu", handleContextmenu);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  useEffect(() => {
    if (serverControl === "production") {
      const handleKeydown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "a") {
          e.preventDefault();
        }
      };
      document.addEventListener("keydown", handleKeydown);
      return () => {
        document.removeEventListener("keydown", handleKeydown);
      };
    }
    // const username=getStorage("username")
    // const password=getStorage("password")
    // if(!username ||!password){
    //   router.push("/login")
    // }
  }, []);

  useEffect(() => {
    const path = router.pathname || "";
    const shouldHide =
      path === "/" ||
      path.includes("/login") ||
      path.includes("/projects") ||
      path.includes("/client") ||
      path.includes("/ehrlogin") ||
      path.includes("/twofactorauthentication/") ||
      path.includes("search");
    setShowTerminal(!shouldHide);
  }, [router.pathname]);

  // comment this refresh token --- Dev  login

  // useEffect(() => {
  //   let intervalId;
  //   let pauseTime = 0;

  //   const checkLoginTime = () => {
  //     const loginTimeStr = getStorage("loginTime");
  //     const loginTime = parseInt(loginTimeStr);

  //     if (!isNaN(loginTime)) {
  //       const timeElapsed = Date.now() - loginTime;
  //       if (timeElapsed > 30 * 60 * 1000) {
  //         refreshToken();
  //       }
  //     }
  //   };
  //   if (showTerminal) {
  //     checkLoginTime();
  //   }

  //   intervalId = setInterval(() => {
  //     if (showTerminal && document.visibilityState === "visible") {
  //       checkLoginTime();
  //     } else {
  //       clearInterval(intervalId);
  //       pauseTime = Date.now();
  //     }
  //   }, 30 * 60 * 1000);

  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") {
  //       if (showTerminal) {
  //         const remainingTime = 30 * 60 * 1000 - (Date.now() - pauseTime);
  //         if (remainingTime > 0) {
  //           setTimeout(() => {
  //             checkLoginTime();
  //             intervalId = setInterval(checkLoginTime, 30 * 60 * 1000);
  //           }, remainingTime);
  //         } else {
  //           checkLoginTime();
  //           intervalId = setInterval(checkLoginTime, 30 * 60 * 1000);
  //         }
  //       }
  //     } else {
  //       clearInterval(intervalId);
  //       pauseTime = Date.now();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     clearInterval(intervalId);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [showTerminal]);

  // sso changes

  // Inactivity logout logic
  useEffect(() => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) return;

    const handleLogout = () => {
      console.log("Logging out due to inactivity");
      ssoLogout();
    };

    const handleActivity = () => {
      resetInactivityTimer(handleLogout);
    };

    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, handleActivity)
    );
    startInactivityTimer(handleLogout);

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      clearInactivityTimer();
    };
  }, [router.pathname]);

  useEffect(() => {
    const account = msalInstance.getAllAccounts()[0];

    if (!account) return;

    let previousToken = null;

    const refreshToken = async () => {
      try {
        const tokenResponse = await msalInstance.acquireTokenSilent({
          account,
          scopes: ["User.Read", "offline_access"],
          forceRefresh: true,
        });
        const newToken = tokenResponse.accessToken;

        if (previousToken && previousToken !== newToken) {
          console.log("✅ Access token has been refreshed.");
        }
        setStorage("token", tokenResponse.idToken);
        previousToken = newToken;

        const tokenParts = newToken.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log(
          "🔒 Token expires at:",
          new Date(payload.exp * 1000).toISOString(),
          payload
        );
      } catch (error) {
        console.error("❌ Silent token refresh failed. Logging out...");
        ssoLogout();
      }
    };

    refreshToken(); // initial run
    const interval = setInterval(refreshToken, 16 * 30 * 1000);

    return () => clearInterval(interval);
  }, [router.pathname]);

  const hideFooterPaths = [
    "/tenantadmin/project/details",
    "/reviewer/patients/details",
    "/supervisor/patients/details",
    "/tenantadmin/patients/details",
    "/supervisor/user/details",
    "/tenantadmin/patientsync/batchfilesview",
    "/tenantadmin/settings",
    "/reviewer/report/reportdetails",
    "/supervisor/report/reportdetails",
    "/tenantadmin/report/reportdetails",
    "/tenantadmin/tracking/details",
    "/tenantadmin/tin/details",
    "/tenantadmin/tin/tindetails/querydetails"
  ];
  const showFooter = !hideFooterPaths.includes(router.pathname);
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    NProgress.configure({ showSpinner: false });
    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleComplete);
    };
  }, []);
  useEffect(() => {
    const handleOffline = () => {
      (Swal || (Swal = require("sweetalert2"))).fire({
        title: "No Internet Connection",
        text: "Please check your network.",
        icon: "error",
        confirmButtonText: "Retry",
        confirmButtonColor: "#DD6B55",
      }).then(() => window.location.reload());
    };

    const handleOnline = () => console.log("Back online!");

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <MsalProvider instance={msalInstance}>
      <PrimeReactProvider>
        <Provider store={store}>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-WEFGJM1VG2"
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-WEFGJM1VG2');`}
          </Script>

          {showTerminal && <AICHAT openMsg={true} />}
          <span className={`${poppins.variable} ${manrope.variable}`}>
            {showTerminal && <Header />}
            <div>
              <Component {...pageProps} />
            </div>
          </span>
          <InternetError />
          {loginCheck == true && <ConnectWebSocket />}
          {/* {showFooter && showTerminal && <Footer />} */}
        </Provider>
      </PrimeReactProvider>
    </MsalProvider>
  );
}

export default wrapper.withRedux(MyApp);
