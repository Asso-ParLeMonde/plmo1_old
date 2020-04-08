import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import qs from "query-string";
import { useTranslation } from "react-i18next";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { UserServiceContext } from "../../services/UserService";

import "./login.css";

const errorMessages = {
  0: "login_unknown_error",
  1: "login_username_error",
  2: "login_password_error",
  3: "login_account_error",
};

function Login(props) {
  const { t } = useTranslation();
  const { login } = useContext(UserServiceContext);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
    localSave: false,
  });
  const [errorCode, setErrorCode] = useState(-1);
  const [redirect, setRedirect] = useState("/");

  useEffect(() => {
    try {
      setRedirect(
        decodeURI(
          qs.parse(props.location.search, { ignoreQueryPrefix: true })
            .redirect || "/"
        )
      );
    } catch (e) {
      setRedirect("/");
    }
  }, [props.location.search]);

  const handleUserNameInputChange = (event) => {
    setUser({ ...user, username: event.target.value });
    if (errorCode === 1) {
      setErrorCode(-1);
    }
  };

  const handlePasswordInputChange = (event) => {
    setUser({ ...user, password: event.target.value });
    if (errorCode === 2) {
      setErrorCode(-1);
    }
  };

  const handleToggleLocalSave = () => {
    setUser({ ...user, localSave: !user.localSave });
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submit = async (event) => {
    event.preventDefault();
    setErrorCode(-1);
    const response = await login(user.username, user.password, user.localSave);
    if (response.success) {
      props.history.push(redirect);
    } else {
      setErrorCode(response.errorCode || 0);
    }
  };

  const handleLinkClick = (path) => (event) => {
    event.preventDefault();
    props.history.push(path);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        {redirect.slice(0, 6) === "/admin"
          ? t("login_title_admin")
          : t("login_title")}
      </Typography>
      <form className="login-form" noValidate>
        {(errorCode === 0 || errorCode === 3) && (
          <Typography variant="caption" color="error">
            {t(errorMessages[errorCode])}
          </Typography>
        )}
        <TextField
          id="username"
          name="username"
          type="text"
          color="secondary"
          label={t("login_username")}
          value={user.username}
          onChange={handleUserNameInputChange}
          variant="outlined"
          fullWidth
          error={errorCode === 1}
          helperText={errorCode === 1 ? t(errorMessages[1]) : null}
        />
        <TextField
          type={showPassword ? "text" : "password"}
          color="secondary"
          id="password"
          name="password"
          label={t("login_password")}
          value={user.password}
          onChange={handlePasswordInputChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          error={errorCode === 2}
          helperText={errorCode === 2 ? t(errorMessages[2]) : null}
        />
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={user.localSave}
                onChange={handleToggleLocalSave}
                value={user.localSave}
              />
            }
            label={t("login_remember_me")}
          />
        </div>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          value="Submit"
          onClick={submit}
        >
          {t("login_connect")}
        </Button>
        <div className="text-center">
          <Link
            href="/reset-password"
            onClick={handleLinkClick("/reset-password")}
          >
            {t("login_forgot_password")}
          </Link>
        </div>
        <div className="text-center">
          {t("login_new")}{" "}
          <Link href="/signup" onClick={handleLinkClick("/signup")}>
            {t("login_signup")}
          </Link>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Login);
