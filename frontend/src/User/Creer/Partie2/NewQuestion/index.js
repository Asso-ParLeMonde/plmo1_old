import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";

import { Hidden, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";

import Inverted from "../../../../components/Inverted";
import { ProjectServiceContext } from "../../../../services/ProjectService";
import { UserServiceContext } from "../../../../services/UserService";
import { addQuestion } from "../../components/questionRequest";

function NewQuestion(props) {
  const { t } = useTranslation();
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const { project, updateProject } = useContext(ProjectServiceContext);
  const [hasError, setHasError] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const handleChange = (event) => {
    event.preventDefault();
    setNewQuestion(event.target.value.slice(0, 280));
  };

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(`/create/2-questions-choice`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newQuestion.length === 0) {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 1000);
      return;
    }
    await addQuestion(
      axiosLoggedRequest,
      isLoggedIn,
      project,
      updateProject,
      newQuestion
    );
    props.history.push(`/create/2-questions-choice`);
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
          {t("part2_add_question")}
        </Typography>
        <Typography color="inherit" variant="h2" style={{ marginTop: "1rem" }}>
          <div>
            <TextField
              value={newQuestion}
              onChange={handleChange}
              required
              error={hasError}
              className={hasError ? "shake" : ""}
              id="scenarioDescription"
              multiline
              placeholder={t("part2_add_question_placeholder")}
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant="outlined"
              color="secondary"
              autoComplete="off"
            />
            <FormHelperText
              id="component-helper-text"
              style={{ marginLeft: "0.2rem", marginTop: "0.2rem" }}
            >
              {newQuestion.length}/280
            </FormHelperText>
          </div>
        </Typography>
        <Hidden smDown>
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button
              as="a"
              variant="outlined"
              color="secondary"
              style={{ marginRight: "1rem" }}
              href={`/create/2-questions-choice`}
              onClick={handleBack}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              {t("add")}
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            style={{ width: "100%", marginTop: "2rem" }}
          >
            {t("add")}
          </Button>
        </Hidden>
      </div>
    </div>
  );
}

NewQuestion.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  scenarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default withRouter(NewQuestion);
