import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import QuestionModal from "../QuestionModal";

function QuestionModifyButton(props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(event) {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(`/admin/questions/${props.question.id}`);
  }

  return (
    <React.Fragment>
      <a href={`/question/${props.question.id}`} onClick={handleOpenModal}>
        <Button className="shape">{props.icon}</Button>
      </a>
      <QuestionModal
        question={props.question}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={"Modification de la question"}
        history={props.history}
      />
    </React.Fragment>
  );
}

QuestionModifyButton.propTypes = {
  icon: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(QuestionModifyButton);
