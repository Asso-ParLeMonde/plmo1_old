import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  fileContainer: {
    margin: "8px 0px"
  },
  imagePreview: {
    width: "420px",
    height: "308px",
    margin: "16px 0px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  containerNames: {
    display: "flex",
    marginBottom: 16
  },
  selectNames: {
    marginRight: 4,
    width: 100
  },
  textfieldNames: {
    margin: "0px 0px 0px 4px"
  }
}));

const LANGUAGES = [
  {
    value: "fr",
    label: "FR"
  },
  {
    value: "en",
    label: "EN"
  }
];

function NamesInputs(props) {
  const classes = useStyles();
  const [languageSelected, setLanguageSelected] = useState("");

  function handleLanguageSelection(event) {
    setLanguageSelected(event.target.value);
  }

  return (
    <div className={classes.containerNames}>
      <Select
        fullWidth
        className={classes.selectNames}
        value={languageSelected}
        onChange={handleLanguageSelection}
      >
        {LANGUAGES.map(language => (
          <MenuItem key={language.value} value={language.value}>
            {language.label}
          </MenuItem>
        ))}
      </Select>

      <TextField
        id={languageSelected}
        autoFocus
        type="text"
        value={props.theme.names[languageSelected] || ""}
        onChange={props.handleNameChange}
        fullWidth
        className={classes.textfieldNames}
      />
    </div>
  );
}

ThemeForm.propTypes = {
  theme: PropTypes.object.isRequired,
  handleNameChange: PropTypes.func.isRequired
};

function ThemeForm(props) {
  const classes = useStyles();
  const [nbLanguage, setNumberLanguage] = useState(1);

  function handleIncrement() {
    setNumberLanguage(nbLanguage + 1);
  }

  function namesInputs() {
    let inputs = [];

    for (let i = 0; i < nbLanguage; i++) {
      inputs.push(
        <NamesInputs
          key={i}
          theme={props.theme}
          handleNameChange={props.handleNameChange}
        />
      );
    }

    return inputs;
  }

  return (
    <React.Fragment>
      <span className={classes.title}>Image</span>
      <div className={classes.fileContainer}>
        <Button variant="outlined" color="default" component="label" fullWidth>
          Upload File
          <input
            type="file"
            style={{ display: "none" }}
            onChange={props.handleImageChange}
            accept="image/*"
          />
        </Button>
        {!!props.theme.image && (
          <img
            src={URL.createObjectURL(props.theme.image)}
            alt="your theme"
            className={classes.imagePreview}
          />
        )}
      </div>

      <span className={classes.title}>Noms</span>
      {namesInputs()}

      {LANGUAGES.length > nbLanguage && (
        <div className={classes.buttonContainer} onClick={handleIncrement}>
          <Button variant="outlined">Ajouter une langue</Button>
        </div>
      )}

      <span className={classes.title}>Description</span>
      <div>
        <TextField
          autoFocus
          type="text"
          value={props.theme.description || ""}
          onChange={props.handleNameChange}
          fullWidth
        />
      </div>
    </React.Fragment>
  );
}

ThemeForm.propTypes = {
  theme: PropTypes.object.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired
};

export default ThemeForm;
