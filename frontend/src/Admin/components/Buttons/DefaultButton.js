import React from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import "./buttonShape.css";
import Notifications from "../Notifications";

function DefaultButton(props) {
  return (
    <React.Fragment>
      <a href={props.href} onClick={props.handleAction}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <Notifications res={props.res} setRes={props.setRes} />
    </React.Fragment>
  );
}

DefaultButton.propTypes = {
  href: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired,
  setRes: PropTypes.func.isRequired
};

export default DefaultButton;
