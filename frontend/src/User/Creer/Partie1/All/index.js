import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import {Typography} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import VideoThumbnail from "../../../../components/VideoThumbnail";
import useAxios from "../../../../services/useAxios";
import ScenarioCard from "../components/ScenarioCard";

import "./scenarios.css";

function Scenarios(props) {
  // Get scenarios
  const [scenarios, setScenarios] = useState([]);
  const language = 'fr';
  const getScenarios = useAxios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_APP}/themes/${props.themeId}/scenarios?languageCode=${language}`,
  });
  useEffect(() => {
    if (getScenarios.complete && !getScenarios.error) {
      setScenarios(getScenarios.data);
    }
  }, [getScenarios]);

  return (
    <div>
      <div>
        <Typography color="primary" variant="h1">
          <Inverted round>1</Inverted> Quel <Inverted>scénario</Inverted> choisir ?
        </Typography>
        <Typography color="inherit" variant="h2">
          Voici quelques vidéos qui peuvent vous inspirer
        </Typography>
        <div className="video-container">
          <VideoThumbnail
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            duration={102334}
            thumbnailLink="/thumbnail_default.png"/>
        </div>

        <Typography color="inherit" variant="h2">
          C'est à votre tour, sélectionnez un scénario à filmer
        </Typography>
        <div className="scenarios-container">
          <ScenarioCard
            stepNumber={0}
            title="Nouveau scénario"
            history={props.history}
            path={`/creer/1-choix-du-scenario/new?themeId=${props.themeId}`}
            description="Cliquez ici pour créer votre propre scénario !"/>
          {scenarios.map((scenario, index) => (
            <ScenarioCard
              key={index}
              stepNumber={0}
              title={scenario.name}
              path={`/creer/2-choix-des-questions?themeId=${props.themeId}&scenarioId=${scenario.id}`}
              history={props.history}
              description={scenario.description}/>
          ))}
        </div>
      </div>
    </div>
  );
}

Scenarios.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withRouter(Scenarios);
