import React, { useContext, useState, useEffect } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

import { Breadcrumbs, Hidden, Link, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { ProjectServiceContext } from "../../../services/ProjectService";
import useAxios from "../../../services/useAxios";
import Steps from "../../components/Steps";
import NewScenario from "./NewScenario";
import AllScenarios from "./AllScenarios";

function Partie1(props) {
  const { project } = useContext(ProjectServiceContext);

  // Get scenarios
  const [scenarios, setScenarios] = useState([]);
  const getScenarios = useAxios({
    method: "GET",
    url:
      project.themeId === null
        ? null
        : `${process.env.REACT_APP_BASE_APP}/themes/${project.themeId}/scenarios?languageCode=${project.languageCode}`
  });
  useEffect(() => {
    if (getScenarios.complete && !getScenarios.error) {
      setScenarios(getScenarios.data);
    }
  }, [getScenarios]);

  const isNewScenario = props.location.pathname.indexOf("new") !== -1;

  const handleHome = event => {
    event.preventDefault();
    props.history.push("/creer");
  };

  const handleBack = event => {
    event.preventDefault();
    props.history.push(`/creer/1-choix-du-scenario?themeId=${project.themeId}`);
  };

  return (
    <div>
      {project.themeId !== null && (
        <React.Fragment>
          <Hidden smDown>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link color="inherit" href="/creer" onClick={handleHome}>
                Tout les thèmes
              </Link>
              {isNewScenario && (
                <Link
                  color="inherit"
                  href={`/creer/1-choix-du-scenario?themeId=${project.themeId}`}
                  onClick={handleBack}
                >
                  {project.themeName}
                </Link>
              )}
              <Typography color="textPrimary">
                {isNewScenario ? "Nouveau scénario" : project.themeName}
              </Typography>
            </Breadcrumbs>
          </Hidden>

          <Steps activeStep={0} />

          <Switch>
            <Route
              path="/creer/1-choix-du-scenario/new"
              render={props => (
                <NewScenario {...props} themeId={project.themeId} />
              )}
            />
            <Route
              path="/creer/1-choix-du-scenario/"
              render={props => (
                <AllScenarios
                  {...props}
                  themeId={project.themeId}
                  scenarios={scenarios}
                />
              )}
            />
          </Switch>
        </React.Fragment>
      )}
    </div>
  );
}

Partie1.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie1);
