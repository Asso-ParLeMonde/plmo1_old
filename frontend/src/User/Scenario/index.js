import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';

import {Typography, Breadcrumbs, Link, Hidden} from "@material-ui/core";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {ThemesServiceContext} from "../../services/ThemesService";

import Inverted from "../../components/Inverted";
import VideoThumbnail from "../../components/VideoThumbnail";
import useAxios from "../../services/useAxios";
import Steps from "../components/Steps";
import ScenarioCard from "./components/ScenarioCard";

import "./scenario.css";

function Scenario(props) {
  // Get theme
  const themeID = parseInt(props.match.params.themeId) || 0;
  let theme;
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    const themeIndex = themesRequest.data.reduce((i1, t, i2) => t.id === themeID ? i2 : i1, -1);
    if (themeIndex === -1) {
      props.history.push("/");
    } else {
      theme = themesRequest.data[themeIndex];
    }
  }

  // Get scenarios
  const [scenarios, setScenarios] = useState([]);
  const language = 'fr';
  const getScenarios = useAxios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_APP}/themes/${themeID}/scenarios?languageCode=${language}`,
  });
  useEffect(() => {
    if (getScenarios.complete && !getScenarios.error) {
      setScenarios(getScenarios.data);
    }
  }, [getScenarios]);

  return (
    <div>
      {theme !== undefined && (
        <div>
          <Hidden smDown>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link color="inherit" href="/themes" onClick={(event) => {
                event.preventDefault();
                props.history.push("/themes");
              }}>
                Tout les thèmes
              </Link>
              <Typography color="textPrimary">{theme.names.fr}</Typography>
            </Breadcrumbs>
          </Hidden>

          <Steps activeStep={0}/>

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
            {scenarios.map((scenario, index) => (
              <ScenarioCard
                key={index}
                stepNumber={0}
                title={scenario.name}
                description={scenario.description}/>
            ))}
            <ScenarioCard
              stepNumber={0}
              title="Nouveau scénario"
              description="Cliquez ici pour créer votre propre scénario !"/>
          </div>
        </div>
      )}
    </div>
  );
}

Scenario.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Scenario);
