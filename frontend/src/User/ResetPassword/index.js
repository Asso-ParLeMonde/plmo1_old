import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Button, Link, TextField, Typography } from "@material-ui/core";
import { axiosRequest } from "../../components/axiosRequest";

const errorMessages = {
  0: "Une erreur inconnue est survenue. Veuillez réessayer plus tard...",
  1: "E-mail invalide"
};

function ResetPassword(props) {
  const [email, setEmail] = useState("");
  const [errorCode, setErrorCode] = useState(-1);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUserNameInputChange = event => {
    setEmail(event.target.value);
    setErrorCode(-1);
  };

  const submit = async () => {
    setErrorCode(-1);
    setSuccessMsg("");
    const response = await axiosRequest({
      method: "POST",
      url: "/login/reset-password",
      data: {
        email
      }
    });
    if (response.error && response.complete) {
      setErrorCode(response.data.errorCode);
    } else {
      setSuccessMsg(
        "Un lien pour réinitialiser le mot de passe de votre compte a été envoyé avec succès à votre addresse e-mail !"
      );
    }
  };

  const handleLinkClick = path => event => {
    event.preventDefault();
    props.history.push(path);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        Réinitialiser le mot de passe
      </Typography>
      <form className="login-form" noValidate autoComplete="off">
        {errorCode === 0 && (
          <Typography variant="caption" color="error">
            {errorMessages[0]}
          </Typography>
        )}

        {successMsg.length > 0 && (
          <Typography variant="caption" color="primary">
            {successMsg}
          </Typography>
        )}

        <TextField
          id="username"
          name="username"
          type="text"
          color="secondary"
          label="E-mail ou pseudo de la classe"
          value={email}
          onChange={handleUserNameInputChange}
          variant="outlined"
          fullWidth
          error={errorCode === 1}
          helperText={errorCode === 1 ? errorMessages[1] : null}
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
