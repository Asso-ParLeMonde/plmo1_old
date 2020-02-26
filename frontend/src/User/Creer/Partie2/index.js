import React, { useContext } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { Breadcrumbs, Hidden, Link, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { ProjectServiceContext } from "../../../services/ProjectService";
import Steps from "../../components/Steps";
import NewQuestion from "./NewQuestion";
import AllQuestions from "./AllQuestions";

function Partie2(props) {
  const { project } = useContext(ProjectServiceContext);

  const handleHome = event => {
    event.preventDefault();
    props.history.push("/creer");
  };

  return (
    <div>
      {project.themeId !== null && project.scenarioId !== null && (
        <React.Fragment>
          <Hidden smDown>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link color="inherit" href="/creer" onClick={handleHome}>
                Tout les thèmes
              </Link>
              <Typography color="textPrimary">{project.themeName}</Typography>
            </Breadcrumbs>
          </Hidden>

          <Steps activeStep={1} />

          <Switch>
            <Route
              path="/creer/2-choix-des-questions/new"
              render={props => (
                <NewQuestion
                  {...props}
                  themeId={project.themeId}
                  scenarioId={project.scenarioId}
                />
              )}
            />
            <Route
              path="/creer/2-choix-des-questions"
              render={props => (
                <AllQuestions
                  {...props}
                  themeId={project.themeId}
                  scenarioId={project.scenarioId}
                />
              )}
            />
          </Switch>
        </React.Fragment>
      )}
    </div>
  );
}

Partie2.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie2);
