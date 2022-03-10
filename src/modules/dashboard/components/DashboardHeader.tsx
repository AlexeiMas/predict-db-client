import React, {useEffect} from "react";
import {ProfilePopover} from "./Profile";
import logo from "../../../assets/images/logo.svg";
import NavigationTabs from "./NavigationTabs";
import {useLocation} from "react-router-dom";
import {useAppContext} from "../../../context";

const DashboardHeader = (({...rest}): JSX.Element => {

  const location = useLocation()
  const appCTX = useAppContext()

  const [activeTab, setActiveTab] = React.useState(location.pathname.slice(1))
  const isAuth = appCTX.controls.isAuthenticated()

  useEffect(() => {
    setActiveTab(location.pathname.slice(1));
  }, [location])

  return (
    <>
      <div className="dash-board__header">
        <div className="dash-board__logo">
          <a href="https://imagentherapeutics.com/predicttx"><img src={logo} alt="predictDb"/></a>
        </div>
        <div className="dash-board__right">
          <div className="dash-board__docs">
            <a href="https://docs.imagentherapeutics.com">Documentation</a>
          </div>
          <div className="dash-board__profile">
            <ProfilePopover/>
          </div>
        </div>
      </div>
      {
        isAuth
        &&
        <div>
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
        </div>
      }
    </>
  )
})

export default DashboardHeader
