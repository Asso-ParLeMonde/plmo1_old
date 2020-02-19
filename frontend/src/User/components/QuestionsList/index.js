import React, {useState} from "react";
import PropTypes from "prop-types";
import { ReactSortable } from "react-sortablejs";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

import QuestionEdit from "../QuestionEdit";

function QuestionsList(props) {
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const handleDelete = index => (event) => {
    event.preventDefault();
    setDeleteIndex(index);
  };

  const deleteQuestion = index => {
    const questions = props.questions;
    questions.splice(index, 1);
    props.setQuestions(questions);
  };

  const handleClose = remove => () => {
    if (remove) {
      deleteQuestion(deleteIndex);
    }
    setDeleteIndex(-1);
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
      <Dialog
        open={deleteIndex !== -1}
        onClose={handleClose(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title">Supprimer la question ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Voulez-vous vraiment supprimer la question :
            <br />
            <br />
            &quot;{(props.questions[deleteIndex] || {}).question}&quot; ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose(false)} color="secondary" variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleClose(true)} color="secondary" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

QuestionsList.propTypes = {
  questions: PropTypes.array.isRequired,
  setQuestions: PropTypes.func.isRequired,
};

export default QuestionsList;
