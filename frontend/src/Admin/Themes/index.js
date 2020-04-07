import React, { useContext, useState, useEffect } from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import AddButton from "../components/Buttons/AddButton";
import TableCard from "../components/TableCard";
import { ThemesServiceContext } from "../../services/ThemesService";
import ChangeOrderButton from "./components/ChangeOrderButton";

function Themes() {
  const { getThemes: themesRequest } = useContext(ThemesServiceContext);
  const [themesList, setThemesList] = useState([]);

  const themes =
    themesRequest.complete && !themesRequest.error ? themesRequest.data : [];

  useEffect(() => {
    setThemesList(themes);
  }, [themes]);

  return (
    <React.Fragment>
      <TableCard
        type="THEMEDND"
        title="Liste des thèmes"
        elements={themesList.filter((theme) => theme.isPublished === true)}
        setElements={setThemesList}
        validIcon={<EditIcon />}
        invalidIcon={<DeleteIcon />}
      >
        <AddButton
          buttonTitle="Ajouter un thème"
          type="THEME"
          link="/admin/themes/new"
          modalTitle="Creation d'un nouveau theme"
        />
        <ChangeOrderButton themesList={themesList} />
      </TableCard>

      <TableCard
        type="THEME"
        title={"Thèmes en attente de validation"}
        elements={themesList.filter((theme) => theme.isPublished === false)}
        validIcon={<CheckIcon />}
        invalidIcon={<ClearIcon />}
      />
    </React.Fragment>
  );
}

Themes.propTypes = {};

export default Themes;
