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

function ChooseLabel(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span className={classes.title}>Langue</span>
      <TextField
        maxLength="2"
        value={props.language.label || ""}
        onChange={props.handleChange}
        required
        style={{ marginBottom: "1rem" }}
      />
    </React.Fragment>
  );
}

ChooseLabel.propTypes = {
  scenario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseLabel;
