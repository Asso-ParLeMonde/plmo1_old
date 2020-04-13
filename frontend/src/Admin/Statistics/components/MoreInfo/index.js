import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import { Bar, Line } from "react-chartjs-2";
import { UserServiceContext } from "../../../../services/UserService";

function MoreInfo(props) {
  const [chartData, setChartData] = useState(null);
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const options = {
    maintainAspectRatio: false, // Don't maintain w/h ratio
  };

  useEffect(() => {
    const fetchData = async () => {
      let url = "";

      switch (props.type) {
        default:
          break;
        case "CLASS":
          url = "/statistics/classrooms/repartition";
          break;
        case "PDF":
          url = "/statistics/PDFs/repartition";
          break;
        case "PROJECTS":
          url = "/statistics/projects/repartition";
          break;
      }

      const fetchDataRequest = await axiosLoggedRequest({
        method: "GET",
        url,
      });

      let newData = {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "rgba(75,192,192,0.4)",
            data: [],
          },
        ],
      };

      if (
        fetchDataRequest.complete === true &&
        fetchDataRequest.error === false
      ) {
        fetchDataRequest.data.forEach((element) => {
          newData.labels.push(element.label);
          newData.datasets[0].data.push(element.nb);
          return;
        });
        newData.datasets[0].label = "Repartition des effectifs";

        setChartData(newData);
      }
    };

    fetchData();
  }, [axiosLoggedRequest, props.type]);

  const getChart = () => {
    switch (props.type) {
      default:
        return <div />;
      case "CLASS":
        return <Bar data={chartData} options={options} />;
      case "PDF":
        return <Line data={chartData} options={options} />;
      case "PROJECTS":
        return <Line data={chartData} options={options} />;
    }
  };

  if (chartData === null) {
    return <div />;
  }

  return <div>{getChart()}</div>;
}

MoreInfo.propTypes = {
  type: PropTypes.oneOf(["CLASS", "PROJECTS", "PDF"]).isRequired,
};

export default MoreInfo;
