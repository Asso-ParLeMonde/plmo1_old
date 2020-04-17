import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Paper from "@material-ui/core/Paper";
import CardMedia from "@material-ui/core/CardMedia";

import "./ThemeCard.css";
import { Typography } from "@material-ui/core";
import { AppLanguageServiceContext } from "../../../../services/AppLanguageService";

const colors = [
  "rgb(96, 105, 243)",
  "rgb(213, 89, 84)",
  "rgb(250, 225, 108)",
  "rgb(62, 65, 87)",
  "rgb(215, 213, 209)",
  "rgb(162, 220, 174)",
];

function ThemeCard(props) {
  const img = useRef(null);
  const { t } = useTranslation();
  const { selectedLanguage } = useContext(AppLanguageServiceContext);
  const [imgHasError, setImgHasError] = useState(false);

  const themeName =
    props.theme === null
      ? t("create_new_theme")
      : props.theme.names[selectedLanguage] || props.theme.names.fr;
  const themeUrl =
    props.theme === null
      ? "/create/new-theme"
      : `/create/1-scenario-choice?themeId=${props.themeId}`;

  useEffect(() => {
    if (
      props.theme !== null &&
      props.theme.image !== undefined &&
      props.theme.image !== null
    ) {
      const image = new Image();
      image.onload = () => {
        if (img && img.current) {
          img.current.src = image.src;
        }
      };
      image.onerror = () => {
        setImgHasError(true);
      };
      image.src = props.theme.image.path;
    }
  }, [props.theme]);

  return (
    <a className="theme-card-button" href={themeUrl} onClick={props.onClick}>
      <Paper className="theme-card-paper">
        {props.theme !== null && props.theme.image && !imgHasError ? (
          <CardMedia
            ref={img}
            component="img"
            alt={`picture of ${themeName} theme`}
            image="/classe_default.png"
          />
        ) : (
          <div
            className="theme-card-default"
            style={{
              backgroundColor:
                colors[
                  (typeof props.themeId === "string"
                    ? parseInt(props.themeId.split("_")[1], 10) || 0
                    : props.themeId) % 6
                ],
            }}
          />
        )}
      </Paper>
      <Typography className="theme-card-title">{themeName}</Typography>
    </a>
  );
}

ThemeCard.propTypes = {
  themeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  theme: PropTypes.object,
  onClick: PropTypes.func,
};

ThemeCard.defaultProps = {
  themeId: 0,
  theme: {
    image: null,
  },
  onClick: () => {},
};

export default ThemeCard;
