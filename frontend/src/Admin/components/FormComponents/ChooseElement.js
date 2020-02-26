import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import { Select, MenuItem } from "@material-ui/core";

import { ThemesServiceContext } from "../../../services/ThemesService";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
}));

function ChooseElement(props) {
  const classes = useStyles();

  const themes = useContext(ThemesServiceContext).getThemes.data;
  console.log(themes);
  const [selectedElement, setSelectedElement] = useState(
    props.newElement.themeId || null
  );

  console.log(selectedElement);

  function handleSelection(event) {
    setSelectedElement(event.target.value);
    props.handleChange("THEMEID", event);
  }

  return (
    <React.Fragment>
      <div className={classes.title}>Theme associe</div>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedElement || ""}
        onChange={handleSelection}
      >
        {themes.map((th, index) => {
          return (
            <MenuItem key={index} value={th.id}>
              {th.names.fr}
            </MenuItem>
          );
        })}
      </Select>
    </React.Fragment>
  );
}

ChooseElement.propTypes = {
  type: PropTypes.oneOf(["THEMEID"]).isRequired,
  newElement: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseElement;
