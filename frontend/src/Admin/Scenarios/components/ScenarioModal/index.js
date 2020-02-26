import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { ScenariosServiceContext } from "../../../../services/ScenariosService";
import { postScenario, putScenario } from "../scenarioRequest";

const DEFAULT_SCENARIO = {
  id: null,
  names: {
    fr: null
  },
  descriptions: {
    fr: null
  },
  themeId: null,
  isDefault: true
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
        setNewScenario({
          ...newScenario,
          descriptions: {
            ...newScenario.descriptions,
            [event.target.id]: event.target.value
          }
        });
        break;
      case "THEMEID":
        setNewScenario({
          ...newScenario,
          themeId: event.target.value
        });
        break;
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    if (props.scenario) {
      await putScenario(props.scenario, newScenario, setRes);
    } else {
      await postScenario(newScenario, setRes);
    }

    updateScenarios().catch();
    handleCloseModal();
  }

  function handleCloseModal() {
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
    />
  );
}

ScenarioModal.propTypes = {
  scenario: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default ScenarioModal;
