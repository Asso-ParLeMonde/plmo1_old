import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../components/axiosRequest";
import { useTranslation } from "react-i18next";

async function loadLanguage(language) {
  const response = await axiosRequest({
    method: "GET",
    url: `/locales/${language}.json`,
  });
  if (!response.error) {
    return response.data;
  }
  return {};
}

const AppLanguageServiceContext = React.createContext(undefined, undefined);

function AppLanguageServiceProvider(props) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "fr"
  );
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [downloadedLanguages, setDownloadedLanguages] = useState([]);
  const { i18n } = useTranslation();

  const updateLanguage = async () => {
    if (!downloadedLanguages.includes(selectedLanguage)) {
      const translations = await loadLanguage(selectedLanguage);
      i18n.addResourceBundle(selectedLanguage, "translations", translations);
      setDownloadedLanguages([...downloadedLanguages, selectedLanguage]);
      setLanguageLoaded(true);
    }
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  useEffect(() => {
    updateLanguage().catch();
    // eslint-disable-next-line
  }, [selectedLanguage]);

  if (!languageLoaded) {
    return <div></div>;
  }

  return (
    <AppLanguageServiceContext.Provider
      value={{ selectedLanguage, setSelectedLanguage }}
    >
      {props.children}
    </AppLanguageServiceContext.Provider>
  );
}

AppLanguageServiceProvider.propTypes = {
  children: PropTypes.any,
};

export { AppLanguageServiceContext, AppLanguageServiceProvider };
