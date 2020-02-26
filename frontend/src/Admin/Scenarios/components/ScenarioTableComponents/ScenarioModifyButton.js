import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import ScenarioModal from "../ScenarioModal";

function ScenarioModifyButton(props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(event) {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(`/admin/scenarios/${props.scenario.id}`);
  }

  return (
    <React.Fragment>
      <a href={`/admin/themes/${props.scenario.id}`} onClick={handleOpenModal}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <ScenarioModal
        scenario={props.scenario}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={"Modification du scenario"}
        history={props.history}
      />
    </React.Fragment>
  );
}

ScenarioModifyButton.propTypes = {
  icon: PropTypes.object.isRequired,
  scenario: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ScenarioModifyButton);
