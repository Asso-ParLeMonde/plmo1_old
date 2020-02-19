import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import DefaultNameInput from "./components/DefaultNameInput";
import AddLanguage from "./components/AddLanguageButton";
import { LANGUAGES } from "./ChooseContainer";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

function ChooseNames(props) {
  const classes = useStyles();

  function namesInputs() {
    let inputs = [];
    const languages = LANGUAGES.filter(l =>
      props.selectedLanguageList.includes(l.value)
    );

    for (let i = 0; i < languages.length; i += 1) {
      inputs.push(
        <DefaultNameInput
          key={i}
          language={languages[i]}
          newElement={props.newElement}
          handleChange={props.handleChange}
          selectedLanguageList={props.selectedLanguageList}
          setSelectedLanguageList={props.setSelectedLanguageList}
        />
      );
    }

    return inputs;
  }

  return (
    <React.Fragment>
      <span className={classes.title}>Noms</span>
      {namesInputs()}

      <AddLanguage
        LANGUAGES={LANGUAGES}
        selectedLanguageList={props.selectedLanguageList}
        setSelectedLanguageList={props.setSelectedLanguageList}
      />
    </React.Fragment>
  );
}

ChooseNames.propTypes = {
  selectedLanguageList: PropTypes.array.isRequired,
  setSelectedLanguageList: PropTypes.func.isRequired,
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseNames;
