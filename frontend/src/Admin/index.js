import React from "react";
import { Route, Switch } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Scenarios from "./Scenarios";
import Themes from "./Themes";
import Navbar from "../components/Navbar";
import { ThemesServiceProvider } from "../services/ThemesService";

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 32,
    paddingBottom: 32
  }
}));

const tabs = [
  {
    label: "Themes",
    path: "/admin/themes"
  },
  {
    label: "Scenarios",
    path: "/admin/scenarios"
  }
];

function Admin() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Navbar title={"Administrateur : Par le monde"} tabs={tabs} homeLink="/admin" />
      <main>
        <ThemesServiceProvider>
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route path="/admin/themes" component={Themes} />
              <Route path="/admin/scenarios" component={Scenarios} />
            </Switch>
          </Container>
        </ThemesServiceProvider>
      </main>
    </React.Fragment>
  );
}

Admin.propTypes = {};

export default Admin;
