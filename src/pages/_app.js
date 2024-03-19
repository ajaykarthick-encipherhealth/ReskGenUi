import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css"; // Import your global CSS here
import "@fortawesome/fontawesome-svg-core/styles.css";
import { wrapper, store } from "../store/store";
import { Provider, useSelector } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons

import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from "../jsx/layouts/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
config.autoAddCss = false;
import AICHAT from "../components/aiChat";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const msgReply = useSelector((state) => state.auth.chatReply);
  const [showTerminal, setShowTerminal] = useState(false);

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
          setShowTerminal(false);
        } else {
          if (
            currentPath === "/" ||
            currentPath?.includes("/login") ||
            currentPath?.includes("/ehrlogin") ||
            currentPath?.includes("/twofactorAuthentication/")
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

  return (
    <>
      {/* {!validatedPath ? (
        <UnAuthorized />
      ) : ( */}
      <PrimeReactProvider>
        <Provider store={store}>
          {showTerminal && (
            <AICHAT openMsg={true} />
            //   <TerminalComponent
            //   handleNewUserMessage={handleNewUserMessage}
            //   handleQuickButtonClicked={handleQuickButtonClicked}
            //   showBadge={false}
            //   emojis={true}
            //   title="CogentAI"
            //   subtitle="Chat with CogentAI"
            //   autoFocus={true}
            // />
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
