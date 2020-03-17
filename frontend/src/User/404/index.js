import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {Button, Typography} from "@material-ui/core";

function NotFound(props) {
  const handleClick = (event) => {
    event.preventDefault();
    props.history.push("/");
  };

  return (
    <div>
      <div className="text-center">
        <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>Oups, cette page n&apos;existe pas !</Typography>
        <Button
          component="a"
          className="mobile-full-width"
          href="/"
          variant="contained"
          color="secondary"
          onClick={handleClick}
          style={{ marginTop: "3rem" }}>
          Revenir à l&apos;accueil
        </Button>
      </div>
    </div>
  );
}

NotFound.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(NotFound);
