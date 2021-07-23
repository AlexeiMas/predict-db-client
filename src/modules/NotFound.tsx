import React, { useEffect } from "react";
import titleService from "../services/title.service";
import { BasePageProps } from "../shared/models";
import { useHistory } from "react-router-dom";
import { routes } from "../routes";

const NotFound = (props: BasePageProps): JSX.Element => {
  const history = useHistory();
  titleService.setTitle(props.title);

  useEffect(() => {
    history.push(routes.signIn);
  });

  return (
    <div>
      <h1>Not found</h1>
    </div>
  );
};

export default NotFound;
