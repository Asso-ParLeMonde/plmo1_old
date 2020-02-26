import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import DefaultButton from "../../../components/Buttons/DefaultButton";
import { QuestionsServiceContext } from "../../../../services/QuestionsService";
import { handleRequest } from "../../../Themes/components/ThemeTableComponents/ThemeButtonRequests";

function QuestionRemoveButton(props) {
  const updateQuestions = useContext(QuestionsServiceContext).updateQuestions;

  const [res, setRes] = useState({
    complete: false,
    error: false,
    message: ""
  });

  async function handleRemove(event) {
    event.preventDefault();
    await handleRequest(
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
