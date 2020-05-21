import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import qs from "query-string";
import { withRouter, Redirect } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { UserServiceContext } from "../../services/UserService";
import Notifications from "../../components/Notifications";

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

const checks = {
  password: (value) => strongPassword.test(value),
  passwordConfirm: (value, user) => value === user.password,
};

function UpdatePassword(props) {
  const { t } = useTranslation();
  const { updatePassword } = useContext(UserServiceContext);
  const [user, setUser] = useState({
    email:
      qs.parse(props.location.search.replace(/&amp;/g, "&"), { ignoreQueryPrefix: true }).email || "",
    verifyToken:
      qs.parse(props.location.search.replace(/&amp;/g, "&"), { ignoreQueryPrefix: true })[
        "verify-token"
      ] || "",
    password: "",
    passwordComfirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: false,
    passwordConfirm: false,
    global: false,
  });
  const [res, setRes] = useState({ complete: false });

  const submit = async (event) => {
    event.preventDefault();
    // Check form validity
    let isFormValid = true;
    for (let userKey of ["password", "passwordConfirm"]) {
      if (!checks[userKey](user[userKey], user)) {
        isFormValid = false;
        setErrors((e) => ({ ...e, [userKey]: true }));
      }
    }

    if (!isFormValid) {
      setErrors((e) => ({ ...e, global: true }));
      return;
    }

    const response = await updatePassword(user);
    if (response.success) {
      props.history.push("/");
    } else {
      setRes({
        complete: true,
        error: true,
        message: t("update_password_un_error"),
      });
    }
  };

  const handleInputChange = (userKey) => (event) => {
    setUser({ ...user, [userKey]: event.target.value });
    setErrors((e) => ({
      ...e,
      [userKey]: false,
      global: false,
    }));
  };

  const handleInputValidations = (userKey) => (event) => {
    const value = event.target.value || "";
    setErrors((e) => ({
      ...e,
      [userKey]: value.length !== 0 && !checks[userKey](value, user),
    }));
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (user.email.length === 0 || user.verifyToken.length === 0) {
    return <Redirect path="/" />;
  }

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        {t("update_password")}
      </Typography>{" "}
      <form className="login-form" noValidate autoComplete="off">
        {errors.global && (
          <Typography variant="caption" color="error">
            {t("update_password_error")}
          </Typography>
        )}
        <TextField
          type={showPassword ? "text" : "password"}
          color="secondary"
          id="password"
          name="password"
          label={t("login_password")}
          value={user.password || ""}
          onChange={handleInputChange("password")}
          onBlur={handleInputValidations("password")}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}{" "}
                </IconButton>{" "}
              </InputAdornment>
            ),
          }}
          fullWidth
          error={errors.password}
          helperText={errors.password ? t("signup_password_error") : ""}
        />
        <TextField
          type={showPassword ? "text" : "password"}
          color="secondary"
          id="passwordComfirm"
          name="passwordComfirm"
          label={t("signup_password_confirm")}
          value={user.passwordConfirm || ""}
          onChange={handleInputChange("passwordConfirm")}
          onBlur={handleInputValidations("passwordConfirm")}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}{" "}
                </IconButton>{" "}
              </InputAdornment>
            ),
          }}
          fullWidth
          error={errors.passwordConfirm}
          helperText={
            errors.passwordConfirm ? t("signup_password_confirm_error") : ""
          }
        />
        <Button variant="contained" color="secondary" onClick={submit}>
          {t("validate")}
        </Button>
      </form>
      <Notifications res={res} />
    </div>
  );
}

UpdatePassword.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(UpdatePassword);
