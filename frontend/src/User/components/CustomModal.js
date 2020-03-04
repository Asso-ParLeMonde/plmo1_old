import React from "react";
import PropTypes from "prop-types";

import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

function CustomModal(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby={props.ariaLabelledBy}
      aria-describedby={props.ariaDescribedBy}
    >
      <DialogTitle id={props.ariaLabelledBy}>{props.title}</DialogTitle>
      <DialogContent>
        {props.children}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary" variant="outlined">
          {props.cancelLabel}
        </Button>
        {
          props.onConfirm !== null && (
            <Button onClick={props.onConfirm} color="secondary" variant="contained">
              {props.confirmLabel}
            </Button>
          )
        }
      </DialogActions>
    </Dialog>
  )
}

CustomModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  ariaLabelledBy: PropTypes.string.isRequired,
  ariaDescribedBy: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  cancelLabel: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
};

CustomModal.defaultProps = {
  open: true,
  onClose: () => {},
  onConfirm: null,
  title: "",
  children: <div/>,
  cancelLabel: "Annuler",
  confirmLabel: "Oui",
};

export default CustomModal;
