import React from "react";
import PropTypes from "prop-types";

import { ButtonBase } from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import CustomModal from "../../../../../components/CustomModal";

function SizeModal(props) {
  const handleCloseModalSize = size => () => {
    props.setOpen(false);
    if (size !== undefined) {
      props.setSize(size);
    }
  };

  return (
    <CustomModal
      open={props.open}
      ariaDescribedBy="size-dialog-title"
      ariaLabelledBy="size-dialog-description"
      onClose={handleCloseModalSize()}
      title="Choisissez l'éppaiseur du trait"
    >
      <div className="canvas-colors-container" id="size-dialog-description">
        <ButtonBase
          style={{ backgroundColor: "white", border: "1px solid #444" }}
          onClick={handleCloseModalSize(0)}
        >
          <FiberManualRecordIcon fontSize="small" />
        </ButtonBase>
        <ButtonBase
          style={{ backgroundColor: "white", border: "1px solid #444" }}
          onClick={handleCloseModalSize(1)}
        >
          <FiberManualRecordIcon />
        </ButtonBase>
        <ButtonBase
          style={{ backgroundColor: "white", border: "1px solid #444" }}
          onClick={handleCloseModalSize(2)}
        >
          <FiberManualRecordIcon fontSize="large" />
        </ButtonBase>
      </div>
    </CustomModal>
  );
}

SizeModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  setSize: PropTypes.func
};

SizeModal.defaultProps = {
  open: false,
  setOpen: () => {},
  setSize: () => {}
};

export default SizeModal;
