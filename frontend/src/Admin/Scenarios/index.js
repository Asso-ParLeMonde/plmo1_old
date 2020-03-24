import React, { useContext } from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { ScenariosServiceContext } from "../../services/ScenariosService";
import TableCard from "../components/TableCard";
import AddButton from "../components/Buttons/AddButton";

function Scenarios() {
  const { getScenarios: scenariosRequest } = useContext(
    ScenariosServiceContext
  );
  const scenarios =
    scenariosRequest.complete && !scenariosRequest.error
      ? scenariosRequest.data
      : [];

  return (
    <React.Fragment>
      <TableCard
        type="SCENARIO"
        title={"Liste des scenarios par default"}
        elements={scenarios.filter(scenario => scenario.isDefault === true)}
        validIcon={<EditIcon />}
        invalidIcon={<DeleteIcon />}
      >
        <AddButton
          buttonTitle="Ajouter un scenario"
          type="SCENARIO"
          link="/admin/scenarios/new"
          modalTitle="Creation d'un nouveau scenario par default"
        />
      </TableCard>

      <TableCard
        type="SCENARIO"
        title={"Autres scenarios existant"}
        elements={scenarios.filter(scenario => scenario.isDefault === false)}
        validIcon={<CheckIcon />}
        invalidIcon={<ClearIcon />}
      />
    </React.Fragment>
  );
}

Scenarios.propTypes = {};

export default Scenarios;
