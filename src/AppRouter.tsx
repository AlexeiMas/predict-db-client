import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { routes } from "./routes";

import PublicRoute from "modules/PublicRoute";
import PrivateRoute from "modules/PrivateRoute";
import SignIn from "modules/authentication/SignIn";
import SignUp from "modules/authentication/SignUp";
import ForgotPassword from "modules/authentication/ForgotPassword";
import ResetPassword from "modules/authentication/ResetPassword";
import Dashboard from 'modules/dashboard/pages/Dashboard';

const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <PublicRoute exact path={routes.default} component={SignIn}  />
        <PublicRoute exact path={routes.signIn} component={SignIn}  />
        <PublicRoute exact path={routes.signUp} component={SignUp}  />
        <PublicRoute exact path={routes.forgotPassword} component={ForgotPassword}  />
        <PublicRoute exact path={routes.resetPassword} component={ResetPassword}  />
        <PrivateRoute exact path={routes.dashboard} component={Dashboard}  />
        <PublicRoute exact path={routes.notFound} component={() => <>PAGE Not Found</>} />
        <Redirect to={routes.notFound} />
      </Switch>
    </Router>
  )
}

export default AppRouter;