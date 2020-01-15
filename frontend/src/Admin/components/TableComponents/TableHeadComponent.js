import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles(theme => ({
  thead: {
    backgroundColor: theme.palette.primary.main
  },
  th: {
    color: "white"
  }
}));

function TableHeadComponent(props) {
  const classes = useStyles();

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
    <TableHead className={classes.thead}>
      <TableRow>
        {typedHeader().map((title, index) => {
          return (
            <TableCell key={index} className={classes.th}>
              {title}
            </TableCell>
          );
        })}
        <TableCell align="center" className={classes.th}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

TableHeadComponent.propTypes = {
  type: PropTypes.oneOf(["THEME", "SCENARIO"]).isRequired
};

export default TableHeadComponent;
