import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 16
  },
  fileContainer: {
    margin: "8px 0px"
  },
  imagePreview: {
    width: "420px",
    height: "308px",
    margin: "16px 0px"
  }
}));

function ChooseImage(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <span className={classes.title}>Image</span>
      <div className={classes.fileContainer}>
        <Button variant="outlined" color="default" component="label" fullWidth>
          Upload File
          <input
            type="file"
            style={{ display: "none" }}
            onChange={e => props.handleChange("IMAGE", e)}
            accept="image/*"
          />
        </Button>
        {!!props.theme.image && (
          <img
            src={
              (props.theme.image || {}).path ||
              URL.createObjectURL(props.theme.image)
            }
            alt="your theme"
            className={classes.imagePreview}
          />
        )}
      </div>
    </React.Fragment>
  );
}

ChooseImage.propTypes = {
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ChooseImage;
