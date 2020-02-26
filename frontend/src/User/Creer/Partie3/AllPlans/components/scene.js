import React from "react";
import PropTypes from "prop-types";

import {Typography, ButtonBase, IconButton, Tooltip, withStyles} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import "./scene.css";

const StyledAddButton = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    }
  },
}))(IconButton);

const StyledDeleteButton = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    '&:hover': {
      backgroundColor: theme.palette.error.light,
    }
  },
}))(IconButton);

function Scene(props) {

  const handleClick = (planIndex) => (event) => {
    event.preventDefault();
    props.history.push(`/creer/3-storyboard-et-plan-de-tournage/edit?question=${props.index}&plan=${planIndex}`)
  };

  return (
    <div style={{ width: "100%", marginTop: "2rem" }}>
      <Typography color="primary" variant="h2">
        {props.index + 1}. {props.q.question}
      </Typography>
      <div className="plans">
        {
          props.q.plans.map((_, index) => (
            <div className="plan-button-container" key={index}>
              <ButtonBase
                component="a"
                href={`/creer/3-storyboard-et-plan-de-tournage/edit?question=${props.index}&plan=${index}`}
                onClick={handleClick(index)}
                style={{width: "100%", height: "100%"}}
              >
                <div className="plan">
                  <div className="number">{props.q.planStartIndex + index}</div>
                  <div className="edit">Modifier</div>
                  {
                    index !== 0 && (
                      <div className="delete">
                        <StyledDeleteButton aria-label="delete" size="small" onClick={props.removePlan(index)}>
                          <DeleteIcon />
                        </StyledDeleteButton>
                      </div>
                    )
                  }
                </div>
              </ButtonBase>
            </div>
          ))
        }
        <div className="plan-button-container add">
          <Tooltip title="Ajouter un plan" aria-label="Ajouter un plan">
            <StyledAddButton color="primary" aria-label="Ajouter un plan" onClick={props.addPlan}>
              <AddIcon />
            </StyledAddButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

Scene.propTypes = {
  q: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  addPlan: PropTypes.func.isRequired,
  removePlan: PropTypes.func.isRequired,
};

export default Scene;
