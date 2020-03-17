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
  const buttonStyle = {width: "100%", height: "100%"};
  if (props.plan.url !== null) {
    buttonStyle.backgroundImage = `url('${props.plan.url}')`;
    buttonStyle.backgroundPosition = "center"; /* Center the image */
    buttonStyle.backgroundRepeat = "no-repeat"; /* Do not repeat the image */
    buttonStyle.backgroundSize = "cover";
  }

  return (
    <div className="plan-button-container" key={props.planIndex}>
      <ButtonBase
        component="a"
        href={`/creer/3-storyboard-et-plan-de-tournage/edit?question=${props.questionIndex}&plan=${props.planIndex}`}
        onClick={props.handleClick}
        style={buttonStyle}
      >
        <div className="plan">
          <div className="number">{props.showNumber}</div>
          <div className="edit">Modifier</div>
          {
            props.canDelete && (
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
  plan: PropTypes.object.isRequired,
  questionIndex: PropTypes.number.isRequired,
  planIndex: PropTypes.number.isRequired,
  showNumber: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool,
};

export default Plan;
