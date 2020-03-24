import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import { handleRequest } from "./ThemeButtonRequests";
import DefaultDeleteButton from "../../../components/DefaultDeleteButton";

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
    <DefaultDeleteButton
      name={props.theme.names[Object.keys(props.theme.names)[0]]}
      handleRemove={handleRemove}
      goTo={"/admin/themes/delete"}
      returnTo={"/admin/themes"}
      res={res}
      icon={props.icon}
    />
  );
}

ThemeRemoveButton.propTypes = {
  theme: PropTypes.object.isRequired,
  icon: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ThemeRemoveButton);
