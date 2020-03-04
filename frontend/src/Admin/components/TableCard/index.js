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
          validIcon={props.validIcon}
          invalidIcon={props.invalidIcon}
        />
      </CardContent>
      <CardActions style={{ paddingLeft: "16px" }}>
        {props.children}
      </CardActions>
    </Card>
  );
}

TableCard.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(["THEME", "SCENARIO", "QUESTION", "LANGUAGE"])
    .isRequired,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired
};

export default TableCard;
