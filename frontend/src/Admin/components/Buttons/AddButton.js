import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";

import LanguageModal from "../../Languages/components/LanguageModal";
import ScenarioModal from "../../Scenarios/components/ScenarioModal";
import ThemeModal from "../../Themes/components/ThemeModal";

const useStyles = makeStyles(() => ({
  link: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16
  }
}));

function AddButton(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(event) {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(props.link);
  }

  function showModal() {
    switch (props.type) {
      default:
        return <div />;
      case "THEME":
        return (
          <ThemeModal
            theme={props.newObject}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalTitle={props.modalTitle}
            history={props.history}
          />
        );
      case "SCENARIO":
        return (
          <ScenarioModal
            scenario={props.newScenario}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalTitle={props.modalTitle}
            history={props.history}
          />
        );
      case "LANGUAGE":
        return (
          <LanguageModal
            scenario={props.newLanguage}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            modalTitle={props.modalTitle}
            history={props.history}
          />
        );
    }
  }

  return (
    <React.Fragment>
      <Button
        component="a"
        variant="contained"
        color="primary"
        href={props.link}
        onClick={handleOpenModal}
        className={classes.link}
        startIcon={<AddCircleIcon />}
      >
        {props.buttonTitle}
      </Button>

      {showModal()}
    </React.Fragment>
  );
}

AddButton.propTypes = {
  buttonTitle: PropTypes.string.isRequired,
  newObject: PropTypes.object,
  type: PropTypes.oneOf(["THEME", "SCENARIO", "LANGUAGE"]).isRequired,
  link: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(AddButton);
