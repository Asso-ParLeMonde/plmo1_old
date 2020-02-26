import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import ThemeModifyButton from "../../Themes/components/ThemeTableComponents/ThemeModifyButton";
import ThemeAcceptButton from "../../Themes/components/ThemeTableComponents/ThemeAcceptButton";
import ThemeRemoveButton from "../../Themes/components/ThemeTableComponents/ThemeRemoveButton";
import ScenarioModifyButton from "../../Scenarios/components/ScenarioTableComponents/ScenarioModifyButton";
import ScenarioAcceptButton from "../../Scenarios/components/ScenarioTableComponents/ScenarioAcceptButton";
import ScenarioRemoveButton from "../../Scenarios/components/ScenarioTableComponents/ScenarioRemoveButton";
import ScenarioQuestionModal from "../../Scenarios/components/ScenarioTableComponents/ScenarioQuestionsModal";
import LanguageRemoveButton from "../../Languages/components/LanguageTableComponents/LanguageRemoveButton";
import QuestionModifyButton from "../../Questions/components/QuestionTableComponents/QuestionModifyButton";
import QuestionAcceptButton from "../../Questions/components/QuestionTableComponents/QuestionAcceptButton";
import QuestionRemoveButton from "../../Questions/components/QuestionTableComponents/QuestionRemoveButton";

const useStyles = makeStyles(theme => ({
  th: {
    backgroundColor: theme.palette.primary.light
  }
}));

function TableBodyComponent(props) {
  const classes = useStyles();

  const rowBackgroundColor = index => {
    return index % 2 === 1 ? classes.trow : "";
  };

  function typedActionButtons(element) {
    switch (props.type) {
      default:
        return <div />;
      case "THEME":
        return (
          <React.Fragment>
            {element.isPublished && (
              <ThemeModifyButton icon={props.validIcon} theme={element} />
            )}
            {!element.isPublished && (
              <ThemeAcceptButton icon={props.validIcon} theme={element} />
            )}
            <ThemeRemoveButton icon={props.invalidIcon} theme={element} />
          </React.Fragment>
        );
      case "SCENARIO":
        return (
          <React.Fragment>
            <ScenarioQuestionModal scenario={element} />
            {element.isDefault && (
              <ScenarioModifyButton icon={props.validIcon} scenario={element} />
            )}
            {!element.isDefault && (
              <ScenarioAcceptButton icon={props.validIcon} scenario={element} />
            )}
            <ScenarioRemoveButton icon={props.invalidIcon} scenario={element} />
          </React.Fragment>
        );
      case "LANGUAGE":
        if (element.value === "fr") {
          return;
        }

        return (
          <LanguageRemoveButton icon={props.invalidIcon} language={element} />
        );
      case "QUESTION":
        return (
          <React.Fragment>
            {element.isStandard && (
              <QuestionModifyButton icon={props.validIcon} theme={element} />
            )}
            {!element.isStandard && (
              <QuestionAcceptButton icon={props.validIcon} theme={element} />
            )}
            <QuestionRemoveButton icon={props.invalidIcon} theme={element} />
          </React.Fragment>
        );
    }
  }

  function typedBody() {
    let information = [];

    switch (props.type) {
      default:
        break;
      case "THEME":
        information = ["ID", "NAME"];
        break;
      case "SCENARIO":
        information = ["ID", "NAME", "THEMEID", "DESCRIPTION"];
        break;
      case "LANGUAGE":
        information = ["ID", "LABEL", "VALUE"];
        break;
      case "QUESTION":
        information = ["id", "languageCode", "question", "scenario.id"];
        break;
    }

    return information;
  }

  function getInfo(el, info) {
    switch (info) {
      default:
        return "";

      case "ID":
        return el.id;

      case "NAME":
        const languagesName = Object.keys(el.names);

        const names = [];
        for (let i = 0; i < languagesName.length; i++) {
          names.push(el.names[languagesName[i]]);
        }

        return names.find((name, index) => {
          if (name !== "") {
            if (languagesName[index] !== "fr") {
              return `${languagesName[index].toUpperCase()} : ${name}`;
            }

            return name;
          }

          return "";
        });

      case "THEMEID":
        return el.themeId;

      case "DESCRIPTION":
        const languagesDescription = Object.keys(el.names);

        const descriptions = [];
        for (let j = 0; j < languagesDescription.length; j++) {
          descriptions.push(el.descriptions[languagesDescription[j]]);
        }

        return descriptions.find((description, index) => {
          if (description !== "") {
            if (languagesDescription[index] !== "fr") {
              return `${languagesDescription[
                index
              ].toUpperCase()} : ${description}`;
            }

            return description;
          }

          return "";
        });

      case "LABEL":
        return el.label;

      case "VALUE":
        return el.value;
    }
  }

  return (
    <TableBody>
      {props.elements.map((el, index) => (
        <TableRow key={el.id} className={rowBackgroundColor(index)}>
          {typedBody().map((info, index) => {
            return <TableCell key={index}>{getInfo(el, info)}</TableCell>;
          })}
          <TableCell
            align="center"
            style={{ width: 100, padding: "0 16px 0 0" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              {typedActionButtons(el)}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyComponent.propTypes = {
  type: PropTypes.oneOf(["THEME", "SCENARIO", "QUESTION", "LANGUAGE"])
    .isRequired,
  elements: PropTypes.array.isRequired,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired
};

export default TableBodyComponent;
