import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import { handleRequest } from "./ButtonRequests";
import DefaultButton from "../../../components/Buttons/DefaultButton";

function RemoveThemeButton(props) {
  const updateThemes = useContext(ThemesServiceContext).updateThemes;

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
    await handleRequest(
      "DELETE",
      props.theme,
      setRes,
      "Success lors de la suppression du theme",
      "Erreur lors de la suppression du theme",
      props.history,
      updateThemes
    );
  }

  return (
    <DefaultButton
      href={`/admin/themes/delete`}
      handleAction={handleRemove}
      icon={props.icon}
      res={res}
      setRes={setRes}
    />
  );
}

RemoveThemeButton.propTypes = {
  themeId: PropTypes.number,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(RemoveThemeButton);
