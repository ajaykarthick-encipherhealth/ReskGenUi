import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'; // Import your global CSS here
import "@fortawesome/fontawesome-svg-core/styles.css";
import { wrapper, store } from "../store/store";
import { Provider } from "react-redux";
import { PrimeReactProvider } from 'primereact/api';
// import "primereact/resources/themes/lara-light-indigo/theme.css";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons

import { config } from "@fortawesome/fontawesome-svg-core";
import Footer from '../jsx/layouts/Footer';
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PrimeReactProvider>
      <Provider store={store}>
        
        
        <Component {...pageProps} />
      

      </Provider>
      </PrimeReactProvider>
    </>
  );
}

export default wrapper.withRedux(MyApp);