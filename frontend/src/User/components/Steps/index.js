import React, {useEffect, useState} from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import qs from "query-string";
import { Stepper, Step, StepLabel, MobileStepper, Hidden, withStyles, Button } from "@material-ui/core";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import "./steps.css";

const getThemeId = (params) => {
  return parseInt(params.themeId) || 0;
};

const getScenarioId = (params) => {
  return parseInt(params.scenarioId) || 0;
};

const steps = [{
  name: "Choix du scénario",
  back: (params) => `/creer/1-choix-du-scenario?themeId=${getThemeId(params)}`,
}, {
  name: "Choix des questions",
  back: (params) => `/creer/2-choix-des-questions?themeId=${getThemeId(params)}&scenarioId=${getScenarioId(params)}`,
}, {
  name: "A votre caméra !",
  back: () => '/creer',
}, {
  name: "Résultat final",
  back: () => '/creer',
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
  const [ params, setParams ] = useState({});

  useEffect(() => {
    setIsNewPage(props.location.pathname.indexOf('new') !== -1);
    setParams(qs.parse(props.location.search, { ignoreQueryPrefix: true }));
  }, [props.location]);

  const handleBack = (index) => {
    if (index < 0) {
      props.history.push('/creer');
    } else if (index < props.activeStep || (index === props.activeStep && isNewPage)) {
      props.history.push(steps[index].back(params));
    }
  };

  return <div>
    <Hidden smDown>
      <Stepper activeStep={props.activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.name} style={{cursor: "pointer"}} onClick={(event) => {
            event.preventDefault();
            handleBack(index);
          }}>
            <StepLabel>{step.name}</StepLabel>
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
          <Button size="medium" onClick={() => handleBack(isNewPage ? props.activeStep : props.activeStep - 1)} className="back-button">
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
