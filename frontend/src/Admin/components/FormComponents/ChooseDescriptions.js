import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

import { LANGUAGES } from "./ChooseContainer";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  textFieldLanguage: {
    marginRight: "8px",
    fontWeight: "bold"
  },
  textFieldDescriptions: {
    marginTop: "0.5rem",
    marginBottom: "2rem"
  }
}));

function ChooseDescriptions(props) {
  const classes = useStyles();

  function descriptionsInputs() {
    let inputs = [];
    const languages = LANGUAGES.filter(l =>
      props.selectedLanguageList.includes(l.value)
    );

    for (let i = 0; i < languages.length; i += 1) {
      inputs.push(
        <React.Fragment key={i}>
          <div className={classes.textFieldLanguage}>{languages[i].label}</div>

          <TextField
            id={languages[i].value}
            value={props.newElement.descriptions[languages[i].value] || ""}
            onChange={e => props.handleChange("DESCRIPTION", e)}
            required
            multiline
            variant="outlined"
            className={classes.textFieldDescriptions}
          />
        </React.Fragment>
      );
    }

    return inputs;
  }

  return (
    <React.Fragment>
      <span className={classes.title}>Description</span>
      {descriptionsInputs()}
    </React.Fragment>
  );
}

ChooseDescriptions.propTypes = {
  selectedLanguageList: PropTypes.array.isRequired,
  setSelectedLanguageList: PropTypes.func.isRequired,
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseDescriptions;
