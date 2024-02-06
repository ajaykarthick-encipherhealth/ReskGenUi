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
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { getChatReply } from "../store/actions/DashboardActions";
import { useSelector } from "react-redux";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const msgReply = useSelector((state) => state.workFlow.chatReply);

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
      const { addResponseMessage } = require("react-chat-widget");
      addResponseMessage(msgReply ? msgReply : "Welcome to CogentAI!");
    }
  }, []);
  return (
    <>
      <PrimeReactProvider>
        <Provider store={store}>
          <TerminalComponent
            handleNewUserMessage={handleNewUserMessage}
            handleQuickButtonClicked={handleQuickButtonClicked}
            showBadge={false}
            emojis={true}
            title="CogentAI"
            subtitle="Chat with CogentAI"
          />
          <Component {...pageProps} />
        </Provider>
      </PrimeReactProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
