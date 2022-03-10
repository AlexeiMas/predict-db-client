import React from "react";
import ReactDOM from "react-dom";
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import './main.style.css';
import './assets/scss/core.scss';
import App from "./App";
import * as AppCTX from "context";
import * as DrawlerCTX from "context/drawler.context";
import * as RRD from 'react-router-dom';
import * as GtmCTX from 'context/gtm.context';


const AppProvider = () => {
  return (
    <RRD.BrowserRouter>
      <GtmCTX.Provider>
        <DrawlerCTX.Provider>
          <AppCTX.Provider>
            <App />
          </AppCTX.Provider>
        </DrawlerCTX.Provider>
      </GtmCTX.Provider>
    </RRD.BrowserRouter>
  )
};

ReactDOM.render(<AppProvider />, document.getElementById("root"));
