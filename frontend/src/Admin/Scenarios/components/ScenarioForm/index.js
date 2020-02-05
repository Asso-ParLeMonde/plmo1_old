import React from "react";
import PropTypes from "prop-types";

import ChooseDescription from "../../../components/FormComponents/ChooseDescription";
import ChooseNames from "../../../components/FormComponents/ChooseNames";

function ScenarioForm(props) {
  return (
    <React.Fragment>
      <ChooseNames
        newElement={props.scenario}
        handleChange={props.handleChange}
      />
      <ChooseDescription
        scenario={props.scenario}
        handleChange={props.handleChange}
      />
    </React.Fragment>
  );
}

ScenarioForm.propTypes = {
  scenario: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ScenarioForm;
