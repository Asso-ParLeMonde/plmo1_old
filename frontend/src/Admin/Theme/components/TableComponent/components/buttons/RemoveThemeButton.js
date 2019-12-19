import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./buttonShape.css";

import Button from "@material-ui/core/Button";
import Notifications from "./Notifications";
import { axiosRequest } from "./axiosRequest";

function RemoveThemeButton(props) {
  const [res, setRes] = useState({
    data: null,
    complete: false,
    pending: false,
    error: false
  });

  function handleRemove(event) {
    event.preventDefault();

    axiosRequest(
      {
        method: "DELETE",
        url: `${process.env.REACT_APP_BASE_APP}/themes/${props.themeId}`
      },
      setRes
    );

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
