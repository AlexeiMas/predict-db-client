import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
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
        <PublicRoute component={SignIn} path="/" exact />
        <PublicRoute component={SignIn} path={routes.signIn} exact />
        <PublicRoute component={SignUp} path={routes.signUp} exact />
        <PublicRoute component={ForgotPassword} path={routes.forgotPassword} exact />
        <PublicRoute component={ResetPassword} path={routes.resetPassword} exact />
        <PrivateRoute component={Dashboard} path={routes.dashboard} exact />
        <Route path={routes.notFound} exact>{'404'}</Route>
        <Redirect to={routes.notFound} />
      </Switch>
    </Router>
  )
}

export default AppRouter;