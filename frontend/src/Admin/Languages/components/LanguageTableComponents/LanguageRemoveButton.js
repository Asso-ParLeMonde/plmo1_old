import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { LanguagesServiceContext } from "../../../../services/LanguagesService";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultButton from "../../../components/Buttons/DefaultButton";

function LanguageRemoveButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateLanguages = useContext(LanguagesServiceContext).updateLanguages;

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
    const request = await axiosLoggedRequest({
      method: "DELETE",
      url: `/languages/${props.language.id}`
    });

    if (request.error === true && request.complete === true) {
      setRes({
        error: true,
        complete: true,
        message: "Erreur lors de la suppression de la langue"
      });
    }

    if (request.error === false && request.complete === true) {
      setRes({
        error: false,
        complete: true,
        message: "Succès lors de la suppression de la langue"
      });
    }

    updateLanguages();
  }

  return (
    <DefaultButton
      href={`/admin/languagues/delete`}
      handleAction={handleRemove}
      icon={props.icon}
      res={res}
    />
  );
}

LanguageRemoveButton.propTypes = {
  language: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(LanguageRemoveButton);
