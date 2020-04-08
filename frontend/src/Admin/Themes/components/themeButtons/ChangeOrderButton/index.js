import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import Button from "@material-ui/core/Button";
import Notifications from "../../../../../components/Notifications";
import { putOrderAdminTheme } from "../../themeRequest";
import { UserServiceContext } from "../../../../../services/UserService";
import { ThemesServiceContext } from "../../../../../services/ThemesService";
import { withRouter } from "react-router";

const useStyles = makeStyles(() => ({
  link: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
}));

function ChangeOrderButton(props) {
  const classes = useStyles();

  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateThemes = useContext(ThemesServiceContext).updateThemes;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: "",
  });

  const handleOrderUpdate = async (event) => {
    event.preventDefault();

    await putOrderAdminTheme(
      axiosLoggedRequest,
      props.themesList,
      setRes,
      "Succès lors de la modification de l'ordre",
      "Erreur lors de la modification de l'ordre",
      props.history,
      updateThemes
    );
  };

  return (
    <React.Fragment>
      <Button
        component="a"
        variant="outlined"
        color="primary"
        onClick={handleOrderUpdate}
        className={classes.link}
        startIcon={<CheckIcon />}
      >
        Valider l'ordre des thèmes
      </Button>
      <Notifications res={res} />
    </React.Fragment>
  );
}

ChangeOrderButton.propTypes = {
  themesList: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(ChangeOrderButton);
