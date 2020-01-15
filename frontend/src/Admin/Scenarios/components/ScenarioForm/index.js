import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

function ScenarioForm() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span className={classes.title}>Titre</span>
      <span className={classes.title}>Description</span>
    </React.Fragment>
  );
}

ScenarioForm.propTypes = {
  scenario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ScenarioForm;
