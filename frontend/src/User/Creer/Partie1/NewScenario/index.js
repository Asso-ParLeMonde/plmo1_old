import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";

import {
  Hidden,
  Typography,
  Button,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos";

import Inverted from "../../../../components/Inverted";
import { ProjectServiceContext } from "../../../../services/ProjectService";
import { UserServiceContext } from "../../../../services/UserService";

function NewScenario(props) {
  const { t } = useTranslation();
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const [newScenario, setNewScenario] = useState({
    name: "",
    description: "",
    languageCode: "fr",
    themeId: props.themeId,
  });
  const [hasError, setHasError] = useState(false);
  const { updateProject } = useContext(ProjectServiceContext);

  const postNewScenario = async () => {
    const response = await axiosLoggedRequest({
      url: `/themes/${newScenario.themeId}/scenarios`,
      method: "POST",
      data: newScenario,
    });
    if (!response.error) {
      updateProject({
        scenarioId: response.data.id,
        scenarioName: newScenario.name,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newScenario.name.length === 0) {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 1000);
    }
    if (newScenario.name.length > 0 && newScenario.description.length <= 280) {
      if (isLoggedIn()) {
        await postNewScenario();
      } else {
        props.addLocalScenario(newScenario);
      }
      props.history.push(`/create/2-questions-choice`);
    }
  };

  const handleChange = (inputType) => (event) => {
    switch (inputType) {
      default:
        break;
      case "NAME":
        setNewScenario({
          ...newScenario,
          name: event.target.value.slice(0, 50),
        });
        break;
      case "DESCRIPTION":
        setNewScenario({
          ...newScenario,
          description: event.target.value.slice(0, 280),
        });
        break;
    }
  };

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(`/create/1-scenario-choice`);
  };

  return (
    <div>
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          paddingBottom: "2rem",
        }}
      >
        <Typography color="primary" variant="h1">
          <Inverted round>1</Inverted>{" "}
          <Trans i18nKey="new_scenario_title">
            Crée ton nouveau <Inverted>scénario</Inverted> !
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          <Trans i18nKey="new_scenario_title_label">
            Choisis ton titre<span style={{ color: "red" }}>*</span> :
          </Trans>
          <div>
            <TextField
              value={newScenario.name || ""}
              onChange={handleChange("NAME")}
              required
              error={hasError}
              className={hasError ? "shake" : ""}
              id="scenarioName"
              placeholder={t("new_scenario_title_placeholder")}
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant="outlined"
              color="secondary"
              autoComplete="off"
            />
          </div>
        </Typography>

        <Typography color="inherit" variant="h2" style={{ marginTop: "1rem" }}>
          {t("new_scenario_desc_label")}
          <div>
            <TextField
              value={newScenario.description || ""}
              onChange={handleChange("DESCRIPTION")}
              required
              id="scenarioDescription"
              multiline
              placeholder={t("new_scenario_desc_placeholder")}
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
              {newScenario.description.length || 0}/280
            </FormHelperText>
          </div>
        </Typography>
        <Typography color="inherit" variant="h2" style={{ marginTop: "1rem" }}>
          <Hidden smDown>
            <div style={{ width: "100%", textAlign: "right" }}>
              <Button
                as="a"
                variant="outlined"
                color="secondary"
                style={{ marginRight: "1rem" }}
                href={`/create/1-scenario-choice?themeId=${props.themeId}`}
                onClick={handleBack}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                endIcon={<ArrowForwardIcon />}
              >
                {t("next")}
              </Button>
            </div>
          </Hidden>
          <Hidden mdUp>
            <Button
              variant="contained"
              color="secondary"
              style={{ width: "100%", marginTop: "2rem" }}
              onClick={handleSubmit}
            >
              {t("next")}
            </Button>
          </Hidden>
        </Typography>
      </div>
    </div>
  );
}

NewScenario.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  addLocalScenario: PropTypes.func.isRequired,
};

export default withRouter(NewScenario);
