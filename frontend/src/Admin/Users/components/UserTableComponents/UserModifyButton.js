import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import UserModal from "../UserModal";

function UserModifyButton(props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(event) {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(`/admin/users/${props.user.id}`);
  }

  return (
    <React.Fragment>
      <a href={`/admin/users/${props.user.id}`} onClick={handleOpenModal}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <UserModal
        user={props.user}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={"Modification du user"}
        history={props.history}
      />
    </React.Fragment>
  );
}

UserModifyButton.propTypes = {
  icon: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(UserModifyButton);
