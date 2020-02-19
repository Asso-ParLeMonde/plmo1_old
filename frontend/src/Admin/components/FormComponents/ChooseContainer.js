import React from "react";
import PropTypes from "prop-types";

import ChooseNames from "./ChooseNames";
import ChooseDescriptions from "./ChooseDescriptions";

export const LANGUAGES = [
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
  }
}

ChooseContainer.propTypes = {
  type: PropTypes.oneOf(["NAMES", "DESCRIPTIONS"]).isRequired,
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedLanguageList: PropTypes.array.isRequired,
  setSelectedLanguageList: PropTypes.func.isRequired
};

export default ChooseContainer;
