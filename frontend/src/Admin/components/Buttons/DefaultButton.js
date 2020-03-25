import React from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import "./buttonShape.css";

function DefaultButton(props) {
  return (
    <Button className="shape" onClick={props.handleAction}>
      {props.icon}
    </Button>
  );
}

DefaultButton.propTypes = {
  handleAction: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired
};

export default DefaultButton;
