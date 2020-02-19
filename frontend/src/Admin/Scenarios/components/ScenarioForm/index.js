import React, { useState } from "react";
import PropTypes from "prop-types";

import ChooseContainer from "../../../components/FormComponents/ChooseContainer";

function ScenarioForm(props) {
  const [selectedLanguageList, setSelectedLanguageList] = useState(
    Object.keys(props.scenario.names)
  );

  return (
    <React.Fragment>
      <ChooseContainer
        type={"NAMES"}
        newElement={props.scenario}
        handleChange={props.handleChange}
        selectedLanguageList={selectedLanguageList}
        setSelectedLanguageList={setSelectedLanguageList}
      />
      <ChooseContainer
        type={"DESCRIPTIONS"}
        newElement={props.scenario}
        handleChange={props.handleChange}
        selectedLanguageList={selectedLanguageList}
        setSelectedLanguageList={setSelectedLanguageList}
      />
    </React.Fragment>
  );
}

ScenarioForm.propTypes = {
  scenario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ScenarioForm;
