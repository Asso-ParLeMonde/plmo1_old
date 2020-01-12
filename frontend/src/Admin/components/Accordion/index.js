import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TableComponent from "../TableComponents";

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(30),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

function Accordion(props) {
  const classes = useStyles();

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>{props.title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <TableComponent
          type={props.type}
          elements={props.elements}
          validIcon={props.validIcon}
          invalidIcon={props.invalidIcon}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

Accordion.propTypes = {
  type: PropTypes.oneOf("THEME").isRequired,
  title: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired
};

export default Accordion;
