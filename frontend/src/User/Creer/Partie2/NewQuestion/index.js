import React from "react";
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";

import {Hidden, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";

import Inverted from "../../../../components/Inverted";

function NewQuestion(props) {
  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(`/creer/2-choix-des-questions?themeId=${props.themeId}&scenarioId=${props.scenarioId}`);
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>2</Inverted> Mes <Inverted>questions</Inverted>
        </Typography>
        <Typography color="inherit" variant="h2">
          Ajouter une question
        </Typography>
        <Typography color="inherit" variant="h2" style={{marginTop: "1rem"}}>
          <div>
            <TextField
              required
              id="scenarioDescription"
              multiline
              placeholder="Ma question"
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant = "outlined"
              color="secondary"
              autoComplete="off"
            />
            <FormHelperText
              id="component-helper-text"
              style={{ marginLeft: "0.2rem", marginTop: "0.2rem" }} >
              {0}/280
            </FormHelperText>
          </div>
        </Typography>
        <Hidden smDown>
          <div style={{width: "100%", textAlign: "right"}}>
            <Button
              as="a"
              variant="outlined"
              color="secondary"
              style={{ marginRight: "1rem" }}
              href={`/creer/2-choix-des-questions?themeId=${props.themeId}&scenarioId=${props.scenarioId}`}
              onClick={handleBack}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              color="secondary"
            >
              Ajouter
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%", marginTop: "2rem" }}
          >
            Ajouter
          </Button>
        </Hidden>
      </div>
    </div>
  )
}

NewQuestion.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  scenarioId: PropTypes.number.isRequired,
};

export default withRouter(NewQuestion);
