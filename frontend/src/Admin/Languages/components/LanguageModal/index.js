import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { LanguagesServiceContext } from "../../../../services/LanguagesService";
import { axiosRequest } from "../../../components/axiosRequest";

function LanguageModal(props) {
  const [newLanguage, setNewLanguage] = useState(
    props.language || { label: "", value: "" }
  );
  const updateLanguages = useContext(LanguagesServiceContext).updateLanguages;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  const handleChange = enumCase => event => {
    switch (enumCase) {
      default:
        break;
      case "LABEL":
        setNewLanguage({
          ...newLanguage,
          label: event.target.value.slice(0, 2)
        });
        break;
      case "VALUE":
        setNewLanguage({
          ...newLanguage,
          value: event.target.value.slice(0, 2)
        });
        break;
    }
  };

  async function handleConfirmation(event) {
    event.preventDefault();

    const request = await axiosRequest({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_APP}/languages`,
      data: newLanguage
    });

    if (request.error === true && request.complete === true) {
      setRes({
        error: true,
        complete: true,
        message: "Erreur lors de la creation de la langue"
      });
    }

    if (request.error === false && request.complete === true) {
      setRes({
        error: false,
        complete: true,
        message: "Success lors de la création de la langue"
      });
    }

    updateLanguages().catch();
    handleCloseModal();
  }

  function handleCloseModal() {
    props.setIsOpen(false);
    setNewLanguage(props.language || { label: "", value: "" });
    props.history.push("/admin/languages");
  }

  return (
    <ModalContainer
      newElement={newLanguage}
      handleChange={handleChange}
      isOpen={props.isOpen}
      modalTitle={props.modalTitle}
      formDescription={"LANGUAGE"}
      handleCloseModal={handleCloseModal}
      handleConfirmation={handleConfirmation}
      res={res}
    />
  );
}

LanguageModal.propTypes = {
  language: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default LanguageModal;
