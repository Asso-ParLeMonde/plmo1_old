import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locales } from "./defaultLocales";

i18n.use(initReactI18next).init({
  resources: {
    default: {
      translations: locales,
    },
  },
  load: "currentOnly",
  fallbackLng: "default",
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
