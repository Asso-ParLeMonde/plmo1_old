import React from "react";
import PropTypes from "prop-types";

import ChooseNames from "../../../components/FormComponents/ChooseNames";
import ChooseImage from "./component/ChooseImage";

function ThemeForm(props) {
  return (
    <React.Fragment>
      <ChooseImage theme={props.theme} handleChange={props.handleChange} />
      <ChooseNames newElement={props.theme} handleChange={props.handleChange} />
    </React.Fragment>
  );
}

ThemeForm.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ThemeForm;
