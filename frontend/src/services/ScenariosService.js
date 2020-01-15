import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../Admin/components/axiosRequest";

const ScenariosServiceContext = React.createContext(undefined, undefined);

function ScenariosServiceProvider({ children, isPublished }) {
  const [getScenarios, setGetScenarios] = useState({
    data: null,
    pendint: null,
    error: null,
    complete: null
  });

  const updateScenarios = useCallback(async () => {
    const scenariosRequest = await axiosRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/scenarios?published=${isPublished}`
    });
    setGetScenarios(scenariosRequest);
  }, [isPublished]);

  useEffect(() => {
    updateScenarios().catch();
  }, [updateScenarios]);

  return (
    <ScenariosServiceContext.Provider value={{ getScenarios, updateScenarios }}>
      {children}
    </ScenariosServiceContext.Provider>
  );
}

ScenariosServiceProvider.propTypes = {
  children: PropTypes.any,
  isPublished: PropTypes.bool
};

ScenariosServiceProvider.defaultProps = {
  isPublished: null
};

export { ScenariosServiceContext, ScenariosServiceProvider };
