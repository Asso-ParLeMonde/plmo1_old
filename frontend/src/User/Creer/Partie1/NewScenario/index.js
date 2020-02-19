import React, {useContext, useState} from "react";
import PropTypes from "prop-types";
import {Hidden, Typography} from "@material-ui/core";
import {withRouter} from 'react-router-dom';
import axios from "axios";

import Inverted from "../../../../components/Inverted";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import {ProjectServiceContext} from "../../../../services/ProjectService";

function NewScenario(props) {
  const [ newScenario, setNewScenario ] = useState({
    name: "",
    description: "",
    languageCode: "fr",
    themeId: props.themeId
  });
  const [ hasError, setHasError ] = useState(false);
  const { updateProject } = useContext(ProjectServiceContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newScenario.name.length === 0) {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 1000);
    }
    if (newScenario.name.length > 0 && newScenario.description.length <= 280) {
      try {
        const response = await axios({
          url: `${process.env.REACT_APP_BASE_APP}/themes/${newScenario.themeId}/scenarios`,
          method: "POST",
          data: newScenario,
        });
        if (response.status === 200) {
          updateProject({ scenarioId: response.data.id });
          props.history.push(`/creer/2-choix-des-questions`);
        }
      } catch (e) {
        // TODO afficher notif d'erreur
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  };

  const handleChange = inputType => event => {
    switch (inputType) {
      default:
        break;
      case "NAME":
        setNewScenario({...newScenario, name: event.target.value.slice(0, 50)});
        break;
      case "DESCRIPTION":
        setNewScenario({...newScenario, description: event.target.value.slice(0, 280)});
        break;
    }
  };

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(`/creer/1-choix-du-scenario`);
  };

  return (
    <div>
      <div>
        <Typography color="primary" variant="h1">
          <Inverted round>1</Inverted> Crée ton nouveau <Inverted>scénario</Inverted> !
        </Typography>
        <Typography color="inherit" variant="h2">
          Choisis ton titre<span style={{ color: "red" }}>*</span> :
          <div>
          <TextField
            value={newScenario.name || ""}
            onChange={handleChange("NAME")}
            required
            error={hasError}
            className={hasError ? 'shake' : ''}
            id="scenarioName"
            placeholder="Mon scénario"
            fullWidth
            style={{ marginTop: "0.5rem" }}
            variant = "outlined"
            color="secondary"
            autoComplete="off"
            />
          </div>
        </Typography>

        <Typography color="inherit" variant="h2" style={{marginTop: "1rem"}}>
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
            variant = "outlined"
            color="secondary"
            autoComplete="off"
            />
            <FormHelperText
              id="component-helper-text"
              style={{ marginLeft: "0.2rem", marginTop: "0.2rem" }} >
              {newScenario.description.length || 0}/280
            </FormHelperText>
          </div>
        </Typography>
        <Typography color="inherit" variant="h2" style={{marginTop: "1rem"}}>
          <Hidden smDown>
            <div style={{width: "100%", textAlign: "right"}}>
              <Button
                as="a"
                variant="outlined"
                color="secondary"
                style={{ marginRight: "1rem" }}
                href={`/creer/1-choix-du-scenario?themeId=${props.themeId}`}
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
};

export default withRouter(NewScenario);
