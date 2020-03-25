import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { handleQuestionButtonRequest } from "./QuestionButtonRequests";
import { QuestionsContext } from "../..";
import { UserServiceContext } from "../../../../services/UserService";
import DefaultDeleteButton from "../../../components/DefaultDeleteButton";

function QuestionRemoveButton(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const updateQuestions = useContext(QuestionsContext);

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
    await handleQuestionButtonRequest(
      axiosLoggedRequest,
      "DELETE",
      props.question,
      setRes,
      "Succès lors de la suppression de la question",
      "Erreur lors de la suppression de la question",
      props.history,
      updateQuestions
    );
  }

  return (
    <DefaultDeleteButton
      name={props.question.question}
      handleRemove={handleRemove}
      goTo={"/admin/questions/delete"}
      returnTo={"/admin/questions"}
      res={res}
      icon={props.icon}
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
