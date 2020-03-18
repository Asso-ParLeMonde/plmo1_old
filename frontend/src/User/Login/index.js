import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {Typography, TextField, InputAdornment, IconButton, Button, FormControlLabel, Checkbox, Link} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {UserServiceContext} from "../../services/UserService";

import "./login.css";
import qs from "query-string";

const errorMessages = {
  0: "Une erreur inconnue est survenue. Veuillez réessayer plus tard...",
  1: "E-mail ou pseudo invalide",
  2: "Mot de passe invalide",
  3: "Compte bloqué, trop de tentatives de connexion. Veuillez réinitialiser votre mot de passe."
};

function Login(props) {
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
      setRedirect(decodeURI(qs.parse(props.location.search, { ignoreQueryPrefix: true }).redirect || "/"));
    } catch (e) {
      setRedirect("/");
    }
  }, [props.location.search]);

  const handleUserNameInputChange = event => {
    setUser({ ...user, username: event.target.value });
    if (errorCode === 1) {
      setErrorCode(-1);
    }
  };

  const handlePasswordInputChange = event => {
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
      setErrorCode(response.errorCode);
    }
  };

  const handleLinkClick = path => (event) => {
    event.preventDefault();
    props.history.push(path);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        { redirect === "/admin" ? "Connexion à votre compte" : "Connexion à votre compte classe" }
      </Typography>
      <form className="login-form" noValidate>
        {(errorCode === 0 || errorCode === 3) && (
          <Typography variant="caption" color="error">
            {errorMessages[errorCode]}
          </Typography>
        )}
        <TextField
          id="username"
          name="username"
          type="text"
          color="secondary"
          label="E-mail ou pseudo de la classe"
          value={user.username}
          onChange={handleUserNameInputChange}
          variant="outlined"
          fullWidth
          error={errorCode === 1}
          helperText={errorCode === 1 ? errorMessages[1] : null}
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          color="secondary"
          id="password"
          name="password"
          label="Mot de passe"
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
          helperText={errorCode === 2 ? errorMessages[2] : null}
        />
        <div>
          <FormControlLabel
            control={
              <Checkbox checked={user.localSave} onChange={handleToggleLocalSave} value={user.localSave} />
            }
            label="Se souvenir de moi"
          />
        </div>
        <Button variant="contained" color="secondary" type="submit" value="Submit" onClick={submit}>
          Se connecter
        </Button>
        <div className="text-center">
          <Link href="/reset-password" onClick={handleLinkClick("/reset-password")}>
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="text-center">
          Nouveau sur Par Le Monde ? <Link href="/signup" onClick={handleLinkClick("/signup")}>S&apos;inscrire</Link>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Login);
