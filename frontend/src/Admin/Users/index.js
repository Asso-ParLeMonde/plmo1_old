import React, { useContext } from "react";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import AddButton from "../components/Buttons/AddButton";
import TableCard from "../components/TableCard";
import { UsersServiceContext } from "../../services/UsersService";

function Users() {
  let users = [];

  // eslint-disable-next-line
  const usersRequest = useContext(UsersServiceContext).getUsers;
  if (usersRequest.complete && !usersRequest.error) {
    users = usersRequest.data;
  }

  return (
    <React.Fragment>
      <TableCard
        type="USER"
        title="Liste des utilisateurs"
        elements={users}
        validIcon={<EditIcon />}
        invalidIcon={<DeleteIcon />}
      >
        <AddButton
          buttonTitle="Ajouter un utilisateur"
          type="USER"
          link="/admin/users/new"
          modalTitle="Creation d'un nouvel utilisateur"
        />
      </TableCard>
    </React.Fragment>
  );
}

export default Users;
