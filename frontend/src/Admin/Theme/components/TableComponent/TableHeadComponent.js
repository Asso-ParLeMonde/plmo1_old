import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

function TableHeadComponent(props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Id</TableCell>
        <TableCell>Name</TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

TableHeadComponent.propTypes = {};

export default TableHeadComponent;
