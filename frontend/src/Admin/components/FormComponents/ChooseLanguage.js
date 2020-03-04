import React from "react";
import PropTypes from "prop-types";

import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import languages from "../../Languages/components/iso_languages.json";

function ChooseLanguages(props) {
  function onTagsChange(_, selectedOption) {
    props.handleChange(selectedOption);
  }

  return (
    <React.Fragment>
      <Autocomplete
        options={languages}
        getOptionLabel={option => option.name}
        onChange={onTagsChange}
        renderInput={params => <TextField {...params} fullWidth />}
      />
    </React.Fragment>
  );
}

ChooseLanguages.propTypes = {
  handleChange: PropTypes.func.isRequired
};

export default ChooseLanguages;
