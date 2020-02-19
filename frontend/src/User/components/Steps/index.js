import React, {useEffect, useState} from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Stepper, Step, StepLabel, MobileStepper, Hidden, withStyles, Button } from "@material-ui/core";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import "./steps.css";

const steps = [{
  name: "Choix du scénario",
  back: "/creer/1-choix-du-scenario",
}, {
  name: "Choix des questions",
  back: "/creer/2-choix-des-questions",
}, {
  name: "Storyboard et plan de tournage",
  back: "/creer/3-storyboard-et-plan-de-tournage",
}, {
  name: "A votre caméra !",
  back: "/creer",
}, {
  name: "Résultat final",
  back: "/creer",
}
];

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
  const [ isNewPage, setIsNewPage ] = useState(false);

  useEffect(() => {
    setIsNewPage(props.location.pathname.indexOf('new') !== -1 || props.location.pathname.indexOf('edit') !== -1);
  }, [props.location]);

  const handleBack = index => event => {
    event.preventDefault();
    if (index < 0) {
      props.history.push('/creer');
    } else if (index < props.activeStep || (index === props.activeStep && isNewPage)) {
      props.history.push(steps[index].back);
    }
  };

  return <div>
    <Hidden smDown>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.name} style={{cursor: "pointer"}} onClick={handleBack(index)}>
            <StepLabel>{step.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Hidden>
    <Hidden mdUp>
      <StyleMobileStepper
        variant="dots"
        steps={steps.length}
        position="top"
        activeStep={props.activeStep}
        backButton={
          <Button size="medium" onClick={handleBack(isNewPage ? props.activeStep : props.activeStep - 1)} className="back-button">
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
