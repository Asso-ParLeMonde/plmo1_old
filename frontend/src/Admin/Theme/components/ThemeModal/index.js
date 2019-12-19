import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ThemeForm from "../ThemeForm";

import "./themeModal.css";
import { axiosRequest } from "../TableComponent/components/buttons/axiosRequest";
import Notifications from "../TableComponent/components/buttons/Notifications";

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 24px 24px"
  }
}));

function ThemeModal(props) {
  const classes = useStyles();
  const [theme, setTheme] = useState(
    props.theme || {
      id: null,
      names: {
        fr: null,
        en: null
      },
      image: null,
      published: true
    }
  );

  const [res, setRes] = useState({
    data: null,
    complete: false,
    pending: false,
    error: false
  });

  function handleNameChange(event) {
    setTheme({
      ...theme,
      names: {
        ...theme.names,
        [event.target.id]: event.target.value
      }
    });
  }

  function handleImageChange(event) {
    setTheme({
      ...theme,
      image: event.target.files[0]
    });
  }

  function handleConfirmation(event) {
    event.preventDefault();

    if (props.theme) {
      if (props.theme.id) {
        axiosRequest(
          {
            method: "PUT",
            url: `${process.env.REACT_APP_BASE_APP}/themes/${props.theme.id}`,
            body: {
              names: theme.names,
              image: theme.image,
              isPublished: true
            }
          },
          setRes
        );
      }
    } else {
      axiosRequest(
        {
          method: "PUT",
          url: `${process.env.REACT_APP_BASE_APP}/themes/new`,
          body: {
            names: theme.names,
            image: theme.image,
            isPublished: false
          }
        },
        setRes
      );
    }

    if (!res.error && res.complete) {
      props.setIsOpen(false);
      props.history.push("/admin/themes");
    }
  }

  function handleCloseModal(event) {
    event.preventDefault();

    props.setIsOpen(false);
    setTheme(
      props.theme || {
        id: null,
        names: {
          fr: null,
          en: null
        },
        image: null,
        published: true
      }
    );
    props.history.push("/admin/themes");
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.isOpen}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.modalTitle}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <ThemeForm
            theme={theme}
            handleNameChange={handleNameChange}
            handleImageChange={handleImageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmation}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Notifications res={res} setRes={setRes} />
    </React.Fragment>
  );
}

ThemeModal.propTypes = {
  theme: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default ThemeModal;
