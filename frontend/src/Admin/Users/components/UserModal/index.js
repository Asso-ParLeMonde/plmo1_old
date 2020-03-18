import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { UsersServiceContext } from "../../../../services/UsersService";
import { updateUser } from "../userRequest";

const DEFAULT_USER = {
  id: undefined,
  languageCode: undefined,
  lastName: undefined,
  firstName: undefined,
  mail: undefined,
  type: undefined
};

function UserModal(props) {
  const [newUser, setNewUser] = useState(props.user || DEFAULT_USER);
  const updateUsers = useContext(UsersServiceContext).updateUsers;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
        console.log(event);
        break;
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    let error = false;
    if (props.user) {
      error = await updateUser("PUT", props.user, newUser, setRes);
    } else {
      error = await updateUser("POST", props.user, newUser, setRes);
    }

    if (error === false) {
      setRes({
        error: false,
        complete: true,
        message: "Success lors dans la creation de l'utilisateur"
      });
    }

    updateUsers().catch();
    handleCloseModal();
  }

  function handleCloseModal() {
    props.setIsOpen(false);
    setNewUser(props.user || DEFAULT_USER);
    props.history.push("/admin/users");
  }

  return (
    <ModalContainer
      newElement={newUser}
      handleChange={handleChange}
      isOpen={props.isOpen}
      modalTitle={props.modalTitle}
      formDescription={"USER"}
      handleCloseModal={handleCloseModal}
      handleConfirmation={handleConfirmation}
      res={res}
    />
  );
}

UserModal.propTypes = {
  user: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default UserModal;
