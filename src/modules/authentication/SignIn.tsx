import React from "react";
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

  const appCTX = useAppContext();
  const history = useHistory();
  const classes = useStyles();

  const [error, setError] = React.useState(false);
  const [reason, setReason] = React.useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const form = {
    email: register("email", { pattern: EMAIL_PATTERN, required: true, }),
    password: register("password", { required: true, }),
  };

  const UNMOUNTED = 'unmounted'
  const NOT_FOUND = 'Not found';
  const logReason = (reason: any) => reason === UNMOUNTED || console.log('[ reason ]', reason);

  const onSubmit = (inputData: any) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; logReason(reason) })

    const setState = (success: any) => {
      if (success === NOT_FOUND) return history.push(routes.signIn)
      if (/200/g.test(success.status) === false || ("data" in success) === false) {
        setError(true)
        return setReason(success.data || "Unexpected error")
      }
      const state = {
        access_token: success.data.credentials.accessToken,
        user_name: `${success.data.user.firstName} ${success.data.user.lastName}`,
        user_email: success.data.user.email,
        refresh_token: success.data.credentials.refreshToken,
        access_token_expires: success.data.credentials.accessExpMS,
        refresh_token_expires: success.data.credentials.refreshExpMS,
        is_authorized: true,
      }
      appCTX.controls.updateState(state)
      return history.push(routes.dashboard.base)
    }

    if (!canceled) {
      const { email, password } = inputData;
      signIn(email, password)
        .then(success => canceled || !success || setState(success))
        .catch(cancel)
        .finally(() => canceled)
    }


    return cancel;
  };

  return (
    <div className="auth-container">
      <div className="auth-container__aside">
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
                autoComplete="email"
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
                autoComplete="current-password"
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
