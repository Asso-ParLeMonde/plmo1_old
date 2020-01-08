import React from "react";
import PropTypes from "prop-types";
import useAxios from "./useAxios";

const ThemesServiceContext = React.createContext(undefined, undefined);

function ThemesServiceProvider({ children, isPublished }) {
  const getThemes = useAxios({
    method: "GET",
    url: `${process.env.REACT_APP_BASE_APP}/themes?published=${isPublished}`
  });

  return (
    <ThemesServiceContext.Provider value={getThemes}>
      {children}
    </ThemesServiceContext.Provider>
  );
}

ThemesServiceProvider.propTypes = {
  children: PropTypes.any,
  isPublished: PropTypes.bool,
};

ThemesServiceProvider.defaultProps = {
  isPublished: null,
};

export { ThemesServiceContext, ThemesServiceProvider };
