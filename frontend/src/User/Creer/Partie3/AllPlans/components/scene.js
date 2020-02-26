import React from "react";
import PropTypes from "prop-types";

import {Typography, IconButton, Tooltip, withStyles} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import "./scene.css";
import Plan from "./plan";

const StyledAddButton = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
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
          props.q.plans.map((_, planIndex) => (
            <Plan key={`${props.index}_${planIndex}`}
                  questionIndex={props.index}
                  planIndex={planIndex}
                  showNumber={props.q.planStartIndex + planIndex}
                  handleClick={handleClick(planIndex)}
                  handleDelete={props.removePlan(planIndex)}
            />
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
