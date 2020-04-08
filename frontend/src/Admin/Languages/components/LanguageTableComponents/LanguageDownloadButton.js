import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import GetAppIcon from "@material-ui/icons/GetApp";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultButton from "../../../components/Buttons/DefaultButton";
import Notifications from "../../../../components/Notifications";

function LanguageDownloadButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: "",
  });

  async function handleDownload(event) {
    event.preventDefault();
    const request = await axiosLoggedRequest({
      method: "GET",
      url: `/languages/${props.language.value}/po`,
    });

    if (request.error === true && request.complete === true) {
      setRes({
        error: true,
        complete: true,
        message: "Oups, une erreur est survenue...",
      });
    }

    if (request.error === false && request.complete === true) {
      window.open(`${process.env.REACT_APP_BASE_APP}/${request.data.url}`);
    }
  }

  return (
    <>
      <DefaultButton
        handleAction={handleDownload}
        res={res}
        icon={<GetAppIcon />}
        tooltip="Télécharger le fichier des traductions"
      />
      <Notifications res={res} />
    </>
  );
}

LanguageDownloadButton.propTypes = {
  language: PropTypes.object.isRequired,
};

export default LanguageDownloadButton;
