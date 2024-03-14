import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css"; // Import your global CSS here
import "@fortawesome/fontawesome-svg-core/styles.css";
import { wrapper, store } from "../store/store";
import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons

import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from "../jsx/layouts/Footer";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getChatReply } from "../store/actions/DashboardActions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import UnAuthorized from "../403page";
import { refreshToken } from "../services/AuthService";
import { useRouter } from "next/router";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const msgReply = useSelector((state) => state.auth.chatReply);
  const [showTerminal, setShowTerminal] = useState(true);
  const [validatedPath, setValidatePath] = useState();

  const handleNewUserMessage = (newMessage) => {
    dispatch(getChatReply(newMessage));
  };
  const handleQuickButtonClicked = (data) => {
    console.log(data);
  };
  const TerminalComponent = dynamic(
    () => import("react-chat-widget").then((mod) => mod.Widget),
    {
      ssr: false,
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const {
        addResponseMessage,
        deleteMessages,
      } = require("react-chat-widget");
      if (msgReply?.loading) {
        addResponseMessage("...");
      } else {
        deleteMessages(1);
        addResponseMessage(
          msgReply?.data ? msgReply?.data : "Welcome to CogentAI!"
        );
      }
    }
  }, [msgReply]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    fetch(currentPath)
      .then((response) => {
        if (!response.ok) {
          // if (response.status === 404) {
          setShowTerminal(false);
          // }
        } else {
          if (
            currentPath === "/" ||
            currentPath?.includes("/login") ||
            currentPath?.includes("/ehrlogin") ||
            currentPath?.includes("/twofactorAuthentication/")
          ) {
            setShowTerminal(false);
            setValidatePath(true);
          } else {
            setShowTerminal(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [router]);

  return (
    <>
      {/* {!validatedPath ? (
        <UnAuthorized />
      ) : ( */}
      <PrimeReactProvider>
        <Provider store={store}>
          {showTerminal && (
            <TerminalComponent
              handleNewUserMessage={handleNewUserMessage}
              handleQuickButtonClicked={handleQuickButtonClicked}
              showBadge={false}
              emojis={true}
              title="CogentAI"
              subtitle="Chat with CogentAI"
              autoFocus={true}
            />
          )}
          <Component {...pageProps} />
          {showTerminal && <Footer />}
        </Provider>
      </PrimeReactProvider>
      {/* )} */}
    </>
  );
}

export default wrapper.withRedux(MyApp);
