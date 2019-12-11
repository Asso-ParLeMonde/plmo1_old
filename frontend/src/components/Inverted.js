import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core";

const useStyles = (color) => makeStyles(theme => ({
  inverted: {
    backgroundColor: (theme.palette[color] || {}).main,
    color: (theme.palette[color] || {}).contrastText,
    padding: "0 0.1rem",
  },
  round: {
    width: "2rem",
    height: "2rem",
    display: "inline-block",
    borderRadius: "1rem",
    textAlign: "center",
  }
}));

function Inverted(props) {
  const classes = useStyles(props.color)();
  const className = classes.inverted + (props.round ? ` ${classes.round}` : "");

  return (
    <span className={className}>{props.children}</span>
  );
}

Inverted.propTypes = {
  children: PropTypes.string,
  round: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
};

Inverted.defaultProps = {
  children: "",
  round: false,
  color: "primary",
};

export default Inverted;
