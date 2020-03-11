import React, {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import qs from "query-string";

import {Button, Typography, Backdrop, CircularProgress, makeStyles} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import Canvas from "./components/canvas";
import {uploadTemporaryImage} from "../../../../services/PlanService";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function DrawPlan(props) {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planIndex, setPlanIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = props.questions[questionIndex] || {};

  useEffect(() => {
    setQuestionIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).question) || 0);
    setPlanIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).plan) || 0);
  }, [props.location.search]);

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(`/creer/3-storyboard-et-plan-de-tournage/edit?question=${questionIndex}&plan=${planIndex}`);
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const imageBlob = await canvasRef.current.getBlob();
      const data = await uploadTemporaryImage(imageBlob);
      if (data !== null) {
        question.plans[planIndex].url = data.path;
        question.plans[planIndex].uuid = data.uuid;
        question.plans[planIndex].localPath = data.localPath;
        props.updateQuestion(questionIndex, question);
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
    props.history.push(`/creer/3-storyboard-et-plan-de-tournage/edit?question=${questionIndex}&plan=${planIndex}`);
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Dessinez votre plan
        </Typography>
        <Typography variant="h2">
          <span>Question :</span> {question.question}
        </Typography>
        <Typography variant="h2">
          <span>Plan numéro :</span> {question.planStartIndex + planIndex}
        </Typography>

        <Canvas ref={canvasRef}/>

        <Backdrop className={classes.backdrop} open={isLoading} onClick={() => {}}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <div style={{width: "100%", textAlign: "right", margin: "2rem 0"}}>
          <Button
            as="a"
            variant="outlined"
            color="secondary"
            style={{ marginRight: "1rem" }}
            href="/creer/3-storyboard-et-plan-de-tournage"
            onClick={handleBack}
          >
            Annuler
          </Button>
          <Button
            as="a"
            variant="contained"
            color="secondary"
            style={{ marginRight: "1rem" }}
            href={`/creer/3-storyboard-et-plan-de-tournage/edit?question=${questionIndex}&plan=${planIndex}`}
            onClick={handleConfirm}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

DrawPlan.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  updateQuestion: PropTypes.func.isRequired,
};

export default withRouter(DrawPlan);
