import React, { useState, useEffect } from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Link, useLocation, useHistory } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";

import logo from "assets/images/logo_white.svg";

import titleService from "../../services/title.service";
import { BasePageProps } from "../../shared/models";

import { checkRecoveryToken, resetPassword } from "../../api/auth.api";
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

const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword = (props: BasePageProps): JSX.Element => {
  titleService.setTitle(props.title);

  const classes = useStyles();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const form = {
    password: register("password", {
      required: true,
    }),
    confirmPassword: register("confirmPassword", {
      validate: (value) => {
        const password = getValues("password");

        return password === value;
      },
    }),
  };

  const query = useQuery();
  const history = useHistory();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [reason, setReason] = useState('');

  const checkToken = async () => {
    const queryToken = query.get("token");

    if (!queryToken) {
      setError(true);
      return;
    }

    setToken(queryToken!);

    const { status, data } = await checkRecoveryToken(queryToken!);

    if (status === 200) {
      setUserId(data.userId as string);
      return;
    }

    setError(true);
    setReason(data as unknown as string);
  }

  useEffect(() => {
    checkToken();
  }, []); // eslint-disable-line

  const onSubmit = async (inputData: any) => {
    const { password, confirmPassword } = inputData;
    const { status, data } = await resetPassword(userId, token, password, confirmPassword);

    if (status === 200 && data === 'Success') {
      setSuccess(true);
      history.push(routes.signIn);
      return;
    }

    setError(true);
    setReason(data);
  };

  return (
    <div className="auth-container">
      <div className="auth-container__aside">
        <img src={logo} className="auth-container__logo" alt="aside" />
      </div>

      <div className="auth-container__form">
        {!success && !error && (
          <div className="form-wrapper reset-password">
            <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
              <h1>Reset password</h1>
              <div className="auth-container__title">
                Please type your new password and confirmation
              </div>
              <div className="form__row">
                <TextField
                  type="password"
                  autoComplete="current-password"
                  label="Password"
                  variant="outlined"
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
                  helperText={Boolean(errors?.password) && "Password is required"}
                />
              </div>
              <div className="form__row">
                <TextField
                  type="password"
                  autoComplete="current-password"
                  label="Confirm password"
                  variant="outlined"
                  error={Boolean(errors?.confirmPassword)}
                  {...form.confirmPassword}
                  InputProps={{
                    classes: {
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                  InputLabelProps={{
                    className: "form__input",
                  }}
                  helperText={
                    Boolean(errors?.confirmPassword) && "Passwords mismatch"
                  }
                />
              </div>
              <div className="form__row">
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
              </div>
              <div className="form__row">
                <div className="form__link form__link_text-center form__link_switcher">
                  Remember your password?&nbsp;
                  <Link to={routes.signIn}>Sign In</Link>
                </div>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="form-wrapper reset-password-message">
            <h1>Something is going wrong!</h1>
            <div className="auth-container__title">
              We cannot finish the reset password procedure.<br />
              Reason: {reason}
            </div>
            <div className="form__row">
              <div className="form__link form__link_text-center form__link_switcher">
                Sign in again?&nbsp;
                <Link to={routes.signIn}>Sign In</Link>
              </div>
            </div>
          </div>
        )}

        <div className="auth-container__license">Imagen Therapeutics ©</div>
      </div>
    </div>
  );
};

export default ResetPassword;
