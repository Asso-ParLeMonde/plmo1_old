import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { ScenariosServiceContext } from "../../../../services/ScenariosService";
import { updateScenario } from "../scenarioRequest";

const DEFAULT_SCENARIO = {
  // TODO: create default scenario
};

function ScenarioModal(props) {
  const [newScenario, setNewScenario] = useState(
    props.scenario || DEFAULT_SCENARIO
  );
  const updateScenarios = useContext(ScenariosServiceContext).updateScenarios;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
        break;
      case "NAME":
        setNewScenario({
          ...newScenario,
          names: {
            ...newScenario.names,
            [event.target.id]: event.target.value
          }
        });
        break;
      case "DESCRIPTION":
        setNewScenario({ ...newScenario, description: event.target.value });
        break;
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    let error = false;
    if (props.scenario) {
      error = await updateScenario("PUT", props.scenario, newScenario, setRes);
    } else {
      error = await updateScenario("POST", props.scenario, newScenario, setRes);
    }

    if (error === false) {
      setRes({
        error: false,
        complete: true,
        message: "Success lors dans la creation du scenario"
      });
    }

    updateScenarios().catch();
    handleCloseModal();
  }

  function handleCloseModal(event) {
    event.preventDefault();

    props.setIsOpen(false);
    setNewScenario(props.scenario || DEFAULT_SCENARIO);
    props.history.push("/admin/scenarios");
  }

  return (
    <ModalContainer
      newElement={newScenario}
      handleChange={handleChange}
      isOpen={props.isOpen}
      modalTitle={props.modalTitle}
      formDescription={"SCENARIO"}
      handleCloseModal={handleCloseModal}
      handleConfirmation={handleConfirmation}
      res={res}
      setRes={setRes}
    />
  );
}

ScenarioModal.propTypes = {
  theme: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default ScenarioModal;
