import React, { useState } from "react";
import PropTypes from "prop-types";
import "./sharedLink.css";

import { Fab, Tooltip } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Notifications from "../Notifications";

const SharedLink = (props) => {
  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: "",
  });

  const copyToClipboard = async (e) => {
    try {
      await navigator.clipboard.writeText(props.link);
      setRes({
        error: false,
        complete: true,
        message: "Code copié dans le presse-papier!",
      });
    } catch (err) {
      console.log(err);
      setRes({
        error: true,
        complete: true,
        message: "Une erreur inconnue est survenue...",
      });
    }
  };

  return (
    <div className="sharedLink">
      <span>{props.link}</span>
      {document.queryCommandSupported("copy") && (
        <>
          <Tooltip title="Cliquez pour copier" aria-label="Cliquez pour copier">
            <Fab
              color="primary"
              aria-label="copy"
              style={{ height: "2rem", width: "2rem", minHeight: "unset" }}
              onClick={copyToClipboard}
            >
              <FileCopyIcon style={{ heiht: "0.8em", width: "0.8em" }} />
            </Fab>
          </Tooltip>
          <Notifications res={res} />
        </>
      )}
    </div>
  );
};

SharedLink.propTypes = {
  link: PropTypes.string,
};

SharedLink.defaultProps = {
  link: "",
};

export default SharedLink;
