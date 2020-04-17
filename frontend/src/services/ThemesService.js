import React, { useCallback, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { UserServiceContext } from "./UserService";

const ThemesServiceContext = React.createContext(undefined, undefined);

function ThemesServiceProvider({ children, isPublished }) {
  const { axiosLoggedRequest, user } = useContext(UserServiceContext);
  const [getThemes, setGetThemes] = useState({
    data: null,
    pending: null,
    error: null,
    complete: null,
  });

  const updateThemes = useCallback(async () => {
    const themesRequest = await axiosLoggedRequest({
      method: "GET",
      url:
        isPublished && user !== null
          ? `/themes?isPublished=${isPublished}&user=true`
          : `/themes?isPublished=${isPublished}`,
    });
    setGetThemes(themesRequest);
    // eslint-disable-next-line
  }, [isPublished, user]);

  const addTheme = (theme) => {
    setGetThemes((t) => ({
      ...t,
      data: [...t.data, theme],
    }));
  };

  useEffect(() => {
    updateThemes().catch();
  }, [updateThemes]);

  return (
    <ThemesServiceContext.Provider
      value={{ getThemes, updateThemes, addTheme }}
    >
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
