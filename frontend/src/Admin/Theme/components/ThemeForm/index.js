import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

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

const OTHER_LANGUAGES = [
  {
    value: "en",
    label: "EN"
  }
];

function OtherNamesInputs(props) {
  const classes = useStyles();

  return (
    <div className={classes.containerNames}>
      <div>{props.language.label}</div>

      <TextField
        id={props.language.value}
        autoFocus
        type="text"
        value={props.theme.names[props.language.value] || ""}
        onChange={e => props.handleChange("NAME", e)}
        fullWidth
        className={classes.textFieldNames}
      />
    </div>
  );
}

NamesInputs.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired
};

function NamesInputs(props) {
  const classes = useStyles();

  return (
    <div className={classes.containerNames}>
      <div>{props.language.label}</div>

      <TextField
        id={props.language.value}
        autoFocus
        type="text"
        value={props.theme.names[props.language.value] || ""}
        onChange={e => props.handleChange("NAME", e)}
        fullWidth
        className={classes.textFieldNames}
      />
    </div>
  );
}

NamesInputs.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired
};

function ThemeForm(props) {
  const classes = useStyles();
  const [nbLanguage, setNumberLanguage] = useState(
    Object.keys(props.theme.names).length - 1
  );

  function handleIncrement() {
    setNumberLanguage(nbLanguage + 1);
  }

  function namesInputs() {
    let inputs = [];

    for (let i = 0; i < nbLanguage; i += 1) {
      console.log("in");
      inputs.push(
        <OtherNamesInputs
          key={i}
          language={OTHER_LANGUAGES[i]}
          theme={props.theme}
          handleChange={props.handleChange}
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
            onChange={e => props.handleChange("IMAGE", e)}
            accept="image/*"
          />
        </Button>
        {!!props.theme.image && (
          <img
            src={
              (props.theme.image || {}).path ||
              URL.createObjectURL(props.theme.image)
            }
            alt="your theme"
            className={classes.imagePreview}
          />
        )}
      </div>

      <span className={classes.title}>Noms</span>
      <NamesInputs
        theme={props.theme}
        handleChange={props.handleChange}
        language={{
          value: "fr",
          label: "FR"
        }}
      />
      {namesInputs()}

      {OTHER_LANGUAGES.length > nbLanguage && (
        <div className={classes.buttonContainer}>
          <Button variant="outlined" onClick={handleIncrement}>
            Ajouter une langue
          </Button>
        </div>
      )}
    </React.Fragment>
  );
}

ThemeForm.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ThemeForm;
