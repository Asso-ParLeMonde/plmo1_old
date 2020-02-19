import React from "react";
import PropTypes from "prop-types";

import {IconButton, makeStyles, withStyles} from "@material-ui/core";

import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';

import "./questionEdit.css";

const StyledDeleteButton = withStyles((theme) => ({
  root: {
    border: "1px solid",
    borderColor: theme.palette.secondary.main,
  },
}))(IconButton);

const useStyles = makeStyles(theme => ({
  greenBorder: {
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
  },
  greenBackground: {
    backgroundColor: (theme.palette.secondary || {}).main,
  },
}));

function QuestionEdit(props) {
  const classes = useStyles();

  return (
    <div className={["question-container", classes.greenBorder].join(" ")}>
      <div className={["question-index", classes.greenBackground].join(" ")}>
        <DragIndicatorIcon style={{ height: "1rem" }}/>
        {props.index + 1}
      </div>
      <div className="question-content">
        <p>{props.question}</p>
      </div>
      <div className="question-actions">
        <StyledDeleteButton aria-label="delete" size="small" color="secondary" onClick={props.handleDelete}>
          <DeleteIcon />
        </StyledDeleteButton>
      </div>
    </div>
  )
}

QuestionEdit.propTypes = {
  question: PropTypes.string.isRequired,
  index: PropTypes.number,
  handleDelete: PropTypes.func,
};

QuestionEdit.defaultProps = {
  index: 0,
  handleDelete: () => {},
};

export default QuestionEdit;
