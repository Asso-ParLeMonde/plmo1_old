import React, { useState, useContext } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";

import {
  Breadcrumbs,
  Hidden,
  Link,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { AppLanguageServiceContext } from "../../../../services/AppLanguageService";
import { UserServiceContext } from "../../../../services/UserService";
import { ProjectServiceContext } from "../../../../services/ProjectService";
import Inverted from "../../../../components/Inverted";

function NewTheme(props) {
  const { t } = useTranslation();
  const { isLoggedIn } = useContext(UserServiceContext);
  const { selectedLanguage } = useContext(AppLanguageServiceContext);
  const { updateProject } = useContext(ProjectServiceContext);
  const [themeName, setThemeName] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleHome = (event) => {
    event.preventDefault();
    props.history.push("/create");
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setThemeName(event.target.value);
    setHasError(false);
  };

  const handleSubmit = () => {
    if (themeName.length === 0) {
      setHasError(true);
      return;
    }
    const newTheme = {
      image: null,
      names: {
        fr: themeName,
      },
    };
    newTheme.names[selectedLanguage] = themeName;
    if (!isLoggedIn()) {
      const localThemes = JSON.parse(localStorage.getItem("localThemes")) || [];
      newTheme.id = `local_${localThemes.length + 1}`;
      localThemes.push(newTheme);
      localStorage.setItem("localThemes", JSON.stringify(localThemes));
    } else {
      // TODO
    }
    updateProject({
      themeId: newTheme.id,
      id: null,
      title: "",
      languageCode: selectedLanguage || "fr",
    });
    props.history.push(`/create/1-scenario-choice`);
  };

  return (
    <div>
      <Hidden smDown>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link color="inherit" href="/create" onClick={handleHome}>
            {t("all_themes")}
          </Link>
          <Typography color="textPrimary">{t("create_new_theme")}</Typography>
        </Breadcrumbs>
      </Hidden>

      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          paddingBottom: "2rem",
        }}
      >
        <Hidden mdUp>
          <Button
            size="medium"
            onClick={handleHome}
            style={{ paddingLeft: "0!important", margin: "1rem 0 0 0" }}
          >
            <KeyboardArrowLeft />
            {t("back")}
          </Button>
        </Hidden>

        <Typography color="primary" variant="h1" style={{ marginTop: "1rem" }}>
          <Trans i18nKey="new_theme_title">
            Créer votre <Inverted>thème</Inverted> :
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          <Trans i18nKey="new_theme_title_label">
            Nom du thème<span style={{ color: "red" }}>*</span> :
          </Trans>
          <div>
            <TextField
              value={themeName}
              onChange={handleInputChange}
              required
              error={hasError}
              className={hasError ? "shake" : ""}
              id="themeName"
              placeholder={t("new_theme_title_placeholder")}
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant="outlined"
              color="secondary"
              autoComplete="off"
            />
          </div>
        </Typography>

        <div style={{ marginTop: "2rem" }}>
          <Hidden smDown>
            <div style={{ width: "100%", textAlign: "right" }}>
              <Button
                as="a"
                variant="outlined"
                color="secondary"
                style={{ marginRight: "1rem" }}
                href={`/create`}
                onClick={handleHome}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                endIcon={<ArrowForwardIcon />}
              >
                {t("next")}
              </Button>
            </div>
          </Hidden>
          <Hidden mdUp>
            <Button
              variant="contained"
              color="secondary"
              style={{ width: "100%", marginTop: "2rem" }}
              onClick={handleSubmit}
            >
              {t("next")}
            </Button>
          </Hidden>
        </div>
      </div>
    </div>
  );
}

NewTheme.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(NewTheme);
