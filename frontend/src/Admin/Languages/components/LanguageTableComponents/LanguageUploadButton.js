import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultButton from "../../../components/Buttons/DefaultButton";
import CustomModal from "../../../../components/CustomModal";
import Notifications from "../../../../components/Notifications";
import { locales } from "../../../../util/defaultLocales";

function LanguageUploadButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: "",
  });

  async function handleUpload() {
    if (file === null) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("locales", JSON.stringify(locales));

    const request = await axiosLoggedRequest({
      method: "POST",
      url: `/languages/${props.language.value}/po`,
      data: formData,
    });

    if (request.error) {
      setRes({
        error: true,
        complete: true,
        message: "Oups, une erreur est survenue...",
      });
    } else {
      setRes({
        error: false,
        complete: true,
        message: "Langue mise à jour avec succès!",
      });
    }
  }

  const handleToggleModal = (upload) => async (event) => {
    event.preventDefault();
    setShowModal((s) => !s);
    if (upload) {
      await handleUpload();
    }
  };

  const handleInputChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <>
      <DefaultButton
        handleAction={handleToggleModal(false)}
        res={res}
        icon={<CloudUploadIcon />}
        tooltip="Mettre à jour le fichier des traductions"
      />
      <CustomModal
        open={showModal}
        title="Mettre à jour la langue"
        cancelLabel="Annuler"
        confirmLabel="Mettre à jour"
        onClose={handleToggleModal(false)}
        onConfirm={handleToggleModal(true)}
        noCloseOutsideModal
        ariaLabelledBy="save-language-title"
        ariaDescribedBy="save-language-form"
        fullWidth
      >
        <p>
          Veuillez choisir le fichier .po de la langue pour la mettre à jour.
          <br />
          Attention ! Ne vous trompez pas de langue, l'API actuelle ne vérifie
          pas si la langue dans le fichier .po envoyée correspond bien.
        </p>
        <form
          noValidate
          autoComplete="off"
          id="save-language-form"
          className="text-center"
        >
          <Button
            variant="contained"
            color="secondary"
            component="label"
            htmlFor="language_file_input"
            style={{ margin: "1.2rem 0 2rem 0", textTransform: "none" }}
          >
            {file === null ? (
              <>
                Choisir le fichier pour la langue :
                <strong style={{ marginLeft: "0.4rem" }}>
                  {props.language.label}
                </strong>
              </>
            ) : (
              `${file.name} | changer`
            )}
          </Button>
          <input
            id="language_file_input"
            type="file"
            accept=".po"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </form>
      </CustomModal>
      <Notifications res={res} />
    </>
  );
}

LanguageUploadButton.propTypes = {
  language: PropTypes.object.isRequired,
};

export default LanguageUploadButton;
