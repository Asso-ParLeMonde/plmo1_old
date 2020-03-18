import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../components/axiosRequest";

const ThemesServiceContext = React.createContext(undefined, undefined);

function ThemesServiceProvider({ children, isPublished }) {
  const [getThemes, setGetThemes] = useState({
    data: null,
    pending: null,
    error: null,
    complete: null
  });

  const updateThemes = useCallback(async () => {
    const themesRequest = await axiosRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/themes?published=${isPublished}`
    });
    setGetThemes(themesRequest);
  }, [isPublished]);

  useEffect(() => {
    updateThemes().catch();
  }, [updateThemes]);

  return (
    <ThemesServiceContext.Provider value={{ getThemes, updateThemes }}>
      {children}
    </ThemesServiceContext.Provider>
  );
}

ThemesServiceProvider.propTypes = {
  children: PropTypes.any,
  isPublished: PropTypes.bool
};

ThemesServiceProvider.defaultProps = {
  isPublished: null
};

export { ThemesServiceContext, ThemesServiceProvider };
