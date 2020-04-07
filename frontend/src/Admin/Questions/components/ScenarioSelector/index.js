import React, { useContext } from "react";
import PropTypes from "prop-types";

import { Select, MenuItem } from "@material-ui/core";
import { ScenariosServiceContext } from "../../../../services/ScenariosService";

function ScenarioSelector(props) {
  const scenarios = useContext(ScenariosServiceContext).getScenarios.data || [];

  function handleScenarioSelection(event) {
    props.setSelectedScenario(event.target.value);
  }

  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={props.selectedScenario || ""}
      onChange={handleScenarioSelection}
      fullWidth
    >
      {scenarios.map((s, index) => {
        return (
          <MenuItem key={index} value={s.id}>
            {s.names.fr}
          </MenuItem>
        );
      })}
    </Select>
  );
}

ScenarioSelector.propTypes = {
  selectedScenario: PropTypes.number,
  setSelectedScenario: PropTypes.func.isRequired,
};

export default ScenarioSelector;
