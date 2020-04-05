import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Hidden,
  Typography
} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import { addPlan, deletePlan } from "../../components/planRequest";
import Scene from "./components/scene";
import { UserServiceContext } from "../../../../services/UserService";

function AllPlans(props) {
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const [deleteIndexes, setDeleteIndexes] = useState({
    questionIndex: -1,
    planIndex: -1,
    showNumber: 0
  });
  const showDeleteModal =
    deleteIndexes.questionIndex !== -1 && deleteIndexes.planIndex !== -1;

  const handleNext = event => {
    event.preventDefault();
    props.history.push(`/create/4-to-your-camera`);
  };

  const handleAddPlan = questionIndex => async event => {
    event.preventDefault();
    await addPlan(
      axiosLoggedRequest,
      isLoggedIn,
      props.project,
      props.updateProject,
      questionIndex
    );
  };

  const handleRemovePlan = questionIndex => planIndex => event => {
    event.preventDefault();
    event.stopPropagation();
    setDeleteIndexes({
      questionIndex,
      planIndex,
      showNumber: props.questions[questionIndex].planStartIndex + planIndex
    });
  };

  const handleCloseModal = confirm => async () => {
    const { questionIndex, planIndex, showNumber } = deleteIndexes;
    setDeleteIndexes({
      questionIndex: -1,
      planIndex: -1,
      showNumber
    });
    if (!confirm) {
      return;
    }
    await deletePlan(
      axiosLoggedRequest,
      isLoggedIn,
      props.project,
      props.updateProject,
      questionIndex,
      planIndex
    );
  };

  return (
    <div>
      <div
        style={{ maxWidth: "1000px", margin: "auto", paddingBottom: "2rem" }}
      >
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Création du{" "}
          <Inverted>Storyboard</Inverted> et du{" "}
          <Inverted>plan de tournage</Inverted>
        </Typography>
        <Typography color="inherit" variant="h2">
          Blabla bla...
        </Typography>

        {props.questions.map((q, index) => (
          <Scene
            q={q}
            index={index}
            history={props.history}
            addPlan={handleAddPlan(index)}
            removePlan={handleRemovePlan(index)}
            key={index}
          />
        ))}

        <Dialog
          open={showDeleteModal}
          onClose={handleCloseModal(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title">
            Supprimer le plan ?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Voulez-vous vraiment supprimer le plan n°{" "}
              {deleteIndexes.showNumber} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal(false)}
              color="secondary"
              variant="outlined"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCloseModal(true)}
              color="secondary"
              variant="contained"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        <Hidden smDown>
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button
              component="a"
              href={`/create/4-to-your-camera`}
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
            href={`/create/4-to-your-camera`}
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
  project: PropTypes.object.isRequired,
  updateProject: PropTypes.func.isRequired
};

export default withRouter(AllPlans);
