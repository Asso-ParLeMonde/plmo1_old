import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import DefaultButton from "../Buttons/DefaultButton";
import VerificationModal from "./VerificationModal";

function DefaultDeleteButton(props) {
  const [isOpen, setIsOpen] = useState(false);

  const openVerificationModal = () => {
    setIsOpen(true);
    props.history.push(props.goTo);
  };

  const closeVerificationModal = () => {
    setIsOpen(false);
    props.history.push(props.returnTo);
  };

  return (
    <React.Fragment>
      <DefaultButton
        handleAction={openVerificationModal}
        icon={props.icon}
        res={props.res}
      />
      <VerificationModal
        isOpen={isOpen}
        name={props.name}
        handleCloseModal={closeVerificationModal}
        handleConfirmation={props.handleRemove}
        res={props.res}
      />
    </React.Fragment>
  );
}

DefaultDeleteButton.propTypes = {
  name: PropTypes.string.isRequired,
  handleRemove: PropTypes.func.isRequired,
  goTo: PropTypes.string.isRequired,
  returnTo: PropTypes.string.isRequired,
  res: PropTypes.object.isRequired,
  icon: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(DefaultDeleteButton);
