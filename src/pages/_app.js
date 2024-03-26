import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { wrapper, store } from "../store/store";
import { Provider, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PrimeReactProvider } from "primereact/api";
import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from "../jsx/layouts/Footer";
import AICHAT from "../components/aiChat";

config.autoAddCss = false;

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
