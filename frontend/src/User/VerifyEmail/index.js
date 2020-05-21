import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import qs from "query-string";
import { withRouter, Redirect } from "react-router";
import { makeStyles, Backdrop, CircularProgress } from "@material-ui/core";
import { UserServiceContext } from "../../services/UserService";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

function VerifyEmail(props) {
  const { verifyEmail } = useContext(UserServiceContext);
  const classes = useStyles();
  const user = {
    email:
      qs.parse(props.location.search.replace(/&amp;/g, "&"), { ignoreQueryPrefix: true }).email || "",
    verifyToken:
      qs.parse(props.location.search.replace(/&amp;/g, "&"), { ignoreQueryPrefix: true })[
        "verify-token"
      ] || ""
  };

  const submit = async () => {
    await verifyEmail(user);
    props.history.push("/");
  };

  useEffect(() => {
    submit().catch();
    // eslint-disable-next-line
  }, []);

  if (user.email.length === 0 || user.verifyToken.length === 0) {
    return <Redirect path="/" />;
  }

  return (
    <div className="text-center">
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

VerifyEmail.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(VerifyEmail);
