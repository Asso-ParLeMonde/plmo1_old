import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { updateTheme } from "../themeRequest";

const DEFAULT_THEME = {
  id: undefined,
  names: {
    fr: ""
  },
  image: undefined,
  published: undefined
};

function ThemeModal(props) {
  const [newTheme, setNewTheme] = useState(props.theme || DEFAULT_THEME);
  const updateThemes = useContext(ThemesServiceContext).updateThemes;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
        break;
      case "DESCRIPTION":
        setNewTheme({ ...newTheme, description: event.target.value });
        break;
      case "NAME":
        setNewTheme({
          ...newTheme,
          names: {
            ...newTheme.names,
            [event.target.id]: event.target.value
          }
        });
        break;
      case "IMAGE":
        setNewTheme({
          ...newTheme,
          image: event.target.files[0]
        });
        break;
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    let error = false;
    if (props.theme) {
      error = await updateTheme("PUT", props.theme, newTheme, setRes);
    } else {
      error = await updateTheme("POST", props.theme, newTheme, setRes);
    }

    if (error === false) {
      setRes({
        error: false,
        complete: true,
        message: "Success lors dans la creation du theme"
      });
    }

    updateThemes().catch();
    handleCloseModal();
  }

  function handleCloseModal(event) {
    event.preventDefault();

    props.setIsOpen(false);
    setNewTheme(props.theme || DEFAULT_THEME);
    props.history.push("/admin/themes");
  }

  return (
    <ModalContainer
      newElement={newTheme}
      handleChange={handleChange}
      isOpen={props.isOpen}
      modalTitle={props.modalTitle}
      formDescription={"THEME"}
      handleCloseModal={handleCloseModal}
      handleConfirmation={handleConfirmation}
      res={res}
      setRes={setRes}
    />
  );
}

ThemeModal.propTypes = {
  theme: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default ThemeModal;
