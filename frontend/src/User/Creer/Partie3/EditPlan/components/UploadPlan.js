import React, {useRef} from "react";
import PropTypes from "prop-types";

import {Button} from "@material-ui/core";

import ImgCroppie from "../../../../../components/ImgCroppie";


function UploadPlan(props) {
  const croppieRef = useRef(null);

  const submit = async () => {
    if (croppieRef.current) {
      await props.handleSubmit(await croppieRef.current.getBlob());
    }
  };

  return (
    <div className="text-center">
      <div className="plan-img plan-croppie-container">
        <div>
          <ImgCroppie src={props.imageUrl} alt="Plan image" ref={croppieRef} />
        </div>
      </div>
      <div className="plan-img-buttons">
        <Button
          variant="outlined"
          color="secondary"
          style={{ width: "48%", marginRight: "4%" }}
          onClick={props.handleClearInput}
        >Annuler</Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ width: "48%" }}
          onClick={submit}
        >Enregistrer</Button>
      </div>
    </div>
  );
}

UploadPlan.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  handleClearInput: PropTypes.func,
  handleSubmit: PropTypes.func,
};

UploadPlan.defaultProps = {
  handleClearInput: () => {},
  handleSubmit: () => {},
};

export default UploadPlan;
