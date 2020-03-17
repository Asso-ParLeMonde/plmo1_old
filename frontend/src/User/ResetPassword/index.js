import React, {useState} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {Button, Link, TextField, Typography} from "@material-ui/core";

function ResetPassword(props) {
  const [user, setUser] = useState({
    username: "",
  });

  const handleUserNameInputChange = event => {
    setUser({ ...user, username: event.target.value });
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
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>Réinitialiser le mot de passe</Typography>
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

        <Button variant="contained" color="secondary" onClick={submit}>
          Réinitialiser
        </Button>

        <div className="text-center">
          <Link href="/login" onClick={handleLinkClick("/login")}>
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ResetPassword);
