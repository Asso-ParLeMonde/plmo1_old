import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";

import ScenarioModal from "../ScenarioModal";

const useStyles = makeStyles(() => ({
  link: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16
  }
}));

function AddScenarioButton(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(event) {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(`/admin/scenarios/${props.link}`);
  }

  return (
    <React.Fragment>
      <a
        href={`/admin/scenarios/${props.link}`}
        onClick={handleOpenModal}
        className={classes.link}
      >
        <Button variant="contained" color="primary">
          <AddCircleIcon />
        </Button>
      </a>
      <ScenarioModal
        scenario={props.newScenario}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={props.modalTitle}
        history={props.history}
      />
    </React.Fragment>
  );
}

AddScenarioButton.propTypes = {
  newScenario: PropTypes.object,
  link: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(AddScenarioButton);
