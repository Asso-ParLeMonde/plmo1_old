import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as Arrow } from '../../../images/right-arrow.svg';

import {Typography, makeStyles} from "@material-ui/core";

import "./card.css";

const useStyles = makeStyles(theme => ({
  greenBorder: {
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
  },
}));

function ScenarioCard({title, description, stepNumber}) {
  const classes = useStyles();

  return <div className={[classes.greenBorder, "card-container"].join(" ")} tabIndex="0">
    <div>
      <Typography color="primary" variant="h3">{title}</Typography>
    </div>
    <div>
      <p>{description}</p>
    </div>
    <div className="steps">
      {stepNumber} étape{stepNumber > 1 && "s"}
    </div>
    <div className="arrow">
      <Arrow />
    </div>
  </div>
}

ScenarioCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stepNumber: PropTypes.number
};

ScenarioCard.defaultProps = {
  stepNumber: 0,
};

export default ScenarioCard;
