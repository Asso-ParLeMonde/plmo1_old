import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import DefaultNameInput from "./components/DefaultNameInput";
import AddLanguage from "./components/AddLanguageButton";

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
  },
  {
    value: "es",
    label: "ES"
  }
];

function ChooseNames(props) {
  const classes = useStyles();
  const [selectedLanguageList, setSelectedLanguageList] = useState(
    Object.keys(props.newElement.names)
  );

  function namesInputs() {
    let inputs = [];
    const languages = LANGUAGES.filter(l =>
      selectedLanguageList.includes(l.value)
    );

    for (let i = 0; i < languages.length; i += 1) {
      inputs.push(
        <DefaultNameInput
          key={i}
          language={languages[i]}
          newElement={props.newElement}
          handleChange={props.handleChange}
          selectedLanguageList={selectedLanguageList}
          setSelectedLanguageList={setSelectedLanguageList}
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
        selectedLanguageList={selectedLanguageList}
        setSelectedLanguageList={setSelectedLanguageList}
      />
    </React.Fragment>
  );
}

ChooseNames.propTypes = {
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseNames;
