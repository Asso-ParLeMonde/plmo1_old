import React from "react";
import PropTypes from "prop-types";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import ModifyThemeButton from "../../Themes/components/TableSpecialComponents/ModifyThemeButton";
import AcceptThemeButton from "../../Themes/components/TableSpecialComponents/AcceptThemeButton";
import RemoveThemeButton from "../../Themes/components/TableSpecialComponents/RemoveThemeButton";

function TableBodyComponent(props) {
  const rowBackgroundColor = index => {
    return index % 2 === 1 ? "tbodyDarkRow" : "";
  };

  function buttons(type, element) {
    switch (type) {
      default:
        return <div />;
      case "THEME":
        return (
          <React.Fragment>
            {element.isPublished && (
              <ModifyThemeButton icon={props.validIcon} theme={element} />
            )}
            {!element.isPublished && (
              <AcceptThemeButton icon={props.validIcon} theme={element} />
            )}
            <RemoveThemeButton icon={props.invalidIcon} theme={element} />
          </React.Fragment>
        );
    }
  }

  return (
    <TableBody>
      {props.elements.map((el, index) => (
        <TableRow key={el.id} className={rowBackgroundColor(index)}>
          <TableCell>{el.id}</TableCell>
          <TableCell component="th" scope="row">
            {el.names.fr}
          </TableCell>
          <TableCell align="center" style={{ width: 125 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              {buttons("THEME", el)}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyComponent.propTypes = {
  type: PropTypes.oneOf("THEME").isRequired,
  elements: PropTypes.array.isRequired,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired
};

export default TableBodyComponent;
