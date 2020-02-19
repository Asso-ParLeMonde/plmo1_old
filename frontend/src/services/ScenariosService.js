import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../Admin/components/axiosRequest";

const ScenariosServiceContext = React.createContext(undefined, undefined);

function ScenariosServiceProvider({ children, isDefault }) {
  const [getScenarios, setGetScenarios] = useState({
    data: null,
    pendint: null,
    error: null,
    complete: null
  });

  const updateScenarios = useCallback(async () => {
    const scenariosRequest = await axiosRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/scenarios?isDefault=${isDefault}`
    });
    setGetScenarios(scenariosRequest);
  }, [isDefault]);

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
  isDefault: PropTypes.bool
};

ScenariosServiceProvider.defaultProps = {
  isDefault: null
};

export { ScenariosServiceContext, ScenariosServiceProvider };
