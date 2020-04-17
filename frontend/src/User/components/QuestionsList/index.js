import React, { useState } from "react";
import PropTypes from "prop-types";
import { ReactSortable } from "react-sortablejs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import QuestionEdit from "../QuestionEdit";

function QuestionsList(props) {
  const { t } = useTranslation();
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const handleDelete = (index) => (event) => {
    event.preventDefault();
    setDeleteIndex(index);
  };

  const handleClose = (remove) => async () => {
    if (remove) {
      await props.deleteQuestion(deleteIndex);
    }
    setDeleteIndex(-1);
  };

  const handleEdit = (index) => (event) => {
    event.preventDefault();
    props.history.push(`/create/2-questions-choice/edit?question=${index}`);
  };

  return (
    <div className="questions">
      <ReactSortable
        tag="div"
        list={props.questions}
        setList={props.setQuestions}
        animation={200}
        handle=".question-index"
      >
        {props.questions.map((q, index) => (
          <QuestionEdit
            key={q.id}
            index={index}
            question={q.question}
            handleDelete={handleDelete(index)}
            handleEdit={handleEdit(index)}
          />
        ))}
      </ReactSortable>
      <Dialog
        open={deleteIndex !== -1}
        onClose={handleClose(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title">
          {t("part2_delete_question_title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t("part2_delete_question_desc")}
            <br />
            <br />
            &quot;{(props.questions[deleteIndex] || {}).question}&quot; ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose(false)}
            color="secondary"
            variant="outlined"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleClose(true)}
            color="secondary"
            variant="contained"
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

QuestionsList.propTypes = {
  questions: PropTypes.array.isRequired,
  setQuestions: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func,
  history: PropTypes.object.isRequired,
};

QuestionsList.defaultProps = {
  deleteQuestion: () => {},
};

export default QuestionsList;
