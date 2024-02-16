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
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const msgReply = useSelector((state) => state.workFlow.chatReply);
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
      const { addResponseMessage } = require("react-chat-widget");
      addResponseMessage(msgReply ? msgReply : "Welcome to CogentAI!");
    }
  }, [msgReply]);
  useEffect(() => {
    const currentPath = window.location.pathname;
    const role = JSON.parse(localStorage.getItem("roles"));
    if (
      currentPath === "/" ||
      currentPath === "/login" ||
      currentPath?.includes("/twofactorAuthentication/")
    ) {
      setShowTerminal(false);
      setValidatePath(true);
    } else {
      setShowTerminal(true);
      setValidatePath(
        window.location.pathname.toLowerCase().includes(role[0]?.toLowerCase())
      );
    }
  });

  return (
    <>
      {!validatedPath ? (
        <UnAuthorized />
      ) : (
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
              />
            )}
            <Component {...pageProps} />
            {showTerminal && <Footer />}
          </Provider>
        </PrimeReactProvider>
      )}
    </>
  );
}

export default wrapper.withRedux(MyApp);
