import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import DefaultButton from "../../../components/Buttons/DefaultButton";
import { ScenariosServiceContext } from "../../../../services/ScenariosService";
import { handleScenarioButtonRequest } from "./ScenarioButtonRequests";

function ScenarioRemoveButton(props) {
  const updateScenarios = useContext(ScenariosServiceContext).updateScenarios;

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
    await handleScenarioButtonRequest(
      "DELETE",
      props.scenario,
      setRes,
      "Succès lors de la suppression du scenario",
      "Erreur lors de la suppression du scenario",
      props.history,
      updateScenarios
    );
  }

  return (
    <DefaultButton
      href={`/admin/themes/delete`}
      handleAction={handleRemove}
      icon={props.icon}
      res={res}
    />
  );
}

ScenarioRemoveButton.propTypes = {
  scenario: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ScenarioRemoveButton);
