import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Snackbar from "@material-ui/core/Snackbar";

import SnackbarContentWrapper from "./SnackBarContentWrapper";

function Notifications(props) {
  const errorMessage = "Requete rejete";
  const successMessage = "Requete valide";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.res.complete) {
      setOpen(true);
    }
  }, [props.res]);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <SnackbarContentWrapper
        onClose={handleClose}
        variant={props.res.error ? "error" : "success"}
        message={props.res.error ? errorMessage : successMessage}
      />
    </Snackbar>
  );
}

Notifications.propTypes = {
  res: PropTypes.object.isRequired,
  setRes: PropTypes.func.isRequired
};

export default Notifications;
