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
import LanguageRemoveButton from "../../Languages/components/LanguageTableComponents/LanguageRemoveButton";

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
        return (
          <React.Fragment>
            <LanguageRemoveButton icon={props.invalidIcon} language={element} />
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
        information = ["id", "names.fr"];
        break;
      case "SCENARIO":
        information = ["id", "name", "names.fr", "descriptions.fr"];
        break;
      case "LANGUAGE":
        information = ["id", "label", "value"];
        break;
    }

    return information;
  }

  function getInfo(el, info) {
    const splitedInfo = info.split(".");
    let finalInfo = el;

    splitedInfo.forEach(element => {
      finalInfo = finalInfo[element];
    });

    return finalInfo;
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
  type: PropTypes.oneOf(["THEME", "SCENARIO", "LANGUAGE"]).isRequired,
  elements: PropTypes.array.isRequired,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired
};

export default TableBodyComponent;
