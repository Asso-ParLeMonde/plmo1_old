import React, { useState, useEffect, useContext } from "react";

import StatisticsCard from "./components/StatisticsCard";
import { UserServiceContext } from "../../services/UserService";

const DEFAULT_STATISTICS = {
  classNb: 0,
  countriesNb: 0,
  projectsNb: 0,
  pdfsNb: 0,
};

const STATISTICS_OPTIONS = [
  {
    title: "Nombre de classes inscrites",
    value: "classNb",
    type: "CLASS",
  },
  {
    title: "Nombre de pays qui utilisent le service",
    value: "countriesNb",
    type: "COUNTRY",
  },
  {
    title: "Nombre de projets crées",
    value: "projectsNb",
    type: "PROJECTS",
  },
  {
    title: "Nombre de téléchargement de plans de tournage",
    value: "pdfsNb",
    type: "PDF",
  },
];

function Statistics() {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const [statistics, setStatistics] = useState(DEFAULT_STATISTICS);

  useEffect(() => {
    const getStatistics = async () => {
      const statisticsRequest = await axiosLoggedRequest({
        method: "GET",
        url: "/statistics/basics",
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
      {STATISTICS_OPTIONS.map((s, index) => {
        return (
          <StatisticsCard
            key={index}
            title={s.title}
            value={statistics[s.value]}
            type={s.type}
          />
        );
      })}
    </div>
  );
}

export default Statistics;
