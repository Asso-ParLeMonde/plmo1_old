import React from "react";
import { Route, Switch } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Scenarios from "./Scenarios";
import Themes from "./Themes";
import Navbar from "../components/Navbar";
import AdminDrawer from "./components/AdminDrawer";
import { ThemesServiceProvider } from "../services/ThemesService";
import { ScenariosServiceProvider } from "../services/ScenariosService";

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 32,
    paddingBottom: 32
  }
}));

const tabs = [
  {
    label: "Thèmes",
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#eee"
      }}
    >
      <Navbar
        title={"Administrateur : Par le monde"}
        tabs={[
          {
            label: "App",
            path: "/"
          }
        ]}
      />
      <div
        style={{
          backgroundColor: "#eee",
          flex: 1,
          display: "flex",
          height: "100%"
        }}
      >
        <AdminDrawer tabs={tabs} />
        <main style={{ flex: 1 }}>
          <ThemesServiceProvider>
            <ScenariosServiceProvider>
              <Container maxWidth="lg" className={classes.container}>
                <Switch>
                  <Route path="/admin/themes" component={Themes} />
                  <Route path="/admin/scenarios" component={Scenarios} />
                </Switch>
              </Container>
            </ScenariosServiceProvider>
          </ThemesServiceProvider>
        </main>
      </div>
    </div>
  );
}

Admin.propTypes = {};

export default Admin;
