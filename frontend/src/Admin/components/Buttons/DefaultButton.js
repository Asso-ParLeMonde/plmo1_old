import React from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import "./buttonShape.css";

function DefaultButton(props) {
  return (
    <React.Fragment>
      <a onClick={props.handleAction}>
        <Button className="shape">{props.icon}</Button>
      </a>
    </React.Fragment>
  );
}

DefaultButton.propTypes = {
  handleAction: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired
};

export default DefaultButton;
