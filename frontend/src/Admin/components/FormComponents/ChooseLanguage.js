import React from "react";
import PropTypes from "prop-types";

import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import languages from "../../Languages/components/iso_languages.json";

function ChooseLanguages(props) {
  const sortedLanguages = () => {
    return languages.filter(l => props.allowLanguages.includes(l.code)) || [];
  };

  const defaultValue = () => {
    if (props.defaultLanguage) {
      return languages.find(l => l.code === props.defaultLanguage);
    }
  };

  const countryToFlag = isoCode => {
    return typeof String.fromCodePoint !== "undefined"
      ? isoCode
          .toUpperCase()
          .replace(/./g, char =>
            String.fromCodePoint(char.charCodeAt(0) + 127397)
          )
      : isoCode;
  };

  const onTagsChange = (_, selectedOption) => {
    props.handleChange(selectedOption);
  };

  return (
    <React.Fragment>
      <Autocomplete
        options={
          props.allowLanguages !== undefined ? sortedLanguages() : languages
        }
        getOptionLabel={option => option.name}
        defaultValue={defaultValue()}
        onChange={onTagsChange}
        style={{ marginBottom: 8 }}
        renderOption={option => (
          <React.Fragment>
            {`${countryToFlag(option.code)} ${option.name} (${option.code})`}
          </React.Fragment>
        )}
        renderInput={params => (
          <TextField {...params} label="Choix de la langue" fullWidth />
        )}
      />
    </React.Fragment>
  );
}

ChooseLanguages.propTypes = {
  allowLanguages: PropTypes.array,
  defaultLanguage: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};

export default ChooseLanguages;
