import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DefaultNameInput from "./DefaultNameInput";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
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

function ChooseNames(props) {
  const classes = useStyles();
  const [nbLanguage] = useState(Object.keys(props.newElement.names).length);

  // function handleIncrement() {
  //   setNumberLanguage(nbLanguage + 1);
  // }

  function namesInputs() {
    let inputs = [];
    const languages = Object.keys(props.newElement.names);

    for (let i = 0; i < LANGUAGES.length; i += 1) {
      if (languages.indexOf(LANGUAGES[i].value) !== -1) {
        inputs.push(
          <DefaultNameInput
            key={i}
            language={LANGUAGES[i]}
            newElement={props.newElement}
            handleChange={props.handleChange}
          />
        );
      }
    }

    return inputs;
  }

  return (
    <React.Fragment>
      <span className={classes.title}>Noms</span>
      {namesInputs()}

      {LANGUAGES.length > nbLanguage && (
        <div className={classes.buttonContainer}>
          <Button variant="outlined" disabled>
            Ajouter une langue
          </Button>
        </div>
      )}
    </React.Fragment>
  );
}

ChooseNames.propTypes = {
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseNames;
