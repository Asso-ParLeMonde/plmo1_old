import React from "react";
import PropTypes from "prop-types";

import {ButtonBase, IconButton, withStyles} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

import "./plan.css";

const StyledDeleteButton = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    '&:hover': {
      backgroundColor: theme.palette.error.light,
    }
  },
}))(IconButton);

function Plan(props) {
  return (
    <div className="plan-button-container" key={props.planIndex}>
      <ButtonBase
        component="a"
        href={`/creer/3-storyboard-et-plan-de-tournage/edit?question=${props.questionIndex}&plan=${props.planIndex}`}
        onClick={props.handleClick}
        style={{width: "100%", height: "100%"}}
      >
        <div className="plan">
          <div className="number">{props.showNumber}</div>
          <div className="edit">Modifier</div>
          {
            props.planIndex !== 0 && (
              <div className="delete">
                <StyledDeleteButton aria-label="delete" size="small" onClick={props.handleDelete}>
                  <DeleteIcon />
                </StyledDeleteButton>
              </div>
            )
          }
        </div>
      </ButtonBase>
    </div>
  )
}

Plan.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  planIndex: PropTypes.number.isRequired,
  showNumber: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Plan;
