import React, { useState } from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";

import { Button, TextField, FormControlLabel } from "@material-ui/core";

import { EMAIL_PATTERN } from "constants/validators";

import logo from "assets/images/logo_white.svg";

import titleService from '../../services/title.service';
import { BasePageProps } from "../../shared/models";

import CustomCheckbox from "shared/components/CustomCheckbox";

import { signUp } from "../../api/auth.api";
import { routes } from "../../routes";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      "& .MuiTextField-root": {
        width: "100%",
      },
      width: "80%",
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

const SignUp = (props: BasePageProps): JSX.Element => {
  titleService.setTitle(props.title);

  const classes = useStyles();
  const history = useHistory();

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showAcceptTermsError, setShowAcceptTermsError] = useState(false);
  const [showUserExistsError, setShowUserExistsError] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const form = {
    email: register("email", {
      pattern: EMAIL_PATTERN,
      required: true,
    }),
    firstName: register("firstName", {
      required: true,
    }),
    lastName: register("lastName", {
      required: true,
    }),
    companyName: register("companyName", {
      required: true,
    }),
    jobTitle: register("jobTitle", {
      required: true,
    }),
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

  const onAcceptTermsClick = () => {
    setAcceptTerms(!acceptTerms);
    setShowAcceptTermsError(false);
  };

  const onSubmit = async (inputData: any) => {
    const email = inputData.email.trim()
    const firstName = inputData.firstName.trim()
    const lastName = inputData.lastName.trim()
    const companyName = inputData.companyName.trim()
    const jobTitle = inputData.jobTitle.trim()
    const password = inputData.password.trim()
    const confirmPassword = inputData.confirmPassword.trim()

    setShowAcceptTermsError(false);
    setShowUserExistsError(false);

    if (!acceptTerms) return setShowAcceptTermsError(true);

    const { data, status } = await signUp(
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      companyName,
      jobTitle,
    );

    if (status === 403 || !data) return setShowUserExistsError(true);

    return history.push('/sign-in');
  };

  return (
    <div className="auth-container">
      <div className="auth-container__aside">
        <img src={ logo } className="auth-container__logo" alt="aside"/>
      </div>

      <div className="auth-container__form">
        <div className="form-wrapper sign-up">
          <form className={ classes.root } onSubmit={ handleSubmit(onSubmit) }>
            <h1>Sign Up to PredictDb</h1>
            <div className="auth-container__title">
              Welcome to PredictDb, please sign up to start browsing our PDC Models.
            </div>
            <div className="form__grid">
              <div className="form__column">
                <div className="form__row">
                  <TextField
                    label="First name"
                    variant="outlined"
                    error={ Boolean(errors?.firstName) }
                    { ...form.firstName }
                    InputProps={ {
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    } }
                    InputLabelProps={ {
                      className: "form__input",
                    } }
                    helperText={ Boolean(errors?.firstName) && "First name is required" }
                  />
                </div>
                <div className="form__row">
                  <TextField
                    label="Last name"
                    variant="outlined"
                    error={ Boolean(errors?.lastName) }
                    { ...form.lastName }
                    InputProps={ {
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    } }
                    InputLabelProps={ {
                      className: "form__input",
                    } }
                    helperText={ Boolean(errors?.lastName) && "Last name is required" }
                  />
                </div>
                <div className="form__row">
                  <TextField
                    label="Company name"
                    variant="outlined"
                    error={ Boolean(errors?.companyName) }
                    { ...form.companyName }
                    InputProps={ {
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    } }
                    InputLabelProps={ {
                      className: "form__input",
                    } }
                    helperText={ Boolean(errors?.companyName) && "Company name is required" }
                  />
                </div>
                <div className="form__row">
                  <TextField
                    label="Job title"
                    variant="outlined"
                    error={ Boolean(errors?.jobTitle) }
                    { ...form.jobTitle }
                    InputProps={ {
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    } }
                    InputLabelProps={ {
                      className: "form__input",
                    } }
                    helperText={ Boolean(errors?.jobTitle) && "Job title is required" }
                  />
                </div>
              </div>
              <div className="form__column">
                <div className="form__row">
                  <TextField
                    label="Email address (business)"
                    type="email"
                    variant="outlined"
                    error={ Boolean(errors?.email) }
                    { ...form.email }
                    InputProps={ {
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    } }
                    InputLabelProps={ {
                      className: "form__input",
                    } }
                    helperText={ Boolean(errors?.email) && "Incorrect email" }
                  />
                </div>
                <div className="form__row">
                  <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    error={ Boolean(errors?.password) }
                    { ...form.password }
                    InputProps={ {
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    } }
                    InputLabelProps={ {
                      className: "form__input",
                    } }
                    helperText={ Boolean(errors?.password) && "Password is required" }
                  />
                </div>
                <div className="form__row">
                  <TextField
                    type="password"
                    label="Confirm password"
                    variant="outlined"
                    error={ Boolean(errors?.confirmPassword) }
                    { ...form.confirmPassword }
                    InputProps={ {
                      classes: {
                        notchedOutline: classes.notchedOutline,
                      },
                    } }
                    InputLabelProps={ {
                      className: "form__input",
                    } }
                    helperText={
                      Boolean(errors?.confirmPassword) && "Passwords mismatch"
                    }
                  />
                </div>
                <div className="form__row accept_terms">
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={acceptTerms}
                        onChange={() => onAcceptTermsClick()}
                      />
                    }
                    label={
                      <div>
                        <span>I agree with the </span> 
                        <a href={'https://imagentherapeutics.com/terms-of-use-predictdb'}>Terms of Service</a>
                      </div>
                    }
                  />
                  <p className={`acceptTermsError ${showAcceptTermsError ? 'error' : ''}`}>You must accept the Terms of Service</p>
                  <p className={`userExistsError ${showUserExistsError ? 'error' : ''}`}>User with this email already exists</p>
                </div>
              </div>
            </div>
            <div className="form__row center">
              <Button
                className={ classes.button }
                variant="contained"
                color="primary"
                type="submit"
              >
                Sign Up
              </Button>
            </div>
            <div className="form__row">
              <div className="form__link form__link_text-center form__link_switcher">
                Already have an account?&nbsp;
                <Link to={ routes.signIn }>Sign In</Link>
              </div>
            </div>
          </form>
        </div>
        <div className="auth-container__license">Imagen Therapeutics ©</div>
      </div>
    </div>
  );
};

export default SignUp;
