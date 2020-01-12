import React, {useContext} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {ThemesServiceContext} from "../../services/ThemesService";
import ThemeCard from "./components/ThemeCard";

import "./theme.css";
import Inverted from "../../components/Inverted";

const useStyles = makeStyles(theme => ({
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
      <Typography color="primary" variant="h1">Sur quel <Inverted>thème</Inverted> sera votre vidéo ?</Typography>
      <div className={[classes.container, "theme-cards-container"].join(" ")}>
        {
          themes.map(theme => (
            <div key={theme.id}>
              <ThemeCard theme={theme} themeID={theme.id}/>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Theme;
