import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TableComponent from "../TableComponent";
import PropTypes from "prop-types";

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
          themes={props.themes}
          validIcon={props.validIcon}
          invalidIcon={props.invalidIcon}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  themes: PropTypes.array.isRequired,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired
};

export default Accordion;
