import React, {useContext} from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import Container from "@material-ui/core/Container";
import Navbar from "../components/Navbar";
import BottomNavBar from "../components/BottomNavBar";
import { ThemesServiceProvider } from "../services/ThemesService";
import { UserServiceContext } from "../services/UserService";

import Creer from "./Creer";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";

import { ReactComponent as CreateLogo } from "../images/create.svg";
import { ReactComponent as MoviesLogo } from "../images/movies.svg";
import { ReactComponent as LightLogo } from "../images/light.svg";
import { ReactComponent as SettingsLogo } from "../images/settings.svg";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const userTabs = [
  {
    label: "Créer",
    path: "/creer",
    icon: <CreateLogo />
  },
  {
    label: "Mes vidéos",
    path: "/my-movies",
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

const defaultTabs = [
  {
    label: "Créer",
    path: "/creer",
    icon: <CreateLogo />
  },
  {
    label: "Je me connecte !",
    path: "/login",
    icon: <AccountCircleIcon />
  }
];

function User() {
  const { user } = useContext(UserServiceContext);

  return (
    <React.Fragment>
      <Hidden smDown>
        <Navbar title={"Par Le monde"} tabs={user === null ? defaultTabs : userTabs} homeLink="/" />
      </Hidden>
      <main>
        <Container maxWidth="lg">
          <ThemesServiceProvider isPublished={true}>
            <Switch>
              <Route path="/creer" component={Creer} />
              <Redirect exact from="/" to="/creer" />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="*">404 not found!</Route>
            </Switch>
          </ThemesServiceProvider>
        </Container>
      </main>
      <Hidden mdUp>
        <BottomNavBar tabs={user === null ? defaultTabs : userTabs} />
      </Hidden>
    </React.Fragment>
  );
}

export default User;
