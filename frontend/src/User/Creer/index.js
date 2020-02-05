import React from "react";
import { Route, Switch } from "react-router-dom";

import Theme from "./Theme";
import Partie1 from "./Partie1";
import Partie2 from "./Partie2";

function Creer() {
  return (
    <Switch>
      <Route path="/creer/1-choix-du-scenario" component={Partie1} />
      <Route path="/creer/2-choix-des-questions" component={Partie2} />
      <Route path="/creer" component={Theme} />
    </Switch>
  )
}

export default Creer;
