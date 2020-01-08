import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./buttonShape.css";

import Button from "@material-ui/core/Button";
import Notifications from "./Notifications";
import { axiosRequest } from "../../../../../component/axiosRequest";

function RemoveThemeButton(props) {
  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  function handleRemove(event) {
    event.preventDefault();

    const request = axiosRequest({
      method: "DELETE",
      url: `${process.env.REACT_APP_BASE_APP}/themes/${props.themeId}`
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

    props.history.push("/admin/themes/delete");
  }

  return (
    <React.Fragment>
      <a href={`/admin/themes/delete`} onClick={handleRemove}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <Notifications res={res} setRes={setRes} />
    </React.Fragment>
  );
}

RemoveThemeButton.propTypes = {
  themeId: PropTypes.number,
  history: PropTypes.object.isRequired
};

export default withRouter(RemoveThemeButton);
