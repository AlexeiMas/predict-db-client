
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './main.style.css';
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { AppContextWrapper } from "context";
import './assets/scss/core.scss';

const AppProvider = () => {
  return (
    <AppContextWrapper>
      <App/>
    </AppContextWrapper>
  )
};

ReactDOM.render(<AppProvider/>, document.getElementById("root"));