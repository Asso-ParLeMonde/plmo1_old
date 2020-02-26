import React, { useContext } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import DefaultNameInput from "./components/DefaultNameInput";
import AddLanguage from "./components/AddLanguageButton";
import { LanguagesServiceContext } from "../../../services/LanguagesService";

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
  const languagesContext = useContext(LanguagesServiceContext).getLanguages
    .data;

  function namesInputs() {
    let inputs = [];
    const languages = languagesContext.filter(l =>
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
      <div className={classes.title}>Noms</div>
      {namesInputs()}

      <AddLanguage
        languageContext={languagesContext}
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
