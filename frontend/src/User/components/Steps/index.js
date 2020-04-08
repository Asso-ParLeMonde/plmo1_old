import React, { useContext, useEffect, useState } from "react";
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
  Button,
} from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import { ProjectServiceContext } from "../../../services/ProjectService";
import ProjectTitle from "../ProjectTitle";
import { useTranslation } from "react-i18next";

import "./steps.css";

const steps = [
  {
    name: (t, activeStep, project) =>
      activeStep > 0 ? project.scenarioName || t("step1") : t("step1"),
    back: "/create/1-scenario-choice",
  },
  {
    name: (t) => t("step2"),
    back: "/create/2-questions-choice",
  },
  {
    name: (t) => t("step3"),
    back: "/create/3-storyboard-and-filming-schedule",
  },
  {
    name: (t) => t("step4"),
    back: "/create",
  },
  {
    name: (t) => t("step5"),
    back: "/create",
  },
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
  const { t } = useTranslation();
  const { project } = useContext(ProjectServiceContext);
  const [isNewPage, setIsNewPage] = useState(false);
  const [isDrawPage, setIsDrawPage] = useState(false);

  useEffect(() => {
    setIsNewPage(
      props.location.pathname.indexOf("new") !== -1 ||
        props.location.pathname.indexOf("edit") !== -1
    );
    setIsDrawPage(props.location.pathname.indexOf("draw") !== -1);
  }, [props.location]);

  const handleBack = (index) => (event) => {
    event.preventDefault();
    if (index < 0) {
      props.history.push("/create");
    } else if (index === 2 && isDrawPage) {
      const questionIndex =
        parseInt(
          qs.parse(props.location.search, { ignoreQueryPrefix: true }).question
        ) || 0;
      const planIndex =
        parseInt(
          qs.parse(props.location.search, { ignoreQueryPrefix: true }).plan
        ) || 0;
      props.history.push(
        `/create/3-storyboard-and-filming-schedule/edit?question=${questionIndex}&plan=${planIndex}`
      );
    } else if (
      index < props.activeStep ||
      (index === props.activeStep && isNewPage)
    ) {
      props.history.push(steps[index].back);
    }
  };

  const handleProjectTitleClick = () => {
    props.history.push(`/create/edit-project/${project.id}`);
  };

  return (
    <div>
      <Hidden smDown>
        {props.activeStep > 0 && (
          <ProjectTitle onClick={handleProjectTitleClick} />
        )}
        <Stepper activeStep={props.activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step
              key={step.name(t, props.activeStep, project)}
              style={{ cursor: "pointer" }}
              onClick={handleBack(index)}
            >
              <StepLabel>{step.name(t, props.activeStep, project)}</StepLabel>
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
            <Button
              size="medium"
              onClick={handleBack(
                isNewPage || isDrawPage
                  ? props.activeStep
                  : props.activeStep - 1
              )}
              className="back-button"
            >
              <KeyboardArrowLeft />
              {t("back")}
            </Button>
          }
        />
        {props.activeStep > 0 && (
          <ProjectTitle onClick={handleProjectTitleClick} smaller />
        )}
      </Hidden>
    </div>
  );
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
