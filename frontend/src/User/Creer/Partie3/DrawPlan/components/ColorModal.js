import React from "react";
import PropTypes from "prop-types";

import CustomModal from "../../../../components/CustomModal";
import {ButtonBase} from "@material-ui/core";

const colors = [
  "#444",
  "#eda000",
  "#79c3a5",
  "#6065fc",
  "#c36561",
];

function ColorModal(props) {

  const handleCloseModalColor = color => () => {
    props.setOpen(false);
    if (color !== undefined) {
      props.setColor(color);
    }
  };

  return (
    <CustomModal
      open={props.open}
      ariaDescribedBy="color-dialog-title"
      ariaLabelledBy="color-dialog-description"
      onClose={handleCloseModalColor()}
      title="Choisissez la couleur du trait"
    >
      <div className="canvas-colors-container" id="color-dialog-description">
        {
          colors.map(c => <ButtonBase
            key={c}
            style={{ backgroundColor: c }}
            onClick={handleCloseModalColor(c)}
          />)
        }
        <ButtonBase
          onClick={handleCloseModalColor("white")}
          style={{ backgroundColor: "white", border: "1px solid #444" }}/>
      </div>
    </CustomModal>
  )
}

ColorModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  setColor: PropTypes.func,
};

ColorModal.defaultProps = {
  open: false,
  setOpen: () => {},
  setColor: () => {},
};

export default ColorModal;
