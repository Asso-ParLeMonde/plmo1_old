import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(() => ({
  containerNames: {
    display: "flex",
    marginBottom: 16,
    alignItems: "center"
  },
  textFieldNames: {
    margin: "0px 0px 0px 4px"
  }
}));

function DefaultNameInput(props) {
  const classes = useStyles();

  return (
    <div className={classes.containerNames}>
      <div>{props.language.label}</div>

      <TextField
        id={props.language.value}
        autoFocus
        type="text"
        value={props.newElement.names[props.language.value] || ""}
        onChange={e => props.handleChange("NAME", e)}
        fullWidth
        className={classes.textFieldNames}
      />
    </div>
  );
}

DefaultNameInput.propTypes = {
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
};

export default DefaultNameInput;
