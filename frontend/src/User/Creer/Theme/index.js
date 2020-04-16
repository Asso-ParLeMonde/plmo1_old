import React, { useContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Trans } from "react-i18next";

import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import { ThemesServiceContext } from "../../../services/ThemesService";
import { ProjectServiceContext } from "../../../services/ProjectService";
import { AppLanguageServiceContext } from "../../../services/AppLanguageService";
import ThemeCard from "./components/ThemeCard";
import Inverted from "../../../components/Inverted";

import "./theme.css";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(600)]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
}));

function Theme(props) {
  const classes = useStyles();
  const { selectedLanguage } = useContext(AppLanguageServiceContext);
  const { updateProject } = useContext(ProjectServiceContext);
  let themes = JSON.parse(localStorage.getItem("localThemes")) || [];

  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    themes.unshift(...themesRequest.data);
  }

  const handleNewTheme = (event) => {
    event.preventDefault();
    props.history.push(`/create/new-theme`);
  };

  const handleSelect = (themeId) => (event) => {
    event.preventDefault();
    updateProject({
      themeId,
      id: null,
      title: "",
      languageCode: selectedLanguage || "fr",
    });
    props.history.push(`/create/1-scenario-choice`);
  };

  return (
    <div>
      <Typography color="primary" variant="h1">
        <Trans i18nKey="create_theme_title">
          Sur quel <Inverted>thème</Inverted> sera votre vidéo ?
        </Trans>
      </Typography>
      <div className={[classes.container, "theme-cards-container"].join(" ")}>
        <div key="new">
          <ThemeCard theme={null} themeId={null} onClick={handleNewTheme} />
        </div>
        {themes.map((theme) => (
          <div key={theme.id}>
            <ThemeCard
              theme={theme}
              themeId={theme.id}
              onClick={handleSelect(theme.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

Theme.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Theme);
