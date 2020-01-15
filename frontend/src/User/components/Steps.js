import React from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import qs from "query-string";
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
      if (props.location.pathname.indexOf('new') !== -1) {
        const themeId = parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).themeId) || 0;
        props.history.push(`/creer/1-choix-du-scenario?themeId=${themeId}`);
      } else {
        props.history.push("/creer");
      }
    }
  };

  return <div>
    <Hidden smDown>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} style={{cursor: "pointer"}} onClick={(event) => {
            event.preventDefault();
            if (index < props.activeStep) {
              handleBack();
            } else if (index === props.activeStep && props.location.pathname.indexOf('new') !== -1 ) {
              handleBack();
            }
          }}>
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
