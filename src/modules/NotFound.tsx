import React, { useEffect } from "react";
import { titleService } from "../services";
import { BasePageProps } from "../shared/models";
import { useHistory } from "react-router-dom";
import { routes } from "../routes";

const NotFound = (props: BasePageProps): JSX.Element => {
  const history = useHistory();
  titleService.setTitle(props.title);

  useEffect(() => {
    const wait = (timeout: number): Promise<any> => new Promise(r => setTimeout(r, timeout))
    wait(5000).then(history.push.bind(null, routes.signIn))
  }, []); /* eslint-disable-line */

  return (
    <div className="not-found-page-updated" >
      <h1>Requested data or page is not found</h1>
      <div>Wait please, after 5 seconds you will be redirected to dashboard</div>
    </div>
  );
};

export default NotFound;
