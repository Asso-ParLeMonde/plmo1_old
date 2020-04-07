import React from "react";
import PropTypes from "prop-types";

import { Button, Tooltip } from "@material-ui/core";

import "./buttonShape.css";

function DefaultButton(props) {
  const button = (
    <Button className="shape" onClick={props.handleAction}>
      {props.icon}
    </Button>
  );

  if (props.tooltip) {
    return <Tooltip title={props.tooltip}>{button}</Tooltip>;
  }
  return button;
}

DefaultButton.propTypes = {
  handleAction: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
};

DefaultButton.defaultProps = {
  tooltip: null,
};

export default DefaultButton;
