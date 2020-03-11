import React, { useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Languages from "./Languages";
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
  },
  {
    label: "Langues",
    path: "/admin/languages"
  }
];

function Admin(props) {
  const classes = useStyles();

  useEffect(() => {
    if (props.location.pathname === "/admin") {
      return props.history.push("admin/themes");
    }
  }, [props.history, props.location]);

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
        homeLink="/admin"
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
                  <Route path="/admin/languages" component={Languages} />
                </Switch>
              </Container>
            </ScenariosServiceProvider>
          </ThemesServiceProvider>
        </main>
      </div>
    </div>
  );
}

export default withRouter(Admin);
