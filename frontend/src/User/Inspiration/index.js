import React from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

function Inspiration() {
  const { t } = useTranslation();
  return (
    <div>
      <Typography color="primary" variant="h1">
        {t("inspiration")}
      </Typography>
    </div>
  );
}

export default Inspiration;
