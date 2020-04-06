import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { UserServiceContext } from "../../../../services/UserService";
import { UsersServiceContext } from "../../../../services/UsersService";
import DefaultDeleteButton from "../../../components/DefaultDeleteButton";
import { deleteAdminUser } from "../userRequest";

function UserRemoveButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateUsers = useContext(UsersServiceContext).updateUsers;

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: "",
  });

  async function handleRemove(event) {
    event.preventDefault();
    await deleteAdminUser(
      axiosLoggedRequest,
      props.user,
      setRes,
      "Succès lors de la suppression de l'utilisateur",
      "Erreur lors de la suppression de l'utilisateur",
      props.history,
      updateUsers
    );
  }

  return (
    <DefaultDeleteButton
      name={`${props.user.managerFirstName} ${props.user.managerLastName}`}
      handleRemove={handleRemove}
      goTo={"/admin/users/delete"}
      returnTo={"/admin/users"}
      res={res}
      icon={props.icon}
    />
  );
}

UserRemoveButton.propTypes = {
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(UserRemoveButton);
