import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { LanguagesServiceContext } from "../../../../services/LanguagesService";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultDeleteButton from "../../../components/DefaultDeleteButton";
import { deleteAdminLanguage } from "../languageRequest";

function LanguageRemoveButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateLanguages = useContext(LanguagesServiceContext).updateLanguages;

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: "",
  });

  async function handleRemove(event) {
    event.preventDefault();
    await deleteAdminLanguage(
      axiosLoggedRequest,
      props.language,
      setRes,
      "Succès lors de la suppression de la langue",
      "Erreur lors de la suppression de la langue",
      props.history,
      updateLanguages
    );
  }

  return (
    <DefaultDeleteButton
      name={props.language.label}
      handleRemove={handleRemove}
      goTo={"/admin/languages/delete"}
      returnTo={"/admin/languages"}
      res={res}
      icon={props.icon}
    />
  );
}

LanguageRemoveButton.propTypes = {
  language: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(LanguageRemoveButton);
