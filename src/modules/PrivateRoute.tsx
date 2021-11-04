import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { routes } from "../routes";
import { useAppContext } from 'context';

const PrivateRoute = ({ component: Component, ...rest }: any): React.ReactElement => {
  const appCTX = useAppContext()
  return (
    <Route {...rest} render={(props: any): React.ReactElement => {
      if (appCTX.controls.isAuthenticated() === true) return <Component {...props} />
      return <Redirect to={{ pathname: routes.signIn }} />
    }} />
  );
}

export default PrivateRoute;