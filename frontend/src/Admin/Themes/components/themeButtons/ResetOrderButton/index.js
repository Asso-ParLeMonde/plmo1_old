import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
  link: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
}));

function ResetOrderButton(props) {
  const classes = useStyles();

  const handleOrderReset = () => {
    props.setThemesList(props.themes);
  };

  return (
    <Button
      component="a"
      color="default"
      onClick={handleOrderReset}
      className={classes.link}
      startIcon={<ClearIcon />}
      style={{ marginRight: 8 }}
    >
      Réinitialiser l'ordre des thèmes
    </Button>
  );
}

ResetOrderButton.propTypes = {
  themes: PropTypes.array.isRequired,
  setThemesList: PropTypes.func.isRequired,
};

export default ResetOrderButton;
