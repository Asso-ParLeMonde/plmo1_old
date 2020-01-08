import React from "react";
import PropTypes from "prop-types";

import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import RemoveThemeButton from "./components/buttons/RemoveThemeButton";
import ModifyThemeButton from "./components/buttons/ModifyThemeButton";
import AcceptThemeButton from "./components/buttons/AcceptThemeButton";

function TableBodyComponent(props) {
  const rowBackgroundColor = index => {
    if (index % 2 === 1) {
      return "tbodyDarkRow";
    }

    return "";
  };

  return (
    <TableBody>
      {props.themes.map((theme, index) => (
        <TableRow key={theme.id} className={rowBackgroundColor(index)}>
          <TableCell>{theme.id}</TableCell>
          <TableCell component="th" scope="row">
            {theme.names.fr}
          </TableCell>
          <TableCell align="center" style={{ width: 125 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              {theme.isPublished && (
                <ModifyThemeButton icon={props.validIcon} theme={theme} />
              )}
              {!theme.isPublished && (
                <AcceptThemeButton icon={props.validIcon} theme={theme} />
              )}
              <RemoveThemeButton icon={props.invalidIcon} themeId={theme.id} />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyComponent.propTypes = {
  themes: PropTypes.array.isRequired,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired
};

export default TableBodyComponent;
