import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { ScenariosServiceContext } from "../../../../services/ScenariosService";
import DefaultButton from "../../../components/Buttons/DefaultButton";
import { handleScenarioButtonRequest } from "./ScenarioButtonRequests";

function ScenarioAcceptButton(props) {
  const updateScenarios = useContext(ScenariosServiceContext).updateScenarios;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  async function handleAcceptation(event) {
    event.preventDefault();
    await handleScenarioButtonRequest(
      "PUT",
      props.scenario,
      setRes,
      "Success lors de la validation du scenario",
      "Erreur lors de la validation du scenario",
      props.history,
      updateScenarios
    );
  }

  return (
    <DefaultButton
      href={`/admin/scenarios/${props.scenario.id}`}
      handleAction={handleAcceptation}
      icon={props.icon}
      res={res}
    />
  );
}

ScenarioAcceptButton.propTypes = {
  icon: PropTypes.object.isRequired,
  scenario: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ScenarioAcceptButton);
