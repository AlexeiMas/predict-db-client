import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { routes } from "../routes";
import { useAppContext } from 'context';
import { useQuery } from './dashboard/pages/Dashboard';

const PrivateRoute = ({ component: Component, ...rest }: any): React.ReactElement => {
  const appCTX = useAppContext()
  const query = useQuery()
  const history = useHistory();
  return (
    <Route {...rest} render={(props: any): React.ReactElement | void => {
      if (appCTX.controls.isAuthenticated() === true) {
        const Model_ID = query.get('Model_ID')
        const show = query.get('show') || ''
        const location = { ...history.location }
        const pathname = location.pathname.trim()
        if (Model_ID !== null && /true/gi.test(show) === false) {
          const urlSearchParams = new URLSearchParams()
          urlSearchParams.append('Model_ID', Model_ID)
          urlSearchParams.append('show', 'true')

          const params = {}
          const search = `?${urlSearchParams}`
          Object.assign(params, { pathname, search })
          if (location.state) Object.assign(params, { state: location.state })
          return history.push(params)
        }
        return <Component {...props} />
      }
      return <Redirect to={{ pathname: routes.signIn }} />
    }} />
  );
}

export default PrivateRoute;