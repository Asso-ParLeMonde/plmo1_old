import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { Typography, Button, Hidden } from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import QuestionsList from "../../../components/QuestionsList";
import { ProjectServiceContext } from "../../../../services/ProjectService";

function AllQuestions(props) {
  const { project, updateProject } = useContext(ProjectServiceContext);

  const setQuestions = questions => {
    updateProject({ questions });
  };

  const handleBack = event => {
    event.preventDefault();
    props.history.push(`/create/2-questions-choice/new`);
  };

  const handleNext = event => {
    event.preventDefault();
    props.history.push(`/create/3-storyboard-and-filming-schedule`);
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>2</Inverted> Mes <Inverted>questions</Inverted>
        </Typography>
        <Typography color="inherit" variant="h2">
          Pour structurer votre scénario, nous vous proposons de sélectionner
          les questions qui feraient sens.
        </Typography>
        <Button
          component="a"
          variant="outlined"
          href={`/create/2-questions-choice/new`}
          color="secondary"
          onClick={handleBack}
          style={{
            textTransform: "none",
            fontWeight: "500",
            marginTop: "2rem"
          }}
        >
          Ajouter une question
        </Button>
        <QuestionsList
          questions={project.questions}
          setQuestions={setQuestions}
          history={props.history}
        />
        <Hidden smDown>
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button
              component="a"
              href={`/create/3-storyboard-and-filming-schedule`}
              color="secondary"
              onClick={handleNext}
              variant="contained"
              style={{ width: "200px" }}
            >
              Suivant
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            component="a"
            href={`/create/3-storyboard-and-filming-schedule`}
            color="secondary"
            onClick={handleNext}
            variant="contained"
            style={{ width: "100%", marginTop: "2rem" }}
          >
            Suivant
          </Button>
        </Hidden>
      </div>
    </div>
  );
}

AllQuestions.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  scenarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withRouter(AllQuestions);
