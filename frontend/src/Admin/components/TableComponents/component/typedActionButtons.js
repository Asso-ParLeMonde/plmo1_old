import React from "react";

import ThemeModifyButton from "../../../Themes/components/ThemeTableComponents/ThemeModifyButton";
import ThemeAcceptButton from "../../../Themes/components/ThemeTableComponents/ThemeAcceptButton";
import ThemeRemoveButton from "../../../Themes/components/ThemeTableComponents/ThemeRemoveButton";
import ScenarioModifyButton from "../../../Scenarios/components/ScenarioTableComponents/ScenarioModifyButton";
import ScenarioAcceptButton from "../../../Scenarios/components/ScenarioTableComponents/ScenarioAcceptButton";
import ScenarioRemoveButton from "../../../Scenarios/components/ScenarioTableComponents/ScenarioRemoveButton";
import ScenarioQuestionModal from "../../../Scenarios/components/ScenarioTableComponents/ScenarioQuestionsModal";
import LanguageRemoveButton from "../../../Languages/components/LanguageTableComponents/LanguageRemoveButton";
import QuestionModifyButton from "../../../Questions/components/QuestionTableComponents/QuestionModifyButton";
import QuestionAcceptButton from "../../../Questions/components/QuestionTableComponents/QuestionAcceptButton";
import QuestionRemoveButton from "../../../Questions/components/QuestionTableComponents/QuestionRemoveButton";
import UserRemoveButton from "../../../Users/components/UserTableComponents/UserRemoveButton";
import UserModifyButton from "../../../Users/components/UserTableComponents/UserModifyButton";

export function typedActionButtons(type, element, validIcon, invalidIcon) {
  switch (type) {
    default:
      return <div />;

    case "THEME":
      return (
        <React.Fragment>
          {element.isPublished && (
            <ThemeModifyButton icon={validIcon} theme={element} />
          )}
          {!element.isPublished && (
            <ThemeAcceptButton icon={validIcon} theme={element} />
          )}
          <ThemeRemoveButton icon={invalidIcon} theme={element} />
        </React.Fragment>
      );

    case "SCENARIO":
      return (
        <React.Fragment>
          <ScenarioQuestionModal scenario={element} />
          {element.isDefault && (
            <ScenarioModifyButton icon={validIcon} scenario={element} />
          )}
          {!element.isDefault && (
            <ScenarioAcceptButton icon={validIcon} scenario={element} />
          )}
          <ScenarioRemoveButton icon={invalidIcon} scenario={element} />
        </React.Fragment>
      );

    case "QUESTION":
      return (
        <React.Fragment>
          {element.isDefault && (
            <QuestionModifyButton icon={validIcon} question={element} />
          )}
          {!element.isDefault && (
            <QuestionAcceptButton icon={validIcon} question={element} />
          )}
          <QuestionRemoveButton icon={invalidIcon} question={element} />
        </React.Fragment>
      );

    case "LANGUAGE":
      if (element.value === "fr") {
        return;
      }
      return <LanguageRemoveButton icon={invalidIcon} language={element} />;

    case "USER":
      return (
        <React.Fragment>
          <UserModifyButton icon={validIcon} user={element} />
          <UserRemoveButton icon={invalidIcon} user={element} />
        </React.Fragment>
      );
  }
}
