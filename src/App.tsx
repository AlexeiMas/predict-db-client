import DashboardHeader from "modules/dashboard/components/DashboardHeader";
import React from "react";
import AppRouter from "./AppRouter";

const App = (): JSX.Element => {
  return (
      <div className="App">
        <DashboardHeader />
        <AppRouter />
      </div>
  );
};

export default App;
