import React from "react";
import PropTypes from "prop-types";

import ChooseLabel from "../../../components/FormComponents/ChooseLabel";
import ChooseValue from "../../../components/FormComponents/ChooseValue";

function LanguageForm(props) {
  console.log(props, props.newElement)
  console.log(props.handleChange("LABEL"));
  return (
    <React.Fragment>
      <ChooseLabel
        language={props.language}
        handleChange={props.handleChange("LABEL")}
      />
      <ChooseValue
        language={props.language}
        handleChange={props.handleChange("VALUE")}
      />
    </React.Fragment>
  );
}

LanguageForm.propTypes = {
  language: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default LanguageForm;
