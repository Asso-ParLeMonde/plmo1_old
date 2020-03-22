import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link, Typography } from "@material-ui/core";
import CreateAccountForm, {
  DEFAULT_USER
} from "../../components/CreateAccountForm";

function Signup(props) {
  const [user, setUser] = useState(DEFAULT_USER);

  const handleLinkClick = path => event => {
    event.preventDefault();
    props.history.push(path);
  };

  const handleSubmit = user => {
    console.log(user);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        Création du compte classe
      </Typography>
      <CreateAccountForm user={user} setUser={setUser} submit={handleSubmit} />
      <div className="text-center" style={{ marginBottom: "2rem" }}>
        Compte déjà créé ?{" "}
        <Link href="/login" onClick={handleLinkClick("/login")}>
          Se connecter
        </Link>
      </div>
    </div>
  );
}

Signup.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Signup);
