import React, { useContext } from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import Accordion from "../components/Accordion";
import AccordionContainer from "../components/Accordion/AccordionContainer";
import { ScenariosServiceContext } from "../../services/ScenariosService";
import AddScenarioButton from "./components/ScenarioAddButton";

function Scenarios() {
  let scenarios = [];

  // eslint-disable-next-line
  const scenariosRequest = useContext(ScenariosServiceContext).getScenarios;
  if (scenariosRequest.complete && !scenariosRequest.error) {
    scenarios = scenariosRequest.data;
  }

  return (
    <React.Fragment>
      <AccordionContainer>
        <Accordion
          type="SCENARIO"
          title={"Liste des scenarios par default"}
          elements={scenarios.filter(scenario => scenario.isDefault === true)}
          validIcon={<EditIcon />}
          invalidIcon={<DeleteIcon />}
        />

        <AddScenarioButton
          modalTitle={"Creation d'un nouveau scenario"}
          link={"new"}
        />
      </AccordionContainer>

      <AccordionContainer>
        <Accordion
          type="SCENARIO"
          title={"Autres scenarios existant"}
          elements={scenarios.filter(scenario => scenario.isDefault === false)}
          validIcon={<CheckIcon />}
          invalidIcon={<ClearIcon />}
        />
      </AccordionContainer>
    </React.Fragment>
  );
}

Scenarios.propTypes = {};

export default Scenarios;
