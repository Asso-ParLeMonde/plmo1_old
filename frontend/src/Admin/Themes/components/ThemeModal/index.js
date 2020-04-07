import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { ThemesServiceContext } from "../../../../services/ThemesService";
import { UserServiceContext } from "../../../../services/UserService";
import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { postAdminTheme, putAdminTheme } from "../themeRequest";

const DEFAULT_THEME = {
  id: undefined,
  names: {
    fr: undefined,
  },
  image: undefined,
  isPublished: true,
};

function ThemeModal(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const [newTheme, setNewTheme] = useState(props.theme || DEFAULT_THEME);
  const { updateThemes } = useContext(ThemesServiceContext);

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: "",
  });

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
        break;
      case "NAME":
        setNewTheme({
          ...newTheme,
          names: {
            ...newTheme.names,
            [event.target.id]: event.target.value,
          },
        });
        break;
      case "IMAGE":
        setNewTheme({
          ...newTheme,
          image: event.target.files[0],
        });
        break;
    }
  }

  async function handleConfirmation() {
    if (props.theme) {
      await putAdminTheme(
        axiosLoggedRequest,
        newTheme,
        setRes,
        "Succès lors dans la modification du thème",
        "Erreur lors dans la modification du thème",
        props.history,
        updateThemes
      );
    } else {
      await postAdminTheme(
        axiosLoggedRequest,
        newTheme,
        setRes,
        "Succès lors dans la creation du thème",
        "Erreur lors dans la creation du thème",
        props.history,
        updateThemes
      );
    }
    handleCloseModal();
  }

  function handleCloseModal() {
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
    />
  );
}

ThemeModal.propTypes = {
  theme: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default ThemeModal;
