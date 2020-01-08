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
import Notifications from "../TableComponent/components/buttons/Notifications";
import { axiosRequest } from "../../../component/axiosRequest";

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 24px 24px"
  }
}));

const DEFAULT_THEME = {
  id: undefined,
  names: {
    en: undefined,
    fr: undefined,
  },
  description: undefined,
  image: undefined,
  published: undefined
};

function ThemeModal(props) {
  const classes = useStyles();
  const [theme, setTheme] = useState(props.theme || DEFAULT_THEME);

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
      case 'DESCRIPTION':
        setTheme({...theme, description: event.target.value})
        break;
      case 'NAME':
        setTheme({
          ...theme,
          names: {
            ...theme.names,
            [event.target.id]: event.target.value
          }
        });
        break;
      case 'IMAGE':
        setTheme({
          ...theme,
          image: event.target.files[0]
        });
        break;
    }
  }

  function handleConfirmation(event) {
    event.preventDefault();

    let request = null;
    let requestImage = null;

    console.log(theme)
    if (props.theme) {
      if (props.theme.id) {
        request = axiosRequest({
          method: "PUT",
          url: `${process.env.REACT_APP_BASE_APP}/themes/${props.theme.id}`,
          data: {
            names: theme.names,
            description: theme.description,
            isPublished: true
          }
        });

        if (request.error === true && request.complete === true) {
          return setRes({
            error: true,
            complete: true,
            message: "Erreur lors de la modification du theme"
          });
        }

        if (request.error === false && request.complete === true) {
          requestImage = axiosRequest({
            method: "PUT",
            url: `${process.env.REACT_APP_BASE_APP}/themes/${props.theme.id}/image`,
            data: {
              image: theme.image
            }
          });

          if (requestImage.error === true && requestImage.complete === true) {
            return setRes({
              error: true,
              complete: true,
              message: "Erreur lors de la modification de l'image du theme"
            });
          }
        }
      }

      setRes({
        error: false,
        complete: true,
        message: "Success lors de la modification du theme"
      });
    } else {
      request = axiosRequest({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_APP}/themes`,
        data: {
          names: theme.names,
          description: theme.description,
          isPublished: true
        }
      });

      if (request.error === true && request.complete === true) {
        return setRes({
          error: true,
          complete: true,
          message: "Erreur lors de la creation du theme"
        });
      }

      if (request.error === false && request.complete === true) {
        requestImage = axiosRequest({
          method: "PUT",
          url: `${process.env.REACT_APP_BASE_APP}/themes/${request.id}/image`,
          data: {
            image: theme.image
          }
        });

        if (requestImage.error === true && requestImage.complete === true) {
          return setRes({
            error: true,
            complete: true,
            message: "Erreur lors de la creation de l'image du theme"
          });
        }
      }

      setRes({
        error: false,
        complete: true,
        message: "Success lors de la creation du theme"
      });
    }

    props.setIsOpen(false);
    props.history.push("/admin/themes");
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
            handleChange={handleChange}
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
