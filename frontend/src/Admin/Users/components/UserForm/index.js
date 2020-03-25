import React from "react";
import PropTypes from "prop-types";

function ThemeForm(props) {
  console.log(props);
  return <React.Fragment>Waiting for creation modal</React.Fragment>;
}

ThemeForm.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ThemeForm;
