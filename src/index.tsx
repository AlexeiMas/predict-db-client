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