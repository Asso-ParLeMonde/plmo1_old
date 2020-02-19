import React from "react";
import PropTypes from "prop-types";
import { ReactSortable } from "react-sortablejs";

import QuestionEdit from "../QuestionEdit";

function QuestionsList(props) {
  const handleDelete = index => (event) => {
    event.preventDefault();
    const questions = props.questions;
    questions.splice(index, 1);
    props.setQuestions(questions);
  };

  return (
    <div className="questions">
      <ReactSortable tag="div"  list={props.questions} setList={props.setQuestions} animation={200} handle=".question-index">
        {props.questions.map((q, index) => (
          <QuestionEdit key={q.id}
                        index={index}
                        question={q.question}
                        handleDelete={handleDelete(index)}
          />
        ))}
      </ReactSortable>
    </div>
  )
}

QuestionsList.propTypes = {
  questions: PropTypes.array.isRequired,
  setQuestions: PropTypes.func.isRequired,
};

export default QuestionsList;
