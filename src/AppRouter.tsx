import { Redirect, Switch, Route } from "react-router-dom";
import { routes } from "./routes";

import PublicRoute from "modules/PublicRoute";
import PrivateRoute from "modules/PrivateRoute";
import SignIn from "modules/authentication/SignIn";
import SignUp from "modules/authentication/SignUp";
import ForgotPassword from "modules/authentication/ForgotPassword";
import ResetPassword from "modules/authentication/ResetPassword";
import Dashboard from 'modules/dashboard/pages/Dashboard';
import Analytics from "./modules/dashboard/pages/Analytics";
import NotFound from './modules/NotFound';

const AppRouter = (): JSX.Element => {
  return (
    <Switch>
      <PublicRoute exact path={routes.default} component={SignIn} />
      <PublicRoute exact path={routes.signIn} component={SignIn} />
      <PublicRoute exact path={routes.signUp} component={SignUp} />
      <PublicRoute exact path={routes.forgotPassword} component={ForgotPassword} />
      <PublicRoute exact path={routes.resetPassword} component={ResetPassword} />
      <PrivateRoute path={routes.dashboard.extended} component={Dashboard} />
      <PrivateRoute path={routes.analytics} component={Analytics} />
      <Route exact path={routes.notFound} component={NotFound} />
      <Redirect to={routes.notFound} />
    </Switch>
  )
}

export default AppRouter;