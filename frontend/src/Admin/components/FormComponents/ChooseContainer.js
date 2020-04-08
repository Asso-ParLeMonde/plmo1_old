import React from "react";
import PropTypes from "prop-types";

import ChooseNames from "./ChooseNames";
import ChooseDescriptions from "./ChooseDescriptions";
import ChooseElement from "./ChooseElement";

function ChooseContainer(props) {
  switch (props.type) {
    default:
      return <div />;
    case "NAMES":
      return (
        <ChooseNames
          selectedLanguageList={props.selectedLanguageList}
          setSelectedLanguageList={props.setSelectedLanguageList}
          newElement={props.newElement}
          handleChange={props.handleChange}
        />
      );
    case "DESCRIPTIONS":
      return (
        <ChooseDescriptions
          selectedLanguageList={props.selectedLanguageList}
          setSelectedLanguageList={props.setSelectedLanguageList}
          newElement={props.newElement}
          handleChange={props.handleChange}
        />
      );
    case "THEMEID":
      return (
        <ChooseElement
          type={props.type}
          newElement={props.newElement}
          handleChange={props.handleChange}
        />
      );
  }
}

ChooseContainer.propTypes = {
  type: PropTypes.oneOf(["NAMES", "DESCRIPTIONS", "THEMEID"]).isRequired,
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedLanguageList: PropTypes.array.isRequired,
  setSelectedLanguageList: PropTypes.func.isRequired,
};

export default ChooseContainer;
