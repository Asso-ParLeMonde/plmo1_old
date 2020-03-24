import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import DefaultButton from "../../../components/Buttons/DefaultButton";
import { handleQuestionButtonRequest } from "./QuestionButtonRequests";

import { QuestionsContext } from "../../index";

function QuestionAcceptButton(props) {
  const updateQuestions = useContext(QuestionsContext);

  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: ""
  });

  async function handleAcceptation(event) {
    event.preventDefault();
    await handleQuestionButtonRequest(
      "PUT",
      props.question,
      setRes,
      "Succès lors de la modification de la question",
      "Erreur lors de la modification de la question",
      props.history,
      updateQuestions
    );
  }

  return (
    <DefaultButton
      href={`/admin/questions/${props.question.id}`}
      handleAction={handleAcceptation}
      icon={props.icon}
      res={res}
    />
  );
}

QuestionAcceptButton.propTypes = {
  icon: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(QuestionAcceptButton);
