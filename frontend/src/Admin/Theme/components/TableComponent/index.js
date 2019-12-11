import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableHeadComponent from "./TableHeadComponent";
import TableBodyComponent from "./TableBodyComponent";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
}));

function TableComponent(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHeadComponent />
        <TableBodyComponent
          themes={props.themes}
          validIcon={props.validIcon}
          invalidIcon={props.invalidIcon}
        />
      </Table>
    </Paper>
  );
}

TableComponent.propTypes = {
  themes: PropTypes.array.isRequired,
  validIcon: PropTypes.object,
  invalidIcon: PropTypes.object
};

export default TableComponent;
