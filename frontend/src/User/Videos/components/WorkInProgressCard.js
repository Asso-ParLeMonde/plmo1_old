import React from "react";
import PropTypes from "prop-types";
import { Typography, ButtonBase } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import "./workInProgressCard.css";

function WorkInProgressCard(props) {
  const { t } = useTranslation();

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
            <label>{t("my_videos_themes")}</label>{" "}
            {(props.theme.names || {}).fr}
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
