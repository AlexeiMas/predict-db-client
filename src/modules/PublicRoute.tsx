import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { routes } from "../routes";
import storage from "../services/storage.service";

const PublicRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route {...rest} render={(props: any): React.ReactElement => {
      const isAuth = storage.checkBool("is_authorized");
      const accessExp = storage.get("access_token_expires");
      const isAuthenticated = isAuth || (accessExp && accessExp > Date.now());
      if (isAuthenticated) return <Redirect to={{ pathname: routes.dashboard.base }} />
      return <Component {...props} />;
    }} />
  );
};

export default PublicRoute;