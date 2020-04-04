import React, { useContext, useState, useEffect } from "react";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import { Breadcrumbs, Hidden, Link, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { ProjectServiceContext } from "../../../services/ProjectService";
import useAxios from "../../../services/useAxios";
import Steps from "../../components/Steps";
import NewScenario from "./NewScenario";
import AllScenarios from "./AllScenarios";

function Partie1(props) {
  const { project, updateProject } = useContext(ProjectServiceContext);

  // Get scenarios
  const [scenarios, setScenarios] = useState([]);
  const [localScenarios, setLocalScenarios] = useState(
    (JSON.parse(localStorage.getItem("scenarios")) || []).filter(
      s => s.themeId === project.themeId
    )
  );
  const allScenarios = [...scenarios, ...localScenarios];
  const getScenarios = useAxios({
    method: "GET",
    url:
      project.themeId === null
        ? null
        : `/themes/${project.themeId}/scenarios?languageCode=${project.languageCode}&isDefault=true&user`
  });
  useEffect(() => {
    if (getScenarios.complete && !getScenarios.error) {
      setScenarios(getScenarios.data);
    }
  }, [getScenarios]);

  const isNewScenario = props.location.pathname.indexOf("new") !== -1;

  const handleHome = event => {
    event.preventDefault();
    props.history.push("/create");
  };

  const handleBack = event => {
    event.preventDefault();
    props.history.push(`/create/1-scenario-choice?themeId=${project.themeId}`);
  };

  if (project.themeId === null) {
    return <Redirect to="/create" />;
  }

  const addLocalScenario = newScenario => {
    newScenario.id = `local_${localScenarios.length + 1}`;
    newScenario.isDefault = false;
    localScenarios.push(newScenario);
    setLocalScenarios(localScenarios);
    updateProject({
      scenarioId: newScenario.id,
      scenarioName: newScenario.name
    });
    localStorage.setItem("scenarios", JSON.stringify(localScenarios));
  };

  return (
    <div>
      <Hidden smDown>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link color="inherit" href="/create" onClick={handleHome}>
            Tout les thèmes
          </Link>
          {isNewScenario && (
            <Link
              color="inherit"
              href={`/create/1-scenario-choice?themeId=${project.themeId}`}
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
          path="/create/1-scenario-choice/new"
          render={props => (
            <NewScenario
              {...props}
              themeId={project.themeId}
              addLocalScenario={addLocalScenario}
            />
          )}
        />
        <Route
          path="/create/1-scenario-choice/"
          render={props => (
            <AllScenarios
              {...props}
              themeId={project.themeId}
              scenarios={allScenarios}
            />
          )}
        />
        )} />
      </Switch>
    </div>
  );
}

Partie1.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie1);
