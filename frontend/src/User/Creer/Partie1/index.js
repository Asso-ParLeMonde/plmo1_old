import React, {useContext, useState, useEffect} from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import qs from "query-string";

import {Breadcrumbs, Hidden, Link, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import {ThemesServiceContext} from "../../../services/ThemesService";
import useAxios from "../../../services/useAxios";
import Steps from "../../components/Steps";
import NewScenario from "./NewScenario";
import AllScenarios from "./AllScenarios";


function Partie1(props) {
  // Get theme
  const themeId = parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).themeId) || 0;
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

  // Get scenarios
  const [scenarios, setScenarios] = useState([]);
  const language = 'fr';
  const getScenarios = useAxios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_APP}/themes/${themeId}/scenarios?languageCode=${language}`,
  });
  useEffect(() => {
    if (getScenarios.complete && !getScenarios.error) {
      setScenarios(getScenarios.data);
    }
  }, [getScenarios]);

  const isNewScenario = props.location.pathname.indexOf("new") !== -1;

  const handleHome = (event) => {
    event.preventDefault();
    props.history.push("/creer");
  };

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(`/creer/1-choix-du-scenario?themeId=${themeId}`);
  };

  return (
    <div>
      {
        theme !== undefined && (
          <React.Fragment>
            <Hidden smDown>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link color="inherit" href="/creer" onClick={handleHome}>
                  Tout les thèmes
                </Link>
                {
                  isNewScenario && (
                    <Link color="inherit" href={`/creer/1-choix-du-scenario?themeId=${themeId}`} onClick={handleBack}>
                      {theme.names.fr}
                    </Link>
                  )
                }
                <Typography color="textPrimary">{isNewScenario ? 'Nouveau scénario' : theme.names.fr}</Typography>
              </Breadcrumbs>
            </Hidden>

            <Steps activeStep={0}/>

            <Switch>
              <Route path="/creer/1-choix-du-scenario/new" render={(props) => <NewScenario {...props} theme={theme} themeId={themeId} />}/>
              <Route path="/creer/1-choix-du-scenario/" render={
                (props) => <AllScenarios
                  {...props}
                  theme={theme}
                  themeId={themeId}
                  scenarios={scenarios}
                />
              }
              />
            </Switch>
          </React.Fragment>
        )
      }
    </div>
  )
}

Partie1.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie1);
