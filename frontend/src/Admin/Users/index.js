import React, { useContext, useState } from "react";

import { Button, CircularProgress } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import AddButton from "../components/Buttons/AddButton";
import TableCard from "../components/TableCard";
import CustomModal from "../../components/CustomModal";
import SharedLink from "../../components/SharedLink";
import { UsersServiceContext } from "../../services/UsersService";
import { UserServiceContext } from "../../services/UserService";

function Users() {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const { getUsers: usersRequest } = useContext(UsersServiceContext);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const users =
    usersRequest.complete && !usersRequest.error ? usersRequest.data : [];

  const openInviteModal = async () => {
    setInviteModalOpen(true);
    setLoading(true);
    const res = await axiosLoggedRequest({
      method: "GET",
      url: "/users/invite",
    });
    if (res.complete && !res.error) {
      setCode(res.data.inviteCode);
      setLoading(false);
    } else {
      setInviteModalOpen(false);
    }
  };

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
        <Button
          style={{ marginBottom: 16 }}
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={openInviteModal}
        >
          Inviter un utilisateur
        </Button>
        <CustomModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          title="Inviter un utilisateur"
          cancelLabel="Retour"
          ariaLabelledBy="invite-title"
          ariaDescribedBy="invite-desc"
        >
          <div id="invite-desc">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="inherit" />
              </div>
            ) : (
              <>
                <div>
                  <label style={{ fontWeight: "bold" }}>
                    Code d'invitation :
                  </label>
                  <SharedLink link={code} />
                </div>
                <div style={{ margin: "0.4rem 0 0.8rem 0" }}>
                  <label style={{ fontWeight: "bold" }}>
                    Lien d'invitation :
                  </label>
                  <SharedLink
                    link={`${window.location.origin}/sign-up?inviteCode=${code}`}
                  />
                </div>
              </>
            )}
          </div>
        </CustomModal>
      </TableCard>
    </React.Fragment>
  );
}

export default Users;
