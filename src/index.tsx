import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { AppContextWrapper } from "context";
import './assets/scss/core.scss';
import { AdvancedFiltersProvider } from "context/advanced-filters.context";

const AppProvider = () => {
  return (
    <AppContextWrapper>
      <AdvancedFiltersProvider>
        <App />
      </AdvancedFiltersProvider>
    </AppContextWrapper>
  )
};

ReactDOM.render(<AppProvider />, document.getElementById("root"));
