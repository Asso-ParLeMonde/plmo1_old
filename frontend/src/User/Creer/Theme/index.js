import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { ThemesServiceContext } from "../../../services/ThemesService";
import ThemeCard from "./components/ThemeCard";
import { Trans } from "react-i18next";

import "./theme.css";
import Inverted from "../../../components/Inverted";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(600)]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
}));

function Theme() {
  const classes = useStyles();
  let themes = [];

  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    themes = themesRequest.data;
  }

  return (
    <div>
      <Typography color="primary" variant="h1">
        <Trans i18nKey="create_theme_title">
          Sur quel <Inverted>thème</Inverted> sera votre vidéo ?
        </Trans>
      </Typography>
      <div className={[classes.container, "theme-cards-container"].join(" ")}>
        {themes.map((theme) => (
          <div key={theme.id}>
            <ThemeCard theme={theme} themeId={theme.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Theme;
