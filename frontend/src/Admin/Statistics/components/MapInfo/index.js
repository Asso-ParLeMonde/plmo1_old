import React, { useState } from "react";
import ReactTooltip from "react-tooltip";

import MapChart from "./MapChart";

function MapInfo() {
  const [content, setContent] = useState("");
  return (
    <div>
      <MapChart setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
}

export default MapInfo;
