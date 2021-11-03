import { Route, Redirect } from 'react-router-dom';
import { routes } from "../routes";
import storage from "../services/storage.service";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route {...rest} render={(props: any): React.ReactElement => {
      const isAuth = storage.checkBool("is_authorized");
      const accessExp = storage.get("access_token_expires");
      const isNotAuthenticated = !isAuth || !accessExp || accessExp <= Date.now();
      if (isNotAuthenticated) return <Redirect to={{ pathname: routes.signIn }} />
      return <Component {...props} />;
    }} />
  );
};

export default PrivateRoute;