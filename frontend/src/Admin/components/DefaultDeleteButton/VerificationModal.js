import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import "../FormComponents/formComponents.css";
import Notifications from "../../../components/Notifications";

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 24px 24px"
  }
}));

function VerificationModal(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Validation de suppression
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {`Vous allez supprimer l'element suivant : ${props.name}.`}
          <br />
          Cette action est irreversible. Etes-vous sur de votre action ?
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCloseModal} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={props.handleConfirmation}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirmer la suppression
          </Button>
        </DialogActions>
      </Dialog>
      <Notifications res={props.res} />
    </React.Fragment>
  );
}

VerificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleConfirmation: PropTypes.func.isRequired,
  res: PropTypes.object.isRequired
};

export default VerificationModal;
