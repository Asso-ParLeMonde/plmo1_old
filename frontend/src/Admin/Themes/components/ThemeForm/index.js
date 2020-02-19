import React, { useState } from "react";
import PropTypes from "prop-types";

import ChooseImage from "./component/ChooseImage";
import ChooseContainer from "../../../components/FormComponents/ChooseContainer";

function ThemeForm(props) {
  const [selectedLanguageList, setSelectedLanguageList] = useState(
    Object.keys(props.theme.names)
  );

  return (
    <React.Fragment>
      <ChooseImage theme={props.theme} handleChange={props.handleChange} />
      <ChooseContainer
        type={"NAMES"}
        newElement={props.theme}
        handleChange={props.handleChange}
        selectedLanguageList={selectedLanguageList}
        setSelectedLanguageList={setSelectedLanguageList}
      />
    </React.Fragment>
  );
}

ThemeForm.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ThemeForm;
