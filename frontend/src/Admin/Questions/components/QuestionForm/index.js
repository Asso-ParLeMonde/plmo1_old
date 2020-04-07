import React, { useContext } from "react";
import PropTypes from "prop-types";

import ChooseQuestion from "../../../components/FormComponents/ChooseQuestion";
import ChooseLanguages from "../../../components/FormComponents/ChooseLanguage";
import { ScenariosServiceContext } from "../../../../services/ScenariosService";

function QuestionForm(props) {
  const scenarios = useContext(ScenariosServiceContext).getScenarios.data || [];

  const allowLanguages = () => {
    const currentScenario = scenarios.find(
      (s) => s.id === props.question.scenarioId
    );

    return Object.keys(currentScenario.names);
  };

  const handleLanguageCode = (selectedLanguage) => {
    props.handleChange("LANGUAGECODE", selectedLanguage);
  };

  return (
    <React.Fragment>
      <ChooseLanguages
        allowLanguages={allowLanguages()}
        defaultLanguage={props.question.languageCode}
        handleChange={handleLanguageCode}
      />
      <ChooseQuestion
        question={props.question}
        handleChange={props.handleChange}
      />
    </React.Fragment>
  );
}

QuestionForm.propTypes = {
  question: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default QuestionForm;
