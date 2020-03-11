import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import DefaultButton from "../../../components/Buttons/DefaultButton";
import { handleQuestionButtonRequest } from "./QuestionButtonRequests";
import { QuestionsContext } from "../..";

function QuestionRemoveButton(props) {
  const updateQuestions = useContext(QuestionsContext);

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
    await handleQuestionButtonRequest(
      "DELETE",
      props.question,
      setRes,
      "Success lors de la suppression de la question",
      "Erreur lors de la suppression de la question",
      props.history,
      updateQuestions
    );
  }

  return (
    <DefaultButton
      href={`/admin/scenario/delete`}
      handleAction={handleRemove}
      icon={props.icon}
      res={res}
    />
  );
}

QuestionRemoveButton.propTypes = {
  question: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(QuestionRemoveButton);
