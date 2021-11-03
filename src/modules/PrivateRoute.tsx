import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { routes } from "../routes";
import { useAppContext } from '../context';

const PrivateRoute = ({ component, ...rest }: any) => {
  const { user } = useAppContext();
  const isAuthorized = user && !!user.isAuthorized;

  const routeComponent = (props: any) => (
    isAuthorized
      ? React.createElement(component, props)
      : <Redirect to={{pathname: routes.signIn}}/>
  );

  return <Route {...rest} render={routeComponent}/>;
};

export default PrivateRoute;