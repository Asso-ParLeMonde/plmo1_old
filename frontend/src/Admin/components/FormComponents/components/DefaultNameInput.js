import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
  containerNames: {
    display: "flex",
    marginBottom: 16,
    alignItems: "center"
  },
  textFieldLanguage: {
    marginRight: "8px",
    fontWeight: "bold"
  },
  textFieldNames: {
    margin: "0px 0px 0px 4px"
  }
}));

function DefaultNameInput(props) {
  const classes = useStyles();

  function handleDelete() {
    delete props.newElement.names[props.language.value];

    if (props.newElement.descriptions) {
      delete props.newElement.descriptions[props.language.value];
    }

    props.setSelectedLanguageList(
      props.selectedLanguageList
        .splice(0, props.selectedLanguageList.indexOf(props.language.value))
        .concat(
          props.selectedLanguageList.splice(
            props.selectedLanguageList.indexOf(props.language.value) + 1
          )
        )
    );
  }

  return (
    <div className={classes.containerNames}>
      <div className={classes.textFieldLanguage}>{props.language.label}</div>

      <TextField
        id={props.language.value}
        autoFocus
        type="text"
        value={props.newElement.names[props.language.value] || ""}
        onChange={e => props.handleChange("NAME", e)}
        fullWidth
        className={classes.textFieldNames}
      />

      {props.language.value !== "fr" && (
        <Button
          style={{ borderRadius: "100px", minWidth: "32px", marginLeft: "8px" }}
          onClick={handleDelete}
        >
          <Close />
        </Button>
      )}
    </div>
  );
}

DefaultNameInput.propTypes = {
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  selectedLanguageList: PropTypes.array.isRequired,
  setSelectedLanguageList: PropTypes.func.isRequired
};

export default DefaultNameInput;
