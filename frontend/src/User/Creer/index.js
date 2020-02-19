import React from "react";
import { Route, Switch } from "react-router-dom";
import { ProjectServiceProvider } from "../../services/ProjectService";

import Theme from "./Theme";
import Partie1 from "./Partie1";
import Partie2 from "./Partie2";
import Partie3 from "./Partie3";

function Creer() {
  return (
    <ProjectServiceProvider>
      <Switch>
        <Route path="/creer/1-choix-du-scenario" component={Partie1} />
        <Route path="/creer/2-choix-des-questions" component={Partie2} />
        <Route path="/creer/3-storyboard-et-plan-de-tournage" component={Partie3} />
        <Route path="/creer" component={Theme} />
      </Switch>
    </ProjectServiceProvider>
  )
}

export default Creer;
