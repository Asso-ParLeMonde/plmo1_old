import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import DefaultButton from "../../../components/Buttons/DefaultButton";
import { UserServiceContext } from "../../../../services/UserService";
import { UsersServiceContext } from "../../../../services/UsersService";
import { handleRequest } from "./UserButtonRequests";

function UserRemoveButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateUsers = useContext(UsersServiceContext).updateUsers;

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
    await handleRequest(
      axiosLoggedRequest,
      props.user,
      setRes,
      "Success lors de la suppression de l'utilisateur",
      "Erreur lors de la suppression de l'utilisateur",
      props.history,
      updateUsers
    );
  }

  return (
    <DefaultButton
      href={`/admin/users/delete`}
      handleAction={handleRemove}
      icon={props.icon}
      res={res}
    />
  );
}

UserRemoveButton.propTypes = {
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(UserRemoveButton);
