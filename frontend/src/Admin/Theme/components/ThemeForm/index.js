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
    marginBottom: 16,
    alignItems: "center"
  },
  selectNames: {
    marginRight: 4,
    width: 100
  },
  textFieldNames: {
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

  return (
    <div className={classes.containerNames}>
      <div>
        {props.language.label}
      </div>

      <TextField
        id={props.language.value}
        autoFocus
        type="text"
        value={props.theme.names[props.language.value] || ""}
        onChange={(e) => props.handleChange("NAME", e)}
        fullWidth
        className={classes.textFieldNames}
      />
    </div>
  );
}

NamesInputs.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

function ThemeForm(props) {
  const classes = useStyles();
  const [nbLanguage] = useState(Object.keys(props.theme.names).length);

  // function handleIncrement() {
  //   setNumberLanguage(nbLanguage + 1);
  // }

  function namesInputs() {
    let inputs = [];
    const languages = Object.keys(props.theme.names);

    for (let i = 0; i < LANGUAGES.length; i += 1 ) {
      if (languages.indexOf(LANGUAGES[i].value) !== -1) {
        inputs.push(
          <NamesInputs
            key={i}
            language={LANGUAGES[i]}
            theme={props.theme}
            handleChange={props.handleChange}
          />
        );
      }
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
            onChange={(e) => props.handleChange("IMAGE", e)}
            accept="image/*"
          />
        </Button>
        {!!props.theme.image && (
          <img
            src={(props.theme.image || {}).path || URL.createObjectURL(props.theme.image)}
            alt="your theme"
            className={classes.imagePreview}
          />
        )}
      </div>

      <span className={classes.title}>Noms</span>
      {namesInputs()}

      {LANGUAGES.length > nbLanguage && (
        <div className={classes.buttonContainer}>
          <Button variant="outlined" disabled>Ajouter une langue</Button>
        </div>
      )}

      <span className={classes.title}>Description</span>
      <div>
        <TextField
          autoFocus
          type="text"
          value={props.theme.description || ""}
          onChange={(e) => props.handleChange("DESCRIPTION", e)}
          fullWidth
        />
      </div>
    </React.Fragment>
  );
}

ThemeForm.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ThemeForm;
