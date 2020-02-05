import React, {useState} from "react";
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";

import {Typography, Button, Hidden} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import QuestionsList from "../../../components/QuestionsList";

function AllQuestions(props) {
  const [questions, setQuestions] = useState([
    {
      question: "Quel est le plat que vous avez décidez de présenter ? De quoi s’agit-il ?",
      order: 0,
    },
    {
      question: "Quels sont les ingrédients principaux ?",
      order: 1,
    },
    {
      question: "Connaissez-vous l’histoire de ce plat ?",
      order: 2,
    },
  ]);

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>2</Inverted> Mes <Inverted>questions</Inverted>
        </Typography>
        <Typography color="inherit" variant="h2">
          Pour structurer votre scénario, nous vous proposons de sélectionner les questions qui feraient sens.
        </Typography>
        <Button
          component="a"
          href={`/creer/2-choix-des-questions/new?themeId=${props.themeId}&scenarioId=${props.scenarioId}`}
          color="secondary"
          onClick={(event) => {
            event.preventDefault();
            props.history.push(`/creer/2-choix-des-questions/new?themeId=${props.themeId}&scenarioId=${props.scenarioId}`);
          }}
          style={{ textTransform: "none", fontWeight: "500", marginTop: "2rem" }}>
          Ajouter une question
        </Button>
        <QuestionsList questions={questions} setQuestions={setQuestions}/>
        <Hidden smDown>
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button color="secondary" variant="contained" style={{ width: "200px" }}>
              Suivant
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button color="secondary" variant="contained" style={{ width: "100%", marginTop: "2rem" }}>
            Suivant
          </Button>
        </Hidden>
      </div>
    </div>
  )
}

AllQuestions.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  scenarioId: PropTypes.number.isRequired,
  scenario: PropTypes.object.isRequired,
};

export default withRouter(AllQuestions);
