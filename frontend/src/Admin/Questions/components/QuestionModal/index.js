import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { QuestionsServiceContext } from "../../../../services/QuestionsService";
import { updateQuestion } from "../questionRequest";

const DEFAULT_QUESTION = {
  id: null,
  question: null,
  isDefault: true,
  scenarioId: 0,
  languageCode: "fr"
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

  useEffect(() => {
    setNewQuestion({
      ...newQuestion,
      scenarioId: props.scenarioId
    });
  }, [props.scenarioId]);

  function handleChange(enumCase, event) {
    switch (enumCase) {
      default:
        break;
      case "QUESTION":
        setNewQuestion({
          ...newQuestion,
          question: event.target.value.slice(0, 280)
        });
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
        message: "Succès lors de la création de la Question"
      });
    }

    updateQuestions().catch();
    handleCloseModal();
  }

  function handleCloseModal(event) {
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
  history: PropTypes.object.isRequired,
  scenarioId: PropTypes.number.isRequired
};

export default QuestionModal;
