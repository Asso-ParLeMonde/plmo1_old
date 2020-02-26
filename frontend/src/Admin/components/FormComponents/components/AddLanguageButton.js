import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

function AddLanguage(props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  function handleLanguageSelection(event) {
    setSelectedLanguage(event.target.value);
  }

  function filterLanguage() {
    return props.languageContext.filter(
      l => !props.selectedLanguageList.includes(l.value)
    );
  }

  function handleConfirmation() {
    props.setSelectedLanguageList(
      props.selectedLanguageList.concat(selectedLanguage)
    );
    setSelectedLanguage(null);
    setIsOpen(false);
  }

  return (
    <div className={classes.buttonContainer}>
      <Button
        variant="outlined"
        onClick={handleOpenModal}
        disabled={
          !(props.languageContext.length > props.selectedLanguageList.length)
        }
      >
        Ajouter une langue
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Choix de la langue a ajouter.
        </DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <FormControl style={{ width: "10vw" }}>
            <InputLabel id="demo-simple-select-label">Langue</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedLanguage || ""}
              onChange={handleLanguageSelection}
            >
              {filterLanguage().map((l, index) => {
                return (
                  <MenuItem key={index} value={l.value}>
                    {l.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
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
    </div>
  );
}

AddLanguage.propTypes = {
  languageContext: PropTypes.array.isRequired,
  selectedLanguageList: PropTypes.array.isRequired,
  setSelectedLanguageList: PropTypes.func.isRequired
};

export default AddLanguage;
