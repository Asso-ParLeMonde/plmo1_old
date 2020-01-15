import React, {useContext} from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import {Breadcrumbs, Hidden, Link, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import {ThemesServiceContext} from "../../services/ThemesService";
import Steps from "../components/Steps";
import NewScenario from "./New";
import AllScenarios from "./All";


function Scenario(props) {
  // Get theme
  const themeID = parseInt(props.match.params.themeId) || 0;
  let theme;
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    const themeIndex = themesRequest.data.reduce((i1, t, i2) => t.id === themeID ? i2 : i1, -1);
    if (themeIndex === -1) {
      props.history.push("/");
    } else {
      theme = themesRequest.data[themeIndex];
    }
  }

  return (
    <div>
      {
        theme !== undefined && (
          <React.Fragment>
            <Hidden smDown>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link color="inherit" href="/themes" onClick={(event) => {
                  event.preventDefault();
                  props.history.push("/themes");
                }}>
                  Tout les thèmes
                </Link>
                <Typography color="textPrimary">{theme.names.fr}</Typography>
              </Breadcrumbs>
            </Hidden>

            <Steps activeStep={0}/>


            <Switch>
              <Route path="/themes/:themeId/new" render={(props) => <NewScenario {...props} theme={theme} themeID={themeID} />}/>
              <Route path="/themes/:themeId/" render={(props) => <AllScenarios {...props} theme={theme} themeID={themeID} />}/>
            </Switch>
          </React.Fragment>
        )
      }
    </div>
  )
}

Scenario.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Scenario);
