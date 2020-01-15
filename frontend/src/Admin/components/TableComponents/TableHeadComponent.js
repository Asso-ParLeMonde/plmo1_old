import React from "react";
import PropTypes from "prop-types";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

function TableHeadComponent(props) {
  function typedHeader() {
    let titles = [];

    switch (props.type) {
      default:
        break;
      case "THEME":
        titles = ["Id", "Titre"];
        break;
      case "SCENARIO":
        titles = ["Id", "Titre", "Theme", "Description"];
        break;
    }

    return titles;
  }

  return (
    <TableHead className="thead">
      <TableRow>
        {typedHeader().map((title, index) => {
          return <TableCell key={index}>{title}</TableCell>;
        })}
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

TableHeadComponent.propTypes = {
  type: PropTypes.oneOf(["THEME", "SCENARIO"]).isRequired
};

export default TableHeadComponent;
