import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultButton from "../../../components/Buttons/DefaultButton";
import { putPublishedAdminTheme } from "../themeRequest";

function ThemeAcceptButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateThemes = useContext(ThemesServiceContext).updateThemes;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: "",
  });

  async function handleAcceptation(event) {
    event.preventDefault();
    await putPublishedAdminTheme(
      axiosLoggedRequest,
      props.theme,
      setRes,
      "Succès lors de la modification du theme",
      "Erreur lors de la modification du theme",
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
    />
  );
}

ThemeAcceptButton.propTypes = {
  icon: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(ThemeAcceptButton);
