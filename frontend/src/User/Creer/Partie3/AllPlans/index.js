import React, {useContext} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {Button, Hidden, Typography} from "@material-ui/core";

import {ProjectServiceContext} from "../../../../services/ProjectService";
import Inverted from "../../../../components/Inverted";
import Scene from "./components/scene";


function getQuestions(project) {
  return project.questions.reduce((list, current, index) => {
    let newCurrent;
    if (index > 0) {
      const prev = list[index - 1];
      newCurrent = { ...current, planStartIndex: prev.planStartIndex + ((prev.plans || []).length || 1) };
    } else {
      newCurrent = { ...current, planStartIndex: 1 };
    }
    if (newCurrent.plans === undefined || newCurrent.plans === null || newCurrent.plans.length === 0) {
      newCurrent.plans = [
        {
          url: "test",
        }
      ];
    }
    list.push(newCurrent);
    return list;
  }, []);
}

function AllPlans(props) {
  const { project, updateProject } = useContext(ProjectServiceContext);
  const questions = getQuestions(project);

  const updateQuestion = (index, newQuestion) => {
    const questions = [...project.questions];
    const prevQuestion = project.questions[index];
    questions[index] = { ...prevQuestion, ...newQuestion };
    updateProject({ questions });
  };

  const handleNext = (event) => {
    event.preventDefault();
    props.history.push(`/creer/4-a-votre-caméra`);
  };

  const addPlan = index => () => {
    const plans = questions[index].plans || [];
    plans.push({
      url: "test",
    });
    updateQuestion(index, { plans });
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
          questions.map((q, index) => <Scene
            q={q}
            index={index}
            history={props.history}
            addPlan={addPlan(index)}
            key={index}/>)
        }

        <Hidden smDown>
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button
              component="a"
              href={`/creer/4-a-votre-caméra`}
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
            href={`/creer/4-a-votre-caméra`}
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
};

export default withRouter(AllPlans);
