import React, { useEffect } from "react";
import { withRouter } from "react-router";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";

import ElevationScroll from "./ElevationScroll";
import LinkTab from "./LinkTab";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import { ReactComponent as Logo } from "../images/pelico.svg";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StyledTabs = withStyles((theme) => ({
  indicator: {
    backgroundColor: theme.palette.primary.main,
  },
}))(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    minHeight: "36px",
    margin: "6px 12px",
    padding: "0 0.5rem",
    fontFamily: "'Alegreya Sans', sans-serif",
    textTransform: "none",
    fontWeight: "900",
    fontSize: "1.2rem",
    fill: "#fff",
    opacity: 1,
  },
  selected: {
    backgroundColor: "#fff",
    color: theme.palette.primary.main,
    fill: theme.palette.primary.main,
  },
}))(LinkTab);

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function Navbar(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const index = props.tabs.reduce(
      (i1, tab, i2) =>
        tab.path.split("/")[1] === props.location.pathname.split("/")[1]
          ? i2
          : i1,
      -1
    );
    setValue(index + 1);
    // eslint-disable-next-line
  }, [props.location.pathname]);

  const handleHomeClick = (event) => {
    event.preventDefault();
    props.history.push(props.homeLink);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar position="fixed" className={classes.appBar}>
          <Container maxWidth="lg">
            <Toolbar variant="dense" style={{ padding: 0 }}>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <a
                    href={props.homeLink}
                    style={{ color: "white" }}
                    onClick={handleHomeClick}
                  >
                    <Logo style={{ height: "36px", width: "auto" }} />
                    <Typography variant="h6" className="plm-logo-title">
                      {props.title}
                    </Typography>
                  </a>
                </Grid>
                <Grid item>
                  <StyledTabs value={value} aria-label="simple tabs example">
                    <StyledTab
                      content=""
                      path="/"
                      {...a11yProps(0)}
                      style={{ display: "none" }}
                    />
                    {props.tabs.map((tab, index) => (
                      <StyledTab
                        content={t(tab.label)}
                        href={tab.path}
                        {...a11yProps(index)}
                        path={tab.path}
                        tabIcon={tab.icon}
                        key={index}
                      />
                    ))}
                  </StyledTabs>
                </Grid>
              </Grid>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar variant="dense" />
    </React.Fragment>
  );
}

Navbar.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
  homeLink: PropTypes.string.isRequired,
};

export default withRouter(Navbar);
