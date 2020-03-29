import React from "react";
import PropTypes from "prop-types";

import { DialogContentText } from "@material-ui/core";

import CustomModal from "../../../../../components/CustomModal";

function ClearModal(props) {
  return (
    <CustomModal
      open={props.open}
      ariaDescribedBy="clear-dialog-title"
      ariaLabelledBy="clear-dialog-description"
      onClose={props.onClear(false)}
      onConfirm={props.onClear(true)}
      title="Effacer le canvas ?"
    >
      <DialogContentText id="clear-dialog-description">
        Êtes-vous sûr de vouloir effacer totalement le plan ?
      </DialogContentText>
    </CustomModal>
  );
}

ClearModal.propTypes = {
  open: PropTypes.bool,
  onClear: PropTypes.func
};

ClearModal.defaultProps = {
  open: false,
  onClear: () => {}
};

export default ClearModal;
