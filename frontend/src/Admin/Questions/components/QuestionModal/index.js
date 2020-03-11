import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import ModalContainer from "../../../components/FormComponents/ModalContainer";
import { updateQuestion } from "../questionRequest";
import { QuestionsContext } from "../..";

const DEFAULT_QUESTION = {
  id: null,
  question: null,
  isDefault: true,
  scenarioId: 0,
  languageCode: "fr"
};

function QuestionModal(props) {
  const updateQuestions = useContext(QuestionsContext);
  const [newQuestion, setNewQuestion] = useState(
    props.question || DEFAULT_QUESTION
  );
  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  useEffect(() => {
    setNewQuestion({
      ...newQuestion,
      scenarioId: props.scenarioId || props.question.scenarioId
    });
    // eslint-disable-next-line
  }, [props.scenarioId, props.question]);

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
      case "LANGUAGECODE":
        setNewQuestion({
          ...newQuestion,
          languageCode: event.code
        });
        break;
    }
  }

  async function handleConfirmation(event) {
    event.preventDefault();

    let error = false;
    if (props.question) {
      error = await updateQuestion("PUT", props.question, newQuestion, setRes);
    } else {
      error = await updateQuestion("POST", props.question, newQuestion, setRes);
    }

    if (error === false) {
      setRes({
        error: false,
        complete: true,
        message: "Succès lors de la création de la question"
      });
    }

    updateQuestions().catch();
    handleCloseModal();
  }

  function handleCloseModal() {
    props.setIsOpen(false);
    setNewQuestion(
      props.question || { ...DEFAULT_QUESTION, scenarioId: props.scenarioId }
    );
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
  question: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  scenarioId: PropTypes.number
};

export default QuestionModal;
