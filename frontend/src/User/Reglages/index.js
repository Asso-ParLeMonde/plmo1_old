import React, { useContext } from "react";
import {
  Typography,
  Select,
  FormControl,
  InputLabel,
  Button,
  withStyles,
} from "@material-ui/core";
import { AppLanguageServiceContext } from "../../services/AppLanguageService";
import { LanguagesServiceContext } from "../../services/LanguagesService";
import { useTranslation } from "react-i18next";
import { UserServiceContext } from "../../services/UserService";

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}))(Button);

function Reglages() {
  const { t } = useTranslation();
  const { logout } = useContext(UserServiceContext);
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
        <Typography
          color="inherit"
          variant="h2"
          style={{ margin: "2rem 0 1rem 0" }}
        >
          {t("logout_title")}
        </Typography>
        <RedButton
          variant="outlined"
          className="mobile-full-width"
          onClick={logout}
        >
          {t("logout_button")}
        </RedButton>
      </div>
    </div>
  );
}

export default Reglages;
