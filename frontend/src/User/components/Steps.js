import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Stepper, Step, StepLabel, MobileStepper, Hidden, withStyles, Button } from "@material-ui/core";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import "./steps.css";

const steps = ["Choix du scénario", "Choix des questions", "A votre caméra !", "Résultat final"];

const StyleMobileStepper = withStyles((theme) => ({
  root: {
    position: "relative",
    margin: "1rem 0",
  },
  dot: {
    backgroundColor: "white",
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
    width: "13px",
    height: "13px",
    margin: "0 4px",
  },
  dotActive: {
    backgroundColor: (theme.palette.secondary || {}).main,
  },
}))(MobileStepper);

function Steps(props) {
  const handleBack = () => {
    if (props.activeStep === 0) {
      props.history.push("/themes");
    }
  };

  return <div>
    <Hidden smDown>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Hidden>
    <Hidden mdUp>
      <StyleMobileStepper
        variant="dots"
        steps={4}
        position="top"
        activeStep={props.activeStep}
        backButton={
          <Button size="medium" onClick={handleBack} className="back-button">
            <KeyboardArrowLeft />
            Retour
          </Button>
        }
      />
    </Hidden>
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
