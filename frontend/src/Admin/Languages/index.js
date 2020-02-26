import React from "react";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import AddButton from "../components/Buttons/AddButton";
import TableCard from "../components/TableCard";

function Languages() {
  let languages = [
    {
      id: 1,
      label: "FR",
      value: "fr"
    }
  ];

  return (
    <TableCard
      type="LANGUAGE"
      title="Liste des langues"
      elements={languages}
      validIcon={<EditIcon />}
      invalidIcon={<DeleteIcon />}
    >
      <AddButton
        buttonTitle="Ajouter une langue"
        type="LANGUAGE"
        link="/admin/languages/new"
        modalTitle="Ajout d'une nouvelle langue"
      />
    </TableCard>
  );
}

Languages.propTypes = {};

export default Languages;
