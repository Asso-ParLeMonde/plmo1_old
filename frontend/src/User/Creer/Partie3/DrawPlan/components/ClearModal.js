import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { DialogContentText } from "@material-ui/core";

import CustomModal from "../../../../../components/CustomModal";

function ClearModal(props) {
  const { t } = useTranslation();
  return (
    <CustomModal
      open={props.open}
      ariaDescribedBy="clear-dialog-title"
      ariaLabelledBy="clear-dialog-description"
      onClose={props.onClear(false)}
      onConfirm={props.onClear(true)}
      title={t("tool_clear_title")}
    >
      <DialogContentText id="clear-dialog-description">
        {t("tool_clear_desc")}
      </DialogContentText>
    </CustomModal>
  );
}

ClearModal.propTypes = {
  open: PropTypes.bool,
  onClear: PropTypes.func,
};

ClearModal.defaultProps = {
  open: false,
  onClear: () => {},
};

export default ClearModal;
