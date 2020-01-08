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
  const themesRequest = useContext(ThemesServiceContext);
  if (themesRequest.complete && !themesRequest.error) {
    themes = themesRequest.data;
  }

  themes = [
    {
      id: 1,
      names: {
        fr: "Maison",
        en: "Home"
      },
      description: "theme 1",
      isPublished: false,
      image: null
    },
    {
      id: 2,
      names: {
        fr: "Sport",
        en: "Sport"
      },
      description: "theme 2",
      isPublished: true,
      image: null
    },
    {
      id: 3,
      names: {
        fr: "Science Fiction",
        en: "Science Fiction"
      },
      description: "theme 3",
      isPublished: true,
      image: null
    }
  ];

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
