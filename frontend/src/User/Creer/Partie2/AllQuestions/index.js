import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";

import { Typography, Button, Hidden } from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import QuestionsList from "../../../components/QuestionsList";
import { ProjectServiceContext } from "../../../../services/ProjectService";
import { UserServiceContext } from "../../../../services/UserService";
import { editQuestion, deleteQuestion } from "../../components/questionRequest";
import { addPlan } from "../../components/planRequest";

function AllQuestions(props) {
  const { t } = useTranslation();
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const { project, updateProject, askSaveProject } = useContext(
    ProjectServiceContext
  );

  const saveQuestionsOrder = (questions) => {
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

  const setQuestions = (questions) => {
    updateProject({ questions });
    if (
      project.questions.map((q) => q.id).join(",") !==
      questions.map((q) => q.id).join(",")
    ) {
      saveQuestionsOrder(questions);
    }
  };

  const delQuestion = async (index) => {
    await deleteQuestion(
      axiosLoggedRequest,
      isLoggedIn,
      project,
      index,
      setQuestions
    );
  };

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(`/create/2-questions-choice/new`);
  };

  const goNext = async (p) => {
    const createOnePlanPromises = [];
    for (const [index, question] of p.questions.entries()) {
      if ((question.plans || []).length === 0) {
        createOnePlanPromises.push(
          addPlan(axiosLoggedRequest, isLoggedIn, p, updateProject, index)
        );
      }
    }
    await Promise.all(createOnePlanPromises);
    props.history.push(`/create/3-storyboard-and-filming-schedule`);
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (project.id === null) {
      askSaveProject((p) => {
        goNext(p).catch();
      });
    } else {
      goNext(project).catch();
    }
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>2</Inverted>{" "}
          <Trans i18nKey="part2_title">
            Mes <Inverted>questions</Inverted>
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          {t("part2_desc")}
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
            marginTop: "2rem",
          }}
        >
          {t("add_question")}
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
              {t("next")}
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
            {t("next")}
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
  scenarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default withRouter(AllQuestions);
