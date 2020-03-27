import React, { useContext, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
  Hidden,
  Typography,
  Button,
  TextField,
  FormHelperText
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos";

import Inverted from "../../../../components/Inverted";
import { ProjectServiceContext } from "../../../../services/ProjectService";
import { UserServiceContext } from "../../../../services/UserService";

function NewScenario(props) {
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const [newScenario, setNewScenario] = useState({
    name: "",
    description: "",
    languageCode: "fr",
    themeId: props.themeId
  });
  const [hasError, setHasError] = useState(false);
  const { updateProject } = useContext(ProjectServiceContext);

  const postNewScenario = async () => {
    const response = await axiosLoggedRequest({
      url: `/themes/${newScenario.themeId}/scenarios`,
      method: "POST",
      data: newScenario
    });
    if (!response.error) {
      updateProject({
        scenarioId: response.data.id,
        scenarioName: newScenario.name
      });
    }
  };

  const handleSubmit = async event => {
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

  const handleChange = inputType => event => {
    switch (inputType) {
      default:
        break;
      case "NAME":
        setNewScenario({
          ...newScenario,
          name: event.target.value.slice(0, 50)
        });
        break;
      case "DESCRIPTION":
        setNewScenario({
          ...newScenario,
          description: event.target.value.slice(0, 280)
        });
        break;
    }
  };

  const handleBack = event => {
    event.preventDefault();
    props.history.push(`/create/1-scenario-choice`);
  };

  return (
    <div>
      <div>
        <Typography color="primary" variant="h1">
          <Inverted round>1</Inverted> Crée ton nouveau{" "}
          <Inverted>scénario</Inverted> !
        </Typography>
        <Typography color="inherit" variant="h2">
          Choisis ton titre<span style={{ color: "red" }}>*</span> :
          <div>
            <TextField
              value={newScenario.name || ""}
              onChange={handleChange("NAME")}
              required
              error={hasError}
              className={hasError ? "shake" : ""}
              id="scenarioName"
              placeholder="Mon scénario"
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant="outlined"
              color="secondary"
              autoComplete="off"
            />
          </div>
        </Typography>

        <Typography color="inherit" variant="h2" style={{ marginTop: "1rem" }}>
          Fais en une rapide description :
          <div>
            <TextField
              value={newScenario.description || ""}
              onChange={handleChange("DESCRIPTION")}
              required
              id="scenarioDescription"
              multiline
              placeholder="Ma description"
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
                Annuler
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                endIcon={<ArrowForwardIcon />}
              >
                Suivant
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
              Suivant
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
  themeId: PropTypes.number.isRequired,
  addLocalScenario: PropTypes.func.isRequired
};

export default withRouter(NewScenario);
