import { useAppContext } from 'context';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { routes } from "../routes";

const PublicRoute = ({ component: Component, ...rest }: any): React.ReactElement => {
  const appCTX = useAppContext()
  return (
    <Route {...rest} render={(props: any): React.ReactElement => {
      if (appCTX.controls.isAuthenticated() === false) return <Component {...props} />
      return <Redirect to={{ pathname: routes.dashboard.base }} />
    }} />
  );
}

export default PublicRoute;