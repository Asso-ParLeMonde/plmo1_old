import React from "react";
import { Route, Switch } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Theme from "./Theme";
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
  }
];

function Admin() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Navbar title={"Administrateur : Par le monde"} tabs={tabs} />
      <main>
        <ThemesServiceProvider>
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route path="/admin/themes" component={Theme} />
            </Switch>
          </Container>
        </ThemesServiceProvider>
      </main>
    </React.Fragment>
  );
}

Admin.propTypes = {};

export default Admin;
