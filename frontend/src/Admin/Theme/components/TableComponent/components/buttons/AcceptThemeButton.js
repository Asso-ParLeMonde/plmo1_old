import React, {useContext, useState} from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./buttonShape.css";

import { Button } from "@material-ui/core";
import Notifications from "./Notifications";
import { axiosRequest } from "../../../../../component/axiosRequest";
import {ThemesServiceContext} from "../../../../../../services/ThemesService";

function AcceptThemeButton(props) {
  const updateThemes = useContext(ThemesServiceContext).updateThemes;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  async function handleAcceptation(event) {
    event.preventDefault();

    const request = await axiosRequest({
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

    updateThemes().catch();
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
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(AcceptThemeButton);
