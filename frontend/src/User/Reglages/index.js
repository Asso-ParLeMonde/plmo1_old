import React, { useContext } from "react";
import { Typography, Select, FormControl, InputLabel } from "@material-ui/core";
import { AppLanguageServiceContext } from "../../services/AppLanguageService";
import { LanguagesServiceContext } from "../../services/LanguagesService";
import { useTranslation } from "react-i18next";

function Reglages() {
  const { t } = useTranslation();
  const { selectedLanguage, setSelectedLanguage } = useContext(
    AppLanguageServiceContext
  );
  const { getLanguages } = useContext(LanguagesServiceContext);
  const languages =
    getLanguages.complete && !getLanguages.error ? getLanguages.data : [];

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div>
      <Typography color="primary" variant="h1">
        {t("settings")}
      </Typography>
      <div>
        <form noValidate autoComplete="off" style={{ margin: "1rem 0" }}>
          {languages.length > 0 && (
            <>
              <Typography
                color="inherit"
                variant="h2"
                style={{ margin: "0.5rem 0 1rem 0" }}
              >
                {t("change_language")}
              </Typography>
              <FormControl variant="outlined">
                <InputLabel htmlFor="language">{t("language")}</InputLabel>
                <Select
                  native
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  label={t("language")}
                  inputProps={{
                    name: "language",
                    id: "language",
                  }}
                >
                  {languages.map((l) => (
                    <option value={l.value} key={l.value}>
                      {l.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Reglages;
