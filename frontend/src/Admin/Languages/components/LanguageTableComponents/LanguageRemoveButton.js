import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

//import { LanguagesServiceContext } from "../../../../services/LanguagesService";
import DefaultButton from "../../../components/Buttons/DefaultButton";

function LanguageRemoveButton(props) {
  //const updateLanguages = useContext(LanguagesServiceContext).updateLanguages;

  const [res] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
  }

  return (
    <DefaultButton
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
