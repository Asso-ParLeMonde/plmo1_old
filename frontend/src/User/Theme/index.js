import React, {useContext} from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {ThemesServiceContext} from "../../services/ThemesService";
import ThemeCard from "./components/ThemeCard";

import "./theme.css";
import Inverted from "../../components/Inverted";

const useStyles = makeStyles(theme => ({
  card: {
    width: "33%",
    padding: "1rem",
    [theme.breakpoints.down('sm')]: {
      width: "50%",
      padding: "0.5rem",
    },
  },
  container: {
    padding: "0 10%",
    [theme.breakpoints.down('sm')]: {
      padding: "0 0.5rem",
    },
  },
}));

function Theme() {
  const classes = useStyles();
  let themes = [];

  const themesRequest = useContext(ThemesServiceContext);
  if (themesRequest.complete && !themesRequest.error) {
    themes = themesRequest.data;
  }

  return (
    <div>
      <Typography color="primary" variant="h1" style={{fontSize: "2rem", margin: "1.2rem 0 1rem 0"}}>Sur quel <Inverted>thème</Inverted> sera votre vidéo ?</Typography>
      <div className={[classes.container, "theme-cards-container"].join(" ")}>
        {
          themes.map(theme => (
            <div className={classes.card} key={theme.id}>
              <ThemeCard theme={theme} themeID={theme.id}/>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Theme;
