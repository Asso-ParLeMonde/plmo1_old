import React from "react";
import PropTypes from "prop-types";

import ChooseLanguages from "../../../components/FormComponents/ChooseLanguage";

function LanguageForm(props) {
  return <ChooseLanguages handleChange={props.handleChange} />;
}

LanguageForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default LanguageForm;
