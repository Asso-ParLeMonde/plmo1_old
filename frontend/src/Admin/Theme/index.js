import React, { useContext } from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import "./theme.css";
import Accordion from "./components/Accordion";
import AddThemeButton from "./components/AddThemeButton";
import { ThemesServiceContext } from "../../services/ThemesService";

function Theme() {
  let themes = [];

  // eslint-disable-next-line
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    themes = themesRequest.data;
  }

  return (
    <React.Fragment>
      <div className="tableContainer">
        <Accordion
          title={"Liste des themes"}
          themes={themes.filter(theme => theme.isPublished === true)}
          validIcon={<EditIcon />}
          invalidIcon={<DeleteIcon />}
        />

        <AddThemeButton
          modalTitle={"Creation d'un nouveau theme"}
          link={"new"}
        />
      </div>

      <div className="tableContainer">
        <Accordion
          title={"Themes en attente de validation"}
          themes={themes.filter(theme => theme.isPublished === false)}
          validIcon={<CheckIcon />}
          invalidIcon={<ClearIcon />}
        />
      </div>
    </React.Fragment>
  );
}

Theme.propTypes = {};

export default Theme;
