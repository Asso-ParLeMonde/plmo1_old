import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../components/axiosRequest";

const LanguagesServiceContext = React.createContext(undefined, undefined);

function LanguagesServiceProvider({ children }) {
  const [getLanguages, setGetLanguages] = useState({
    data: null,
    pending: null,
    error: null,
    complete: null
  });

  const updateLanguages = useCallback(async () => {
    const languagesRequest = await axiosRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/languages`
    });
    setGetLanguages(languagesRequest);
  }, []);

  useEffect(() => {
    updateLanguages().catch();
  }, [updateLanguages]);

  return (
    <LanguagesServiceContext.Provider value={{ getLanguages, updateLanguages }}>
      {children}
    </LanguagesServiceContext.Provider>
  );
}

LanguagesServiceProvider.propTypes = {
  children: PropTypes.any
};

export { LanguagesServiceContext, LanguagesServiceProvider };
