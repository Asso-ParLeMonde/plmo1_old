import React from "react";
import Inverted from "../../components/Inverted";
import {Typography} from "@material-ui/core";

function Scenario() {
  return (
    <div>
      <Typography color="primary" variant="h1" style={{fontSize: "2rem", margin: "1.2rem 0 1rem 0"}}><Inverted round>1</Inverted> Quel <Inverted>scénario</Inverted> choisir ?</Typography>
    </div>
  );
}

export default Scenario;
