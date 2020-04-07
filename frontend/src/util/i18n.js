import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {},
  load: "currentOnly",
  fallbackLng: "fr",
  debug: true, //process.env.REACT_APP_DEBUG === "true",
  ns: ["translations"],
  defaultNS: "translations",
  interpolation: {
    escapeValue: false,
  },
  lng: localStorage.getItem("language") || "fr",
  react: {
    useSuspense: false,
    wait: false,
  },
});

export default i18n;
