import React, {useState, useContext, useEffect} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import useAxios from "../../../services/useAxios";
import PropTypes from "prop-types";
import qs from "query-string";

import {Breadcrumbs, Hidden, Link, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import {ThemesServiceContext} from "../../../services/ThemesService";
import Steps from "../../components/Steps";
import NewQuestion from "./NewQuestion";
import AllQuestions from "./AllQuestions";

function Partie2(props) {
  // Get theme
  const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const themeId = parseInt(params.themeId) || 0;
  let theme;
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    const themeIndex = themesRequest.data.reduce((i1, t, i2) => t.id === themeId ? i2 : i1, -1);
    if (themeIndex === -1) {
      props.history.push("/");
    } else {
      theme = themesRequest.data[themeIndex];
    }
  }

  // Get scenario
  const scenarioId = parseInt(params.scenarioId) || 0;
  const [ scenario, setScenario ] = useState(null);
  const scenarioRequest = useAxios({
    url: `${process.env.REACT_APP_BASE_APP}/themes/${themeId}/scenarios/${scenarioId}_fr`,
    method: "GET",
  });
  useEffect(() => {
    if (scenarioRequest.complete && !scenarioRequest.error) {
      setScenario(scenarioRequest.data);
    }
    if (scenarioRequest.complete && scenarioRequest.error) {
      props.history.push("/");
    }
    // eslint-disable-next-line
  }, [scenarioRequest]);

  const handleHome = (event) => {
    event.preventDefault();
    props.history.push("/creer");
  };

  return (
    <div>
      {
        theme !== undefined && scenario !== null && (
          <React.Fragment>
            <Hidden smDown>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link color="inherit" href="/creer" onClick={handleHome}>
                  Tout les thèmes
                </Link>
                <Typography color="textPrimary">{theme.names.fr}</Typography>
              </Breadcrumbs>
            </Hidden>

            <Steps activeStep={1}/>

            <Switch>
              <Route path="/creer/2-choix-des-questions/new" render={(props) => <NewQuestion {...props}
                                                                                             theme={theme}
                                                                                             themeId={themeId}
                                                                                             scenario={scenario}
                                                                                             scenarioId={scenarioId}/>}/>
              <Route path="/creer/2-choix-des-questions" render={(props) => <AllQuestions {...props}
                                                                                          theme={theme}
                                                                                          themeId={themeId}
                                                                                          scenario={scenario}
                                                                                          scenarioId={scenarioId}/>}/>
            </Switch>

          </React.Fragment>
        )}
    </div>
  )
}

Partie2.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie2);
