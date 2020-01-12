import React, { useContext } from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import AddThemeButton from "./components/AddThemeButton";
import { ThemesServiceContext } from "../../services/ThemesService";
import Accordion from "../components/Accordion";
import AccordionContainer from "../components/Accordion/AccordionContainer";

function Themes() {
  let themes = [];

  // eslint-disable-next-line
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  if (themesRequest.complete && !themesRequest.error) {
    themes = themesRequest.data;
  }

  return (
    <React.Fragment>
      <AccordionContainer>
        <Accordion
          type="THEME"
          title={"Liste des themes"}
          elements={themes.filter(theme => theme.isPublished === true)}
          validIcon={<EditIcon />}
          invalidIcon={<DeleteIcon />}
        />

        <AddThemeButton
          modalTitle={"Creation d'un nouveau theme"}
          link={"new"}
        />
      </AccordionContainer>

      <AccordionContainer>
        <Accordion
          type="THEME"
          title={"Themes en attente de validation"}
          elements={themes.filter(theme => theme.isPublished === false)}
          validIcon={<CheckIcon />}
          invalidIcon={<ClearIcon />}
        />
      </AccordionContainer>
    </React.Fragment>
  );
}

Themes.propTypes = {};

export default Themes;
