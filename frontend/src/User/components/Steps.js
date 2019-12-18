import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Stepper, Step, StepLabel } from "@material-ui/core";

const steps = ["Choix du scénario", "Choix des questions", "A votre caméra !", "Résultat final"];

function Steps(props) {
  return <div>
    <Stepper activeStep={props.activeStep} alternativeLabel>
      {steps.map(label => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </div>
}

Steps.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  activeStep: PropTypes.number,
};

Steps.defaultProps = {
  activeStep: 0,
};

export default withRouter(Steps);
