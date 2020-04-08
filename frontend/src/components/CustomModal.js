import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withStyles,
} from "@material-ui/core";

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.contrastText,
    background: theme.palette.error.light,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}))(Button);

function CustomModal(props) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={props.open}
      onClose={props.noCloseOutsideModal ? () => {} : props.onClose}
      aria-labelledby={props.ariaLabelledBy}
      aria-describedby={props.ariaDescribedBy}
      fullWidth={props.fullWidth}
      maxWidth={props.maxWidth}
    >
      <DialogTitle id={props.ariaLabelledBy}>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary" variant="outlined">
          {props.cancelLabel || t("cancel")}
        </Button>
        {props.onConfirm !== null && props.error && (
          <RedButton onClick={props.onConfirm} variant="contained">
            {props.confirmLabel || t("yes")}
          </RedButton>
        )}
        {props.onConfirm !== null && !props.error && (
          <Button
            onClick={props.onConfirm}
            color="secondary"
            variant="contained"
          >
            {props.confirmLabel || t("yes")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
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
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.string,
  noCloseOutsideModal: PropTypes.bool,
  error: PropTypes.bool,
};

CustomModal.defaultProps = {
  open: true,
  onClose: () => {},
  onConfirm: null,
  title: "",
  children: <div />,
  cancelLabel: "",
  confirmLabel: "",
  fullWidth: false,
  noCloseOutsideModal: false,
  maxWidth: "sm",
  error: false,
};

export default CustomModal;
