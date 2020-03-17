import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import Container from "@material-ui/core/Container";
import Navbar from "../components/Navbar";
import BottomNavBar from "../components/BottomNavBar";
import { ThemesServiceProvider } from "../services/ThemesService";

// routes
import Creer from "./Creer";
import Inspiration from "./Inspiration";
import Reglages from "./Reglages";
import Videos from "./Videos";

// logos
import { ReactComponent as CreateLogo } from "../images/create.svg";
import { ReactComponent as MoviesLogo } from "../images/movies.svg";
import { ReactComponent as LightLogo } from "../images/light.svg";
import { ReactComponent as SettingsLogo } from "../images/settings.svg";

const tabs = [
  {
    label: "Créer",
    path: "/creer",
    icon: <CreateLogo />
  },
  {
    label: "Mes vidéos",
    path: "/mes-videos",
    icon: <MoviesLogo />
  },
  {
    label: "Inspiration",
    path: "/inspiration",
    icon: <LightLogo />
  },
  {
    label: "Réglages",
    path: "/settings",
    icon: <SettingsLogo />
  }
];

function User() {
  return (
    <React.Fragment>
      <Hidden smDown>
        <Navbar title={"Par Le monde"} tabs={tabs} homeLink="/" />
      </Hidden>
      <main>
        <Container maxWidth="lg">
          <ThemesServiceProvider isPublished={true}>
            <Switch>
              <Route path="/creer" component={Creer} />
              <Redirect exact from="/" to="/creer" />
              <Route path="/mes-videos" component={Videos} />
              <Route path="/inspiration" component={Inspiration} />
              <Route path="/settings" component={Reglages} />
              <Route path="*">404 not found!</Route>
            </Switch>
          </ThemesServiceProvider>
        </Container>
      </main>
      <Hidden mdUp>
        <BottomNavBar tabs={tabs} />
      </Hidden>
    </React.Fragment>
  );
}

export default User;
