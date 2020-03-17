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

function ChooseQuestion(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span className={classes.title}>Question</span>
      <TextField
        value={props.question.question || ""}
        onChange={e => props.handleChange("QUESTION", e)}
        required
        multiline
        style={{ marginTop: "0.5rem" }}
        variant="outlined"
      />
    </React.Fragment>
  );
}

ChooseQuestion.propTypes = {
  question: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseQuestion;
