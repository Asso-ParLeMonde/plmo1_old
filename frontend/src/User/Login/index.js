import React, {useState} from "react";
import {Typography, TextField, InputAdornment, IconButton, Button, FormControlLabel, Checkbox, Link} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";

import "./login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>Connexion à votre compte classe</Typography>
      <form className="login-form" noValidate autoComplete="off">
        <TextField
          id="outlined-name"
          type="text"
          color="secondary"
          label="E-mail ou pseudo de la classe"
          value={""}
          onChange={() => {}}
          variant="outlined"
          fullWidth
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          color="secondary"
          id="outlined-name"
          label="Mot de passe"
          value={""}
          onChange={() => {}}
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
        <FormControlLabel
          control={
            <Checkbox checked={false} onChange={() => {}} value={false} />
          }
          label="Se souvenir de moi"
        />
        <Button variant="contained" color="secondary">
          S&apos;identifier
        </Button>
        <div>
          <Link href="#" onClick={() => {}}>
            Mot de passe oublié ?
          </Link>
        </div>
        <div>
          Nouveau sur Par Le Monde ? <Link href="#" onClick={() => {}}>S&apos;inscrire</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
