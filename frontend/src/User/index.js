import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import Container from "@material-ui/core/Container";
import Navbar from "../components/Navbar";
import BottomNavBar from "../components/BottomNavBar";
import { ThemesServiceProvider } from "../services/ThemesService";
import { UserServiceContext } from "../services/UserService";

// routes
import Create from "./Creer";
import Inspiration from "./Inspiration";
import Reglages from "./Reglages";
import Videos from "./Videos";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import UpdatePassword from "./UpdatePassword";
import VerifyEmail from "./VerifyEmail";
import NotFound from "./404";

// logos
import { ReactComponent as CreateLogo } from "../images/create.svg";
import { ReactComponent as MoviesLogo } from "../images/movies.svg";
import { ReactComponent as LightLogo } from "../images/light.svg";
import { ReactComponent as SettingsLogo } from "../images/settings.svg";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

const userTabs = [
  {
    label: "create",
    path: "/create",
    icon: <CreateLogo />,
  },
  {
    label: "my_videos",
    path: "/my-videos",
    icon: <MoviesLogo />,
  },
  {
    label: "inspiration",
    path: "/inspiration",
    icon: <LightLogo />,
  },
  {
    label: "settings",
    path: "/settings",
    icon: <SettingsLogo />,
  },
];

const adminTabs = [
  {
    label: "admin",
    path: "/admin",
    icon: <SupervisorAccountIcon />,
  },
];

const defaultTabs = [
  {
    label: "create",
    path: "/create",
    icon: <CreateLogo />,
  },
  {
    label: "settings",
    path: "/settings",
    icon: <SettingsLogo />,
  },
  {
    label: "login",
    path: "/login",
    icon: <AccountCircleIcon />,
  },
];

function User() {
  const { user } = useContext(UserServiceContext);

  const tabs =
    user === null
      ? defaultTabs
      : user.type > 0
      ? [...userTabs, ...adminTabs]
      : userTabs;

  return (
    <React.Fragment>
      <Hidden smDown>
        <Navbar title={"Par Le monde"} tabs={tabs} homeLink="/" />
      </Hidden>
      <main>
        <Container maxWidth="lg">
          <ThemesServiceProvider isPublished={true}>
            <Switch>
              <Route path="/create" component={Create} />
              <Redirect path="/creer" to="/create" />
              <Redirect exact from="/" to="/create" />
              <Route path="/my-videos" component={Videos} />
              <Route path="/inspiration" component={Inspiration} />
              <Route path="/settings" component={Reglages} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/update-password" component={UpdatePassword} />
              <Route path="/verify" component={VerifyEmail} />
              <Route path="*" component={NotFound} />
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
