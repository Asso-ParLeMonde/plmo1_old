import React, {useContext, useEffect, useState} from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import qs from "query-string";
import {
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  Hidden,
  withStyles,
  Button
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import {ProjectServiceContext} from "../../../services/ProjectService";

import "./steps.css";


const steps = [{
  name: (activeStep, project) => activeStep > 0 ? (project.scenarioName || "Choix du scénario") : "Choix du scénario",
  back: "/create/1-scenario-choice",
}, {
  name: () => "Choix des questions",
  back: "/create/2-questions-choice",
}, {
  name: () => "Storyboard et plan de tournage",
  back: "/create/3-storyboard-and-filming-schedule",
}, {
  name: () => "A votre caméra !",
  back: "/create",
}, {
  name: () => "Résultat final",
  back: "/create",
}
];

const StyleMobileStepper = withStyles(theme => ({
  root: {
    position: "relative",
    margin: "1rem 0"
  },
  dot: {
    backgroundColor: "white",
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
    width: "13px",
    height: "13px",
    margin: "0 4px"
  },
  dotActive: {
    backgroundColor: (theme.palette.secondary || {}).main
  }
}))(MobileStepper);

function Steps(props) {
  const { project } = useContext(ProjectServiceContext);
  const [ isNewPage, setIsNewPage ] = useState(false);
  const [ isDrawPage, setIsDrawPage ] = useState(false);

  useEffect(() => {
    setIsNewPage(props.location.pathname.indexOf("new") !== -1 || props.location.pathname.indexOf("edit") !== -1);
    setIsDrawPage(props.location.pathname.indexOf("draw") !== -1);
  }, [props.location]);

  const handleBack = index => event => {
    event.preventDefault();
    if (index < 0) {
      props.history.push("/create");
    } else if (index === 2 && isDrawPage) {
      const questionIndex = parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).question) || 0;
      const planIndex = parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).plan) || 0;
      props.history.push(`/create/3-storyboard-and-filming-schedule/edit?question=${questionIndex}&plan=${planIndex}`);
    } else if (index < props.activeStep || (index === props.activeStep && isNewPage)) {
      props.history.push(steps[index].back);
    }
  };

  return <div>
    <Hidden smDown>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.name(props.activeStep, project)} style={{cursor: "pointer"}} onClick={handleBack(index)}>
            <StepLabel>{step.name(props.activeStep, project)}</StepLabel>
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
          <Button size="medium" onClick={handleBack((isNewPage || isDrawPage) ? props.activeStep : props.activeStep - 1)} className="back-button">
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
  activeStep: PropTypes.number
};

Steps.defaultProps = {
  activeStep: 0
};

export default withRouter(Steps);
