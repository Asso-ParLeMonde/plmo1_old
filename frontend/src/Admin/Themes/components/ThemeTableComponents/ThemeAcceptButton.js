import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import { handleRequest } from "./ThemeButtonRequests";
import DefaultButton from "../../../components/Buttons/DefaultButton";

function ThemeAcceptButton(props) {
  const updateThemes = useContext(ThemesServiceContext).updateThemes;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  async function handleAcceptation(event) {
    event.preventDefault();
    await handleRequest(
      "PUT",
      props.theme,
      setRes,
      "Success lors de la validation du theme",
      "Erreur lors de la validation du theme",
      props.history,
      updateThemes
    );
  }

  return (
    <DefaultButton
      href={`/admin/themes/${props.theme.id}`}
      handleAction={handleAcceptation}
      icon={props.icon}
      res={res}
      setRes={setRes}
    />
  );
}

ThemeAcceptButton.propTypes = {
  icon: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ThemeAcceptButton);
