import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { LanguagesServiceContext } from "../../../../services/LanguagesService";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultDeleteButton from "../../../components/DefaultDeleteButton";

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
    <DefaultDeleteButton
      name={props.theme.names[Object.keys(props.theme.names)[0]]}
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
  history: PropTypes.object.isRequired
};

export default withRouter(LanguageRemoveButton);
