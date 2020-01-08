import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./buttonShape.css";

import { Button } from "@material-ui/core";
import Notifications from "./Notifications";
import { axiosRequest } from "../../../../../component/axiosRequest";

function AcceptThemeButton(props) {
  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  function handleAcceptation(event) {
    event.preventDefault();

    const request = axiosRequest({
      method: "PUT",
      url: `${process.env.REACT_APP_BASE_APP}/themes/${props.theme.id}`,
      data: {
        names: props.theme.names,
        image: props.theme.image,
        isPublished: true
      }
    });

    if (request.error === true && request.complete === true) {
      setRes({
        error: true,
        complete: true,
        message: "Erreur lors de la validation du theme"
      });
    }

    if (request.error === false && request.complete === true) {
      setRes({
        error: false,
        complete: true,
        message: "Success lors de la validation du theme"
      });
    }

    props.history.push("/admin/themes");
  }

  return (
    <React.Fragment>
      <a href={`/admin/themes/${props.theme.id}`} onClick={handleAcceptation}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <Notifications res={res} setRes={setRes} />
    </React.Fragment>
  );
}

AcceptThemeButton.propTypes = {
  icon: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withRouter(AcceptThemeButton);
