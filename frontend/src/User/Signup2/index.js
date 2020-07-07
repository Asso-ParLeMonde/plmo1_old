import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import qs from "query-string";
import { withRouter, Redirect } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Link,
  Typography,
  makeStyles,
  Backdrop,
  CircularProgress,
  TextField,
  Button,
} from "@material-ui/core";
import CreateAccountForm, {
  DEFAULT_USER,
} from "../../components/CreateAccountForm";
import { UserServiceContext } from "../../services/UserService";
import { axiosRequest } from "../../components/axiosRequest";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const checkInviteCode = async (code) => {
  const response = await axiosRequest({
    method: "GET",
    url: `/users/check-invite/${code}`,
  });
  if (response.complete && !response.error) {
    return response.data.isValid;
  }
  return false;
};

function Signup(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { isLoggedIn, signup } = useContext(UserServiceContext);
  const [user, setUser] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);
  const [inviteCodeValue, setInviteCodeValue] = useState("");
  const [inviteCodeError, setInviteCodeError] = useState(false);
  const inviteCodeURL =
    qs.parse(props.location.search, { ignoreQueryPrefix: true }).inviteCode ||
    "";

  const handleLinkClick = (path) => (event) => {
    event.preventDefault();
    props.history.push(path);
  };

  const handleSubmit = async (user) => {
    setLoading(true);
    const response = await signup(user, inviteCode);
    if (response.success) {
      props.history.push("/");
    } else {
      console.log(response.errorCode);
    }
    setLoading(false);
  };

  const handleInviteCodeSubmit = async (event) => {
    event.preventDefault();

    if (!(await checkInviteCode(inviteCodeValue))) {
      setInviteCodeError(true);
      return;
    }

    setInviteCode(inviteCodeValue);
  };

  const handleInviteFromURL = useCallback(async (code) => {
    if (code.length > 0) {
      if (!(await checkInviteCode(code))) {
        setInviteCodeValue(code);
        setInviteCodeError(true);
        return;
      }
      setInviteCode(code);
    }
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      setInviteCodeValue(qs.parseUrl(value).query.inviteCode || value);
    } else {
      setInviteCodeValue(value);
    }
    setInviteCodeError(false);
  };

  useEffect(() => {
    handleInviteFromURL(inviteCodeURL).catch();
  }, [inviteCodeURL, handleInviteFromURL]);

  if (isLoggedIn()) {
    return <Redirect to="/" />;
  }

  return (
    <div className="text-center">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        {t("signup_title")}
      </Typography>

      {inviteCode === null ? (
        <form
          className="signup-form"
          noValidate
          autoComplete={"off"}
          style={{ textAlign: "left" }}
        >
          <label style={{ fontWeight: "bold", fontSize: "1rem" }}>
            {t("signup_invite_title")}
          </label>
          <TextField
            id="inviteCode"
            name="inviteCode"
            type="text"
            color="secondary"
            label={t("signup_invite_placeholder")}
            value={inviteCodeValue}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            error={inviteCodeError}
            helperText={inviteCodeError ? t("signup_invite_error") : ""}
            style={{ marginTop: "1rem" }}
          />
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            value="Submit"
            onClick={handleInviteCodeSubmit}
          >
            {t("continue")}
          </Button>
        </form>
      ) : (
        <CreateAccountForm
          user={user}
          setUser={setUser}
          submit={handleSubmit}
          invite
        />
      )}

      <div className="text-center" style={{ marginBottom: "2rem" }}>
        {t("signup_already")}{" "}
        <Link href="/login" onClick={handleLinkClick("/login")}>
          {t("login_connect")}
        </Link>
      </div>
    </div>
  );
}

Signup.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Signup);
