import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

function Partie2() {
  return (
    <div>
      Partie 2
    </div>
  )
}

Partie2.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie2);
