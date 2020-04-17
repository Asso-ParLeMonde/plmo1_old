import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Typography, ButtonBase } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import "./workInProgressCard.css";
import { AppLanguageServiceContext } from "../../../services/AppLanguageService";

function WorkInProgressCard(props) {
  const { t } = useTranslation();
  const { selectedLanguage } = useContext(AppLanguageServiceContext);

  const names = props.theme.names || { fr: "" };
  const themeName = names[selectedLanguage] || names.fr;

  return (
    <ButtonBase
      focusRipple
      style={{ marginRight: "1rem" }}
      onClick={props.onClick}
    >
      <div className="wip-container">
        <Typography color="primary" variant="h3" className="text-center">
          {props.title}
        </Typography>
        {props.theme !== null && (
          <div className="theme-name">
            <label>{t("my_videos_themes")}</label> {themeName}
          </div>
        )}
      </div>
    </ButtonBase>
  );
}

WorkInProgressCard.propTypes = {
  title: PropTypes.string.isRequired,
  theme: PropTypes.object,
  onClick: PropTypes.func,
};

WorkInProgressCard.defaultProps = {
  theme: null,
  onClick: () => {},
};

export default WorkInProgressCard;
