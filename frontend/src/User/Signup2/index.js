import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Link,
  Typography,
  makeStyles,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import CreateAccountForm, {
  DEFAULT_USER,
} from "../../components/CreateAccountForm";
import { UserServiceContext } from "../../services/UserService";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Signup(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { signup } = useContext(UserServiceContext);
  const [user, setUser] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(false);

  const handleLinkClick = (path) => (event) => {
    event.preventDefault();
    props.history.push(path);
  };

  const handleSubmit = async (user) => {
    setLoading(true);
    const response = await signup(user);
    if (response.success) {
      props.history.push("/");
    } else {
      console.log(response.errorCode);
    }
    setLoading(false);
  };

  return (
    <div className="text-center">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        {t("signup_title")}
      </Typography>
      <CreateAccountForm
        user={user}
        setUser={setUser}
        submit={handleSubmit}
        invite
      />
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
