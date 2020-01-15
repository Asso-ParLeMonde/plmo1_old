import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as Arrow } from '../../../../images/right-arrow.svg';

import {Typography, makeStyles} from "@material-ui/core";

import "./card.css";

const useStyles = makeStyles(theme => ({
  greenBorder: {
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
  },
}));

function ScenarioCard({title, description, stepNumber, path, history}) {
  const classes = useStyles();

  return <a className={[classes.greenBorder, "card-container"].join(" ")} tabIndex="0" href={path} onClick={(event) => {
    event.preventDefault();
    history.push(path);
  }}>
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
  </a>
}

ScenarioCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stepNumber: PropTypes.number,
  history: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

ScenarioCard.defaultProps = {
  stepNumber: 0,
};

export default ScenarioCard;
