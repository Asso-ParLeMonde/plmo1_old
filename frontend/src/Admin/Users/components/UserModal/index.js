import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import { UsersServiceContext } from "../../../../services/UsersService";
import { putAdminUser, postAdminUser } from "../userRequest";
import CreateAccountForm, {
  DEFAULT_USER,
} from "../../../../components/CreateAccountForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  DialogActions,
  Button,
} from "@material-ui/core";
import Notifications from "../../../../components/Notifications";
import { UserServiceContext } from "../../../../services/UserService";

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 24px",
  },
}));

function UserModal(props) {
  const classes = useStyles();
  const [newUser, setNewUser] = useState(props.user || DEFAULT_USER);
  const updateUsers = useContext(UsersServiceContext).updateUsers;
  const { axiosLoggedRequest } = useContext(UserServiceContext);

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: "",
  });

  async function handleConfirmation() {
    if (props.user) {
      await putAdminUser(
        axiosLoggedRequest,
        newUser,
        setRes,
        "Succès lors dans la modification de l'utilisateur",
        "Erreur lors de la modification de la utilisateur",
        props.history,
        updateUsers
      );
    } else {
      await postAdminUser(
        axiosLoggedRequest,
        newUser,
        setRes,
        "Succès lors dans la creation de l'utilisateur",
        "Erreur lors de la creation de la utilisateur",
        props.history,
        updateUsers
      );
    }

    handleCloseModal();
  }

  function handleCloseModal() {
    props.setIsOpen(false);
    setNewUser(props.user || DEFAULT_USER);
    props.history.push("/admin/users");
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.modalTitle}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <CreateAccountForm
            user={newUser}
            currentUserPseudo={newUser.pseudo}
            setUser={setNewUser}
            submit={handleConfirmation}
            admin={true}
            buttonLabel={"Confirmer le nouvel utilisateur"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
      <Notifications res={res} />
    </React.Fragment>
  );
}

UserModal.propTypes = {
  user: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default UserModal;
