import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Typography, IconButton, Tooltip, withStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import "./scene.css";
import Plan from "./plan";

const StyledAddButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}))(IconButton);

function Scene(props) {
  const { t } = useTranslation();
  const handleClick = (planIndex) => (event) => {
    event.preventDefault();
    props.history.push(
      `/create/3-storyboard-and-filming-schedule/edit?question=${props.index}&plan=${planIndex}`
    );
  };

  return (
    <div style={{ width: "100%", marginTop: "2rem" }}>
      <Typography color="primary" variant="h2">
        {props.index + 1}. {props.q.question}
      </Typography>
      <div className="plans">
        {props.q.plans.map((plan, planIndex) => (
          <Plan
            key={`${props.index}_${planIndex}`}
            plan={plan}
            questionIndex={props.index}
            planIndex={planIndex}
            showNumber={props.q.planStartIndex + planIndex}
            canDelete={props.q.plans.length > 1}
            handleClick={handleClick(planIndex)}
            handleDelete={props.removePlan(planIndex)}
          />
        ))}
        <div className="plan-button-container add">
          <Tooltip title={t("part3_add_plan")} aria-label={t("part3_add_plan")}>
            <StyledAddButton
              color="primary"
              aria-label={t("part3_add_plan")}
              onClick={props.addPlan}
            >
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
