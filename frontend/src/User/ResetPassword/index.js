import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Button, Link, TextField, Typography } from "@material-ui/core";
import { axiosRequest } from "../../components/axiosRequest";
import { useTranslation } from "react-i18next";

const errorMessages = {
  0: "login_unknown_error",
  1: "login_email_error",
};

function ResetPassword(props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [errorCode, setErrorCode] = useState(-1);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUserNameInputChange = (event) => {
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
        email,
      },
    });
    if (response.error && response.complete) {
      setErrorCode(response.data.errorCode);
    } else {
      setSuccessMsg("forgot_password_success");
    }
  };

  const handleLinkClick = (path) => (event) => {
    event.preventDefault();
    props.history.push(path);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        {t("forgot_password_title")}
      </Typography>
      <form className="login-form" noValidate autoComplete="off">
        {errorCode === 0 && (
          <Typography variant="caption" color="error">
            {t(errorMessages[0])}
          </Typography>
        )}

        {successMsg.length > 0 && (
          <Typography variant="caption" color="primary">
            {t(successMsg)}
          </Typography>
        )}

        <TextField
          id="username"
          name="username"
          type="text"
          color="secondary"
          label={t("login_username")}
          value={email}
          onChange={handleUserNameInputChange}
          variant="outlined"
          fullWidth
          error={errorCode === 1}
          helperText={errorCode === 1 ? t(errorMessages[1]) : null}
        />

        <Button variant="contained" color="secondary" onClick={submit}>
          {t("forgot_password_button")}
        </Button>

        <div className="text-center">
          <Link href="/login" onClick={handleLinkClick("/login")}>
            {t("login_connect")}
          </Link>
        </div>
      </form>
    </div>
  );
}

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(ResetPassword);
