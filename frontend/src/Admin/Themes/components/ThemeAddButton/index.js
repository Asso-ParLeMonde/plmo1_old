import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";

import ThemeModal from "../ThemeModal";

const useStyles = makeStyles(() => ({
  link: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16
  }
}));

function AddThemeButton(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(event) {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(`/admin/themes/${props.link}`);
  }

  return (
    <React.Fragment>
      <Button
        component="a"
        variant="contained"
        color="primary"
        href={`/admin/themes/${props.link}`}
        onClick={handleOpenModal}
        className={classes.link}
        startIcon={<AddCircleIcon />}
      >
        Ajouter un thème
      </Button>
      <ThemeModal
        theme={props.newTheme}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={props.modalTitle}
        history={props.history}
      />
    </React.Fragment>
  );
}

AddThemeButton.propTypes = {
  newTheme: PropTypes.object,
  link: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(AddThemeButton);
