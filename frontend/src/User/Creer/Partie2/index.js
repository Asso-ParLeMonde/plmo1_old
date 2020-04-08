import React, { useContext } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { Breadcrumbs, Hidden, Link, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useTranslation } from "react-i18next";

import { ProjectServiceContext } from "../../../services/ProjectService";
import Steps from "../../components/Steps";
import NewQuestion from "./NewQuestion";
import AllQuestions from "./AllQuestions";
import EditQuestion from "./EditQuestion";

function Partie2(props) {
  const { t } = useTranslation();
  const { project } = useContext(ProjectServiceContext);

  const handleHome = (event) => {
    event.preventDefault();
    props.history.push("/create");
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
              <Link color="inherit" href="/create" onClick={handleHome}>
                {t("all_themes")}
              </Link>
              <Typography color="textPrimary">{project.themeName}</Typography>
            </Breadcrumbs>
          </Hidden>

          <Steps activeStep={1} />

          <Switch>
            <Route
              path="/create/2-questions-choice/new"
              render={(props) => (
                <NewQuestion
                  {...props}
                  themeId={project.themeId}
                  scenarioId={project.scenarioId}
                />
              )}
            />
            <Route
              path="/create/2-questions-choice/edit"
              render={(props) => (
                <EditQuestion
                  {...props}
                  themeId={project.themeId}
                  scenarioId={project.scenarioId}
                />
              )}
            />
            <Route
              path="/create/2-questions-choice"
              render={(props) => (
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
  history: PropTypes.object.isRequired,
};

export default withRouter(Partie2);
