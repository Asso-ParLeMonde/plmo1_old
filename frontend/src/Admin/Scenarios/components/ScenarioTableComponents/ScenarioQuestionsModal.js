import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Notifications from "../../../../components/Notifications";
import { UserServiceContext } from "../../../../services/UserService";

const useStyles = makeStyles(() => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 24px 24px"
  }
}));

function ScenarioQuestionModal(props) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [res, setRes] = useState({
    error: false,
    complete: false,
    message: undefined
  });

  useEffect(() => {
    const getScenarioQuestions = async () => {
      const questionsRequest = await axiosLoggedRequest({
        method: "GET",
        url: `/scenarios/${props.scenario.id}/questions`
      });

      if (
        questionsRequest.error === true &&
        questionsRequest.complete === true
      ) {
        setRes({
          error: true,
          complete: true,
          message: "Erreur lors de la creation du scenario"
        });
      }

      if (
        questionsRequest.error === false &&
        questionsRequest.complete === true
      ) {
        setQuestions(questionsRequest.data);
      }
    };

    if (isOpen) {
      getScenarioQuestions();
    }
    // eslint-disable-next-line
  }, [props.scenario.id, isOpen]);

  const handleOpenModal = event => {
    event.preventDefault();

    setIsOpen(true);
    props.history.push(`/admin/scenarios/${props.scenario.id}/questions`);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setQuestions([]);
    props.history.push("/admin/scenarios");
  };

  const getName = () => {
    if (props.scenario.names.fr) {
      return props.scenario.names.fr;
    }

    const scenarioLanguages = Object.keys(props.scenario.names);

    for (let i = 0; i < scenarioLanguages.length; i++) {
      const name = props.scenario.names[scenarioLanguages[i]];
      if (name) {
        return `${scenarioLanguages[i]}: ${name}`;
      }
    }
  };

  const showQuestions = () => {
    if (questions.length === 0) {
      return <span>Aucune question n'existe pour ce scenario</span>;
    }

    return (
      <ul>
        {questions.map((q, index) => (
          <li key={index}>{`${q.languageCode.toUpperCase()} : ${
            q.question
          }`}</li>
        ))}
      </ul>
    );
  };

  return (
    <React.Fragment>
      <a
        href={`/admin/scenarios/${props.scenario.id}/questions`}
        style={{ textDecoration: "none" }}
        onClick={handleOpenModal}
      >
        <Button className="shape">
          <span style={{ width: "24px" }}>...</span>
        </Button>
      </a>

      <Dialog
        open={isOpen}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Questions de {getName()}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {showQuestions()}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <Notifications res={res} />
    </React.Fragment>
  );
}

ScenarioQuestionModal.propTypes = {
  scenario: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(ScenarioQuestionModal);
