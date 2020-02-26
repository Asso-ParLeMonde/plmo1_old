import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { QuestionsServiceContext } from "../../../../services/QuestionsService";
import { updateQuestion } from "../questionRequest";


const DEFAULT_QUESTION = {
  id: null,
  question: null,
  isDefault: true
};

function QuestionModal(props) {
  const [newQuestion, setNewQuestion] = useState(
    props.Question || DEFAULT_QUESTION
  );
  const updateQuestions = useContext(QuestionsServiceContext).updateQuestions;

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
        break;
      case "QUESTION":
        setNewQuestion({ ...newQuestion, description: event.target.value });
        break;
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    let error = false;
    if (props.Question) {
      error = await updateQuestion("PUT", props.Question, newQuestion, setRes);
    } else {
      error = await updateQuestion("POST", props.Question, newQuestion, setRes);
    }

    if (error === false) {
      setRes({
        error: false,
        complete: true,
        message: "Success lors de la creation de la Question"
      });
    }

    updateQuestions().catch();
    handleCloseModal();
  }

  function handleCloseModal(event) {
    event.preventDefault();

    props.setIsOpen(false);
    setNewQuestion(props.Question || DEFAULT_QUESTION);
    props.history.push("/admin/questions");
  }

  return (
    <ModalContainer
      newElement={newQuestion}
      handleChange={handleChange}
      isOpen={props.isOpen}
      modalTitle={props.modalTitle}
      formDescription={"QUESTION"}
      handleCloseModal={handleCloseModal}
      handleConfirmation={handleConfirmation}
      res={res}
    />
  );
}

QuestionModal.propTypes = {
  theme: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default QuestionModal;
