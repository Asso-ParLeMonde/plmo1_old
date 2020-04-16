import React from "react";
import { Route, Switch } from "react-router-dom";
import { ProjectServiceProvider } from "../../services/ProjectService";

import Theme from "./Theme/AllThemes";
import NewTheme from "./Theme/NewTheme";
import Partie1 from "./Partie1";
import Partie2 from "./Partie2";
import Partie3 from "./Partie3";
import Partie4 from "./Partie4";
import EditProject from "./EditProject";

function Creer() {
  return (
    <Switch>
      <Route path="/create/edit-project/:projectId" component={EditProject} />
      <Route path="*">
        <ProjectServiceProvider>
          <Switch>
            <Route path="/create/1-scenario-choice" component={Partie1} />
            <Route path="/create/2-questions-choice" component={Partie2} />
            <Route
              path="/create/3-storyboard-and-filming-schedule"
              component={Partie3}
            />
            <Route path="/create/4-to-your-camera" component={Partie4} />
            <Route
              path="/create/edit-project/:projectId"
              component={EditProject}
            />
            <Route path="/create/new-theme" component={NewTheme} />
            <Route path="/create" component={Theme} />
          </Switch>
        </ProjectServiceProvider>
      </Route>
    </Switch>
  );
}

export default Creer;
