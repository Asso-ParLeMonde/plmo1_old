import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Languages from "./Languages";
import Questions from "./Questions";
import Scenarios from "./Scenarios";
import Themes from "./Themes";
import Navbar from "../components/Navbar";
import AdminDrawer from "./components/AdminDrawer";
import { ThemesServiceProvider } from "../services/ThemesService";
import { ScenariosServiceProvider } from "../services/ScenariosService";
import { UserServiceContext } from "../services/UserService";
import Users from "./Users";
import { UsersServiceProvider } from "../services/UsersService";
import Statistics from "./Statistics";

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 32,
    paddingBottom: 32,
  },
}));

const tabs = [
  {
    label: "Thèmes",
    path: "/admin/themes",
  },
  {
    label: "Scenarios",
    path: "/admin/scenarios",
  },
  {
    label: "Questions",
    path: "/admin/questions",
  },
  {
    label: "Users",
    path: "/admin/users",
  },
  {
    label: "Statistiques",
    path: "/admin/statistics",
  },
  {
    label: "Langues",
    path: "/admin/languages",
  },
];

function Admin() {
  const { user, isLoggedIn } = useContext(UserServiceContext);
  const classes = useStyles();

  if (!isLoggedIn()) {
    return <Redirect to="/login?redirect=/admin" />;
  }

  if (user.type < 1) {
    return <Redirect to="/" />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#eee",
      }}
    >
      <Navbar
        title={"Administrateur : Par Le monde"}
        tabs={[
          {
            label: "app",
            path: "/",
          },
        ]}
        homeLink="/admin"
      />
      <div
        style={{
          backgroundColor: "#eee",
          flex: 1,
          display: "flex",
          height: "100%",
        }}
      >
        <AdminDrawer tabs={tabs} />
        <main style={{ flex: 1 }}>
          <UsersServiceProvider>
            <ThemesServiceProvider>
              <ScenariosServiceProvider>
                <Container maxWidth="lg" className={classes.container}>
                  <Switch>
                    <Route path="/admin/themes" component={Themes} />
                    <Route path="/admin/scenarios" component={Scenarios} />
                    <Route path="/admin/questions" component={Questions} />
                    <Route path="/admin/languages" component={Languages} />
                    <Route path="/admin/users" component={Users} />
                    <Route path="/admin/statistics" component={Statistics} />
                    <Redirect exact from="/admin" to="admin/themes" />
                  </Switch>
                </Container>
              </ScenariosServiceProvider>
            </ThemesServiceProvider>
          </UsersServiceProvider>
        </main>
      </div>
    </div>
  );
}

export default Admin;
