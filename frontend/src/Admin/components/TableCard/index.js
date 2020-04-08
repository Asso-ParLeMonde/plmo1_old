import React from "react";
import PropTypes from "prop-types";

import { Card, CardContent, Typography, CardActions } from "@material-ui/core";
import TableComponent from "../TableComponents";

function TableCard(props) {
  return (
    <Card style={{ marginBottom: "2rem" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          style={{ marginBottom: "1rem" }}
        >
          {props.title}
        </Typography>
        <TableComponent
          type={props.type}
          elements={props.elements}
          setElements={props.setElements}
          validIcon={props.validIcon}
          invalidIcon={props.invalidIcon}
        />
      </CardContent>
      <CardActions
        style={{ padding: "0px 16px", justifyContent: "space-between" }}
      >
        {props.children}
      </CardActions>
    </Card>
  );
}

TableCard.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf([
    "THEMEDND",
    "THEME",
    "SCENARIO",
    "QUESTION",
    "LANGUAGE",
    "USER",
  ]).isRequired,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  setElements: PropTypes.func,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired,
};

TableCard.defaultProps = {
  setElements: () => {},
};

export default TableCard;
