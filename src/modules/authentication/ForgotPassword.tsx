import React, { useState } from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";

import { EMAIL_PATTERN } from "constants/validators";

import logo from "assets/images/logo_white.svg";

import titleService from "../../services/title.service";
import { BasePageProps } from "../../shared/models";

import { sendRecoveryLink } from "../../api/auth.api";
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

const ForgotPassword = (props: BasePageProps): JSX.Element => {
  titleService.setTitle(props.title);

  const classes = useStyles();
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
  };

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');

  const onSubmit = async (inputData: any) => {
    const { email } = inputData;
    const { status, data } = await sendRecoveryLink(email);

    if (status === 200 && data === 'Success') {
      setSuccess(true);
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
          <div className="form-wrapper forgot-password">
            <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
              <h1>Recovery password</h1>
              <div className="auth-container__title">
                Please type your email to send a recovery link
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
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Send recovery link
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

        {success && !error && (
          <div className="form-wrapper forgot-password-message">
            <h1>Success!</h1>
            <div className="auth-container__title">
              We've sent a recovery link. Please check your inbox.
            </div>
            <div className="form__row">
              <div className="form__link form__link_text-center form__link_switcher">
                Sign in again?&nbsp;
                <Link to={routes.signIn}>Sign In</Link>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="form-wrapper forgot-password-message">
            <h1>Something is going wrong!</h1>
            <div className="auth-container__title">
              We weren't able to send a recovery link<br />
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

export default ForgotPassword;
