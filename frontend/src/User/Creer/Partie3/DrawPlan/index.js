import React, {useState, useEffect, useContext} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import qs from "query-string";

import {Button, Typography} from "@material-ui/core";

import {ProjectServiceContext} from "../../../../services/ProjectService";
import {getQuestions} from "../../../../util/questions";
import Inverted from "../../../../components/Inverted";
import Canvas from "./components/canvas";


function DrawPlan(props) {
  const [planIndex, setPlanIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const { project } = useContext(ProjectServiceContext);
  const questions = getQuestions(project);
  const question = questions[questionIndex] || {};

  useEffect(() => {
    setQuestionIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).question) || 0);
    setPlanIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).plan) || 0);
  }, [props.location.search]);

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push("/creer/3-storyboard-et-plan-de-tournage");
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

        <Canvas/>

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
            href="/creer/3-storyboard-et-plan-de-tournage"
            onClick={handleBack}
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
};

export default withRouter(DrawPlan);
