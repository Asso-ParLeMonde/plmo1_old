import React from "react";
import PropTypes from "prop-types";

import ChooseLanguages from "../../../components/FormComponents/ChooseLanguage";

function LanguageForm(props) {
  return (
    <React.Fragment>
      <ChooseLanguages handleChange={props.handleChange} />
    </React.Fragment>
  );
}

LanguageForm.propTypes = {
  handleChange: PropTypes.func.isRequired
};

export default LanguageForm;
