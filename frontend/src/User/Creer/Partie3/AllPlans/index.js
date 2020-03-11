import React, {useState} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {
  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Hidden,
  Typography
} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import Scene from "./components/scene";

function AllPlans(props) {
  const [deleteIndexes, setDeleteIndexes] = useState({
    questionIndex: -1,
    planIndex: -1,
    showNumber: 0,
  });
  const showDeleteModal = deleteIndexes.questionIndex !== -1 && deleteIndexes.planIndex !== -1;

  const handleNext = (event) => {
    event.preventDefault();
    props.history.push(`/creer/4-a-votre-camera`);
  };

  const addPlan = questionIndex => (event) => {
    event.preventDefault();
    const plans = props.questions[questionIndex].plans || [];
    plans.push({
      url: null,
      description: "",
    });
    props.updateQuestion(questionIndex, { plans });
  };

  const removePlan = questionIndex => planIndex => (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDeleteIndexes({
      questionIndex,
      planIndex,
      showNumber: props.questions[questionIndex].planStartIndex + planIndex,
    });
  };

  const handleCloseModal = confirm => () => {
    const { questionIndex, planIndex, showNumber } = deleteIndexes;
    setDeleteIndexes({
      questionIndex: -1,
      planIndex: -1,
      showNumber,
    });
    if(!confirm) {
      return;
    }
    const plans = props.questions[questionIndex].plans || [];
    plans.splice(planIndex, 1);
    props.updateQuestion(questionIndex, { plans });
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto", paddingBottom: "2rem" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Création du <Inverted>Storyboard</Inverted> et du <Inverted>plan de tournage</Inverted>
        </Typography>
        <Typography color="inherit" variant="h2">
          Blabla bla...
        </Typography>

        {
          props.questions.map((q, index) => <Scene
            q={q}
            index={index}
            history={props.history}
            addPlan={addPlan(index)}
            removePlan={removePlan(index)}
            key={index}/>)
        }

        <Dialog
          open={showDeleteModal}
          onClose={handleCloseModal(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title">Supprimer le plan ?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Voulez-vous vraiment supprimer le plan n° {deleteIndexes.showNumber} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal(false)} color="secondary" variant="outlined">
              Annuler
            </Button>
            <Button onClick={handleCloseModal(true)} color="secondary" variant="contained">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        <Hidden smDown>
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button
              component="a"
              href={`/creer/4-a-votre-camera`}
              color="secondary"
              onClick={handleNext}
              variant="contained"
              style={{ width: "200px" }}
            >
              Suivant
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            component="a"
            href={`/creer/4-a-votre-camera`}
            color="secondary"
            onClick={handleNext}
            variant="contained"
            style={{ width: "100%", marginTop: "2rem" }}
          >
            Suivant
          </Button>
        </Hidden>
      </div>
    </div>
  );
}

AllPlans.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  updateQuestion: PropTypes.func.isRequired,
};

export default withRouter(AllPlans);
