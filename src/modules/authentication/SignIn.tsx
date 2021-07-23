import React, { useState } from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";

import { EMAIL_PATTERN } from "constants/validators";

import logo from "assets/images/logo_white.svg";

import titleService from "../../services/title.service";
import { BasePageProps } from "../../shared/models";

import { signIn } from "../../api/auth.api";
import { useAppContext } from 'context';
import { routes } from "../../routes";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      "& .MuiTextField-root": {
        width: "100%",
      },
      width: "420px",
    },
    button: {
      backgroundColor: "#0941AC",
      width: "420px",
      height: "77px",
      padding: "20px",
      fontWeight: "normal",
      textTransform: "none",
      fontSize: "16px",
      "&:hover": {
        backgroundColor: "#0941AC",
      },
    },
    notchedOutline: {
      borderWidth: "1px",
      borderColor: "#EEEEF2 !important",
    },
  })
);

const SignIn = (props: BasePageProps): JSX.Element => {
  titleService.setTitle(props.title);

  const { contextMethods } = useAppContext();
  const history = useHistory();
  const classes = useStyles();

  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const form = {
    email: register("email", {
      pattern: EMAIL_PATTERN,
      required: true,
    }),
    password: register("password", {
      required: true,
    }),
  };

  const onSubmit = async (inputData: any) => {
    setError(false);
    setReason('');

    const { email, password } = inputData;
    const { status, data } = await signIn(email, password);

    if (status === 200) {
      contextMethods.setUserName(`${data.user.firstName} ${data.user.lastName}`);
      contextMethods.setUserEmail(data.user.email);
      contextMethods.setAccessToken(data.credentials.accessToken);
      contextMethods.setRefreshToken(data.credentials.refreshToken);
      contextMethods.setAccessExpMS(data.credentials.accessExpMS);
      contextMethods.setRefreshExpMS(data.credentials.refreshExpMS);
      contextMethods.setIsAuthorized(true);
      history.push('/dashboard');
    }

    setError(true);
    setReason(data as unknown as string);
  };

  return (
    <div className="auth-container">
      <div className="auth-container__asside">
        <img src={logo} className="auth-container__logo" alt="aside" />
      </div>

      <div className="auth-container__form">
        <div className="form-wrapper">
          <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign In to PredictDb</h1>
            <div className="auth-container__title">
              Welcome back, please sign in or sign up to browse our PDC Models.
            </div>
            <div className="form__row">
              <TextField
                label="Email address"
                type="email"
                variant="outlined"
                error={Boolean(errors?.email)}
                {...form.email}
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                InputLabelProps={{
                  className: "form__input",
                }}
                helperText={Boolean(errors?.email) && "Incorrect email"}
              />
            </div>
            <div className="form__row">
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                error={Boolean(errors?.password)}
                {...form.password}
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                InputLabelProps={{
                  className: "form__input",
                }}
                helperText={Boolean(errors?.password) && "Password required"}
              />
            </div>
            <div className="form__row">
              <div className="form__link form__link_text-right">
                <Link to={routes.forgotPassword}>Forgot password?</Link>
              </div>
            </div>
            <div className="form__row">
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                Sign In
              </Button>
            </div>
            {error && reason && <div className="form__row red">
              {reason}
            </div>}
            <div className="form__row">
              <div className="form__link form__link_text-center form__link_switcher">
                Don’t have an account?&nbsp;
                <Link to={routes.signUp}>Sign Up</Link>
              </div>
            </div>
          </form>
        </div>
        <div className="auth-container__license">Imagen Therapeutics ©</div>
      </div>
    </div>
  );
};

export default SignIn;
