import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { Typography, Button, Hidden } from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import QuestionsList from "../../../components/QuestionsList";
import { ProjectServiceContext } from "../../../../services/ProjectService";
import { UserServiceContext } from "../../../../services/UserService";
import { editQuestion, deleteQuestion } from "../../components/questionRequest";

function AllQuestions(props) {
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const { project, updateProject, askSaveProject } = useContext(
    ProjectServiceContext
  );

  const saveQuestionsOrder = questions => {
    if (!isLoggedIn() || project.id === null) {
      return;
    }
    const requests = [];
    project.questions = questions;
    for (const [index, q] of questions.entries()) {
      requests.push(
        editQuestion(
          axiosLoggedRequest,
          isLoggedIn,
          project,
          () => {},
          q.question,
          index
        )
      );
    }
    Promise.all(requests).catch();
  };

  const setQuestions = questions => {
    updateProject({ questions });
    if (
      project.questions.map(q => q.id).join(",") !==
      questions.map(q => q.id).join(",")
    ) {
      saveQuestionsOrder(questions);
    }
  };

  const delQuestion = async index => {
    await deleteQuestion(
      axiosLoggedRequest,
      isLoggedIn,
      project,
      index,
      setQuestions
    );
  };

  const handleBack = event => {
    event.preventDefault();
    props.history.push(`/create/2-questions-choice/new`);
  };

  const handleNext = event => {
    event.preventDefault();
    if (project.id === null) {
      askSaveProject(() => {
        props.history.push(`/create/3-storyboard-and-filming-schedule`);
      });
    } else {
      props.history.push(`/create/3-storyboard-and-filming-schedule`);
    }
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
          deleteQuestion={delQuestion}
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
  scenarioId: PropTypes.number.isRequired
};

export default withRouter(AllQuestions);
