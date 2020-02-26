import React from "react";
import PropTypes from "prop-types";

import ChooseQuestion from "../../../components/FormComponents/ChooseQuestion";

function QuestionForm(props) {
  return (
    <React.Fragment>
      <ChooseQuestion
        question={props.question}
        handleChange={props.handleChange}
      />
    </React.Fragment>
  );
}

QuestionForm.propTypes = {
  question: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default QuestionForm;
