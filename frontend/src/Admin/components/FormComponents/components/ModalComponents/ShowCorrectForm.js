import React from "react";

import ThemeForm from "../../../../Themes/components/ThemeForm";
import ScenarioForm from "../../../../Scenarios/components/ScenarioForm";
import QuestionForm from "../../../../Questions/components/QuestionForm";
import LanguageForm from "../../../../Languages/components/LanguageForm";

function ShowCorrectForm({ formDescription, newElement, handleChange }) {
  switch (formDescription) {
    default:
      return <div />;
    case "THEME":
      return <ThemeForm theme={newElement} handleChange={handleChange} />;
    case "SCENARIO":
      return <ScenarioForm scenario={newElement} handleChange={handleChange} />;
    case "QUESTION":
      return <QuestionForm question={newElement} handleChange={handleChange} />;
    case "LANGUAGE":
      return <LanguageForm handleChange={handleChange} />;
  }
}

export default ShowCorrectForm;
