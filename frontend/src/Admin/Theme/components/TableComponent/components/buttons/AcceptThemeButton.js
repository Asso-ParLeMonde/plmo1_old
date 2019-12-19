import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./buttonShape.css";

import { Button } from "@material-ui/core";
import { axiosRequest } from "./axiosRequest";
import Notifications from "./Notifications";

function AcceptThemeButton(props) {
  const [res, setRes] = useState({
    data: null,
    complete: false,
    pending: false,
    error: false
  });

  function handleAcceptation(event) {
    event.preventDefault();

    axiosRequest(
      {
        method: "PUT",
        url: `${process.env.REACT_APP_BASE_APP}/themes/${props.theme.id}`,
        body: {
          names: props.theme.names,
          image: props.theme.image,
          isPublished: true
        }
      },
      setRes
    );

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
