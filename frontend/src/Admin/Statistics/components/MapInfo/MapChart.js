import React, { memo, useState, useEffect, useContext } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { UserServiceContext } from "../../../../services/UserService";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);
  const { axiosLoggedRequest } = useContext(UserServiceContext);

  useEffect(() => {
    const fetchCountriesRepartition = async () => {
      const fetchDataRequest = await axiosLoggedRequest({
        method: "GET",
        url: "/statistics/countries/repartition",
      });

      if (
        fetchDataRequest.complete === true &&
        fetchDataRequest.error === false
      ) {
        setData(fetchDataRequest.data);
      }
    };

    fetchCountriesRepartition();
  }, [axiosLoggedRequest]);

  const colorScale = scaleQuantile()
    .domain(data.map((d) => d.nb))
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618",
    ]);

  return (
    <>
      <ComposableMap
        data-tip=""
        projectionConfig={{ scale: 100 }}
        width={600}
        height={300}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const { NAME } = geo.properties;
                const cur = data.find((s) => s.country === NAME);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={cur ? colorScale(cur.nb) : "#EEE"}
                    onMouseEnter={() => {
                      const newTooltipContent = cur
                        ? `${NAME} ${cur.nb}`
                        : `${NAME}`;
                      setTooltipContent(newTooltipContent);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: "#d6d6da",
                        outline: "none",
                      },
                      hover: {
                        fill: "#6065fc",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
