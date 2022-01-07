import React from "react";
import { ProfilePopover } from "./Profile";
import logo from "../../../assets/images/logo.svg";


const DashboardHeader = (({ ...rest }): JSX.Element => {
  return (
    <div className="dash-board__header">
      <div className="dash-board__logo">
        <a href="https://imagentherapeutics.com/predicttx"><img src={logo} alt="predictDb" /></a>
      </div>
      <div className="dash-board__right">
        <div className="dash-board__docs">
          <a href="https://docs.imagentherapeutics.com">Documentation</a>
        </div>
        <div className="dash-board__profile">
          <ProfilePopover />
        </div>
      </div>
    </div>
  )
})

export default DashboardHeader