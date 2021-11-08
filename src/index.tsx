
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './main.style.css';
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { AppContextWrapper } from "context";
import './assets/scss/core.scss';
import { DrawlerContextProvider } from "context/drawler.context";

const AppProvider = () => {
  return (
    <DrawlerContextProvider>
      <AppContextWrapper>
        <App />
      </AppContextWrapper>
    </DrawlerContextProvider>
  )
};

ReactDOM.render(<AppProvider />, document.getElementById("root"));