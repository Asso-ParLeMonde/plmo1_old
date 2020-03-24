import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import { handleRequest } from "./ThemeButtonRequests";
import DefaultButton from "../../../components/Buttons/DefaultButton";
import VerificationModal from "../../../components/VerificationModal";

function ThemeRemoveButton(props) {
  const updateThemes = useContext(ThemesServiceContext).updateThemes;
  const [isOpen, setIsOpen] = useState(false);

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  const openVerificationModal = () => {
    setIsOpen(true);
    props.history.push(`/admin/themes/delete`);
  };

  const closeVerificationModal = () => {
    setIsOpen(false);
    props.history.push(`/admin/themes`);
  };

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
    <React.Fragment>
      <DefaultButton
        handleAction={openVerificationModal}
        icon={props.icon}
        res={res}
      />
      <VerificationModal
        isOpen={isOpen}
        name={props.theme.names[Object.keys(props.theme.names)[0]]}
        handleCloseModal={closeVerificationModal}
        handleConfirmation={handleRemove}
        res={res}
      />
    </React.Fragment>
  );
}

ThemeRemoveButton.propTypes = {
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ThemeRemoveButton);
