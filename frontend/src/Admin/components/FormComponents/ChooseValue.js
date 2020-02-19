import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

function ChooseDescription(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span className={classes.title}>Valeur</span>
      <TextField
        value={props.language.value || ""}
        onChange={props.handleChange}
        required
        multiline
        style={{ marginTop: "0.5rem" }}
        variant="outlined"
      />
    </React.Fragment>
  );
}

ChooseDescription.propTypes = {
  scenario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseDescription;
