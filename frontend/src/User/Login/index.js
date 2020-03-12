import React, {useState} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {Typography, TextField, InputAdornment, IconButton, Button, FormControlLabel, Checkbox, Link} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";

import "./login.css";

function Login(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
    localSave: false,
  });

  const handleUserNameInputChange = event => {
    setUser({ ...user, username: event.target.value });
  };

  const handlePasswordInputChange = event => {
    setUser({ ...user, password: event.target.value });
  };

  const handleToggleLocalSave = () => {
    setUser({ ...user, localSave: !user.localSave });
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submit = () => {
    console.log(user);
  };

  const handleLinkClick = path => (event) => {
    event.preventDefault();
    props.history.push(path);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>Connexion à votre compte classe</Typography>
      <form className="login-form" noValidate autoComplete="off">
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
        />
        <div>
          <FormControlLabel
            control={
              <Checkbox checked={user.localSave} onChange={handleToggleLocalSave} value={user.localSave} />
            }
            label="Se souvenir de moi"
          />
        </div>
        <Button variant="contained" color="secondary" onClick={submit}>
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
