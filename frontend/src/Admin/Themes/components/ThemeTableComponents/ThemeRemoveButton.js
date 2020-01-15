import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import { handleRequest } from "./ThemeButtonRequests";
import DefaultButton from "../../../components/Buttons/DefaultButton";

function ThemeRemoveButton(props) {
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

ThemeRemoveButton.propTypes = {
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ThemeRemoveButton);
