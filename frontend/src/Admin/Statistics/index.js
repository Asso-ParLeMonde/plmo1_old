import React, { useState, useEffect, useContext } from "react";

import StatisticsCard from "./components/StatisticsCard";
import { UserServiceContext } from "../../services/UserService";

const DEFAULT_STATISTICS = {
  classNb: 0,
  countriesNb: 0,
  projectsNb: 0,
  pdfsNb: 0
};

function Statistics() {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const [statistics, setStatistics] = useState(DEFAULT_STATISTICS);

  useEffect(() => {
    const getStatistics = async () => {
      const statisticsRequest = await axiosLoggedRequest({
        method: "GET",
        url: "/statistics/basics"
      });

      if (
        statisticsRequest.complete === true &&
        statisticsRequest.error === false
      ) {
        setStatistics(statisticsRequest.data);
      }
    };

    getStatistics();
  }, [axiosLoggedRequest]);

  return (
    <div>
      <StatisticsCard
        title="Nombre de classes inscrites"
        value={statistics.classNb}
        type="CLASS"
      />
      <StatisticsCard
        title="Nombre de pays qui utilisent le service"
        value={statistics.countriesNb}
        type="COUNTRY"
      />
      <StatisticsCard
        title="Nombre de projets crées"
        value={statistics.projectsNb}
        type="PROJECTS"
      />
      <StatisticsCard
        title="Nombre de téléchargement de plans de tournage"
        value={statistics.pdfsNb}
        type="PDF"
      />
    </div>
  );
}

export default Statistics;
