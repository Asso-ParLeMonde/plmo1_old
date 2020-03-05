import React from "react";
import PropTypes from "prop-types";

import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import languages from "../../Languages/components/iso_languages.json";

function ChooseLanguages(props) {
  function countryToFlag(isoCode) {
    return typeof String.fromCodePoint !== "undefined"
      ? isoCode
          .toUpperCase()
          .replace(/./g, char =>
            String.fromCodePoint(char.charCodeAt(0) + 127397)
          )
      : isoCode;
  }

  function onTagsChange(_, selectedOption) {
    props.handleChange(selectedOption);
  }

  return (
    <React.Fragment>
      <Autocomplete
        options={languages}
        getOptionLabel={option => option.name}
        onChange={onTagsChange}
        renderOption={option => (
          <React.Fragment>
            {`${countryToFlag(option.code)} ${option.name} (${option.code})`}
          </React.Fragment>
        )}
        renderInput={params => (
          <TextField {...params} label="Choix du pays" fullWidth />
        )}
      />
    </React.Fragment>
  );
}

ChooseLanguages.propTypes = {
  handleChange: PropTypes.func.isRequired
};

export default ChooseLanguages;
