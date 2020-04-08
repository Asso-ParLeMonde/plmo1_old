import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import "./formComponents.css";
import Notifications from "../../../components/Notifications";
import ShowCorrectForm from "./components/ModalComponents/ShowCorrectForm";

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 24px 24px",
  },
}));

function ModalContainer(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.modalTitle}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <ShowCorrectForm
            formDescription={props.formDescription}
            newElement={props.newElement}
            handleChange={props.handleChange}
          />
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
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Notifications res={props.res} />
    </React.Fragment>
  );
}

ModalContainer.propTypes = {
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string.isRequired,
  formDescription: PropTypes.string.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleConfirmation: PropTypes.func.isRequired,
  res: PropTypes.object.isRequired,
};

export default ModalContainer;
