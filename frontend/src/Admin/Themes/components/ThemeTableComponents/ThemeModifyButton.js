import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import ThemeModal from "../ThemeModal";

function ThemeModifyButton(props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(event) {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(`/admin/themes/${props.theme.id}`);
  }

  return (
    <React.Fragment>
      <a href={`/admin/themes/${props.theme.id}`} onClick={handleOpenModal}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <ThemeModal
        theme={props.theme}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={"Modification du theme"}
        history={props.history}
      />
    </React.Fragment>
  );
}

ThemeModifyButton.propTypes = {
  icon: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ThemeModifyButton);
