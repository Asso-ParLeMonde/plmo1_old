import React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {Typography} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";

function EditPlans() {
  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Créez votre plan !
        </Typography>
        <Typography color="inherit" variant="h2">
          Blabla bla...
        </Typography>
      </div>
    </div>
  );
}

EditPlans.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(EditPlans);
