import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import VideoThumbnail from "../../../../components/VideoThumbnail";
import ScenarioCard from "../components/ScenarioCard";
import { useTranslation, Trans } from "react-i18next";

import "./scenarios.css";

function Scenarios(props) {
  const { t } = useTranslation();

  return (
    <div>
      <div>
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
          <Typography color="primary" variant="h1">
            <Inverted round>1</Inverted>{" "}
            <Trans i18nKey="part1_title">
              Quel <Inverted>scénario</Inverted> choisir ?
            </Trans>
          </Typography>
          <Typography color="inherit" variant="h2">
            {t("part1_subtitle1")}
          </Typography>
          <div className="video-container">
            <VideoThumbnail
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              duration={102334}
              thumbnailLink="/thumbnail_default.png"
            />
          </div>

          <Typography color="inherit" variant="h2">
            {t("part1_subtitle2")}
          </Typography>
          <div className="scenarios-container">
            <ScenarioCard
              stepNumber={0}
              title={t("new_scenario_card_title")}
              history={props.history}
              path={`/create/1-scenario-choice/new?themeId=${props.themeId}`}
              shortPath={`/create/1-scenario-choice/new`}
              scenarioId={0}
              description={t("new_scenario_card_desc")}
              isNew
            />
            {props.scenarios.map((scenario, index) => (
              <ScenarioCard
                key={index}
                title={scenario.name}
                scenarioId={scenario.id}
                path={`/create/2-questions-choice?themeId=${props.themeId}&scenarioId=${scenario.id}`}
                shortPath={`/create/2-questions-choice`}
                history={props.history}
                description={scenario.description}
                stepNumber={parseInt(scenario.questionsCount, 10) || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Scenarios.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  scenarios: PropTypes.array,
};

Scenarios.defaultProps = {
  scenarios: [],
};

export default withRouter(Scenarios);
