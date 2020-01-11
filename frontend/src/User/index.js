import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hidden from '@material-ui/core/Hidden';
import Container from "@material-ui/core/Container";
import Navbar from "../components/Navbar";
import BottomNavBar from "../components/BottomNavBar";
import {ThemesServiceProvider} from "../services/ThemesService";
import Theme from "./Theme";
import Scenario from "./Scenario";

import { ReactComponent as CreateLogo } from '../images/create.svg';
import { ReactComponent as MoviesLogo } from '../images/movies.svg';
import { ReactComponent as LightLogo } from '../images/light.svg';
import { ReactComponent as SettingsLogo } from '../images/settings.svg';

const tabs = [
  {
    label: "Créer",
    path: "/themes",
    icon: <CreateLogo/>,
  },
  {
    label: "Mes vidéos",
    path: "/my-movies",
    icon: <MoviesLogo/>,
  },
  {
    label: "Inspiration",
    path: "/inspiration",
    icon: <LightLogo/>,
  },
  {
    label: "Réglages",
    path: "/settings",
    icon: <SettingsLogo/>,
  }
];

function User() {
  return (
    <React.Fragment>
      <Hidden smDown>
        <Navbar title={"Par le monde"} tabs={tabs} homeLink="/" />
      </Hidden>
      <main>
        <Container maxWidth="lg">
          <ThemesServiceProvider isPublished={true}>
            <Switch>
              <Route exact path="/themes" component={Theme}/>
              <Route path="/themes/:themeId" component={Scenario}/>
              <Redirect exact from="/" to="/themes"/>
              <Route path="*">
                404 not found!
              </Route>
            </Switch>
          </ThemesServiceProvider>
        </Container>
      </main>
      <Hidden mdUp>
        <BottomNavBar tabs={tabs}/>
      </Hidden>
    </React.Fragment>
  );
}

export default User;
