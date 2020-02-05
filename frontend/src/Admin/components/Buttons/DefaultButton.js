import React from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import "./buttonShape.css";
import Notifications from "../../../components/Notifications";

function DefaultButton(props) {
  return (
    <React.Fragment>
      <a href={props.href} onClick={props.handleAction}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <Notifications res={props.res} />
    </React.Fragment>
  );
}

DefaultButton.propTypes = {
  href: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  res: PropTypes.object.isRequired
};

export default DefaultButton;
