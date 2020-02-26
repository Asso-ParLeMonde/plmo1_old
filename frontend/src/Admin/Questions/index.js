import React, {useEffect, useState} from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import AddButton from "../components/Buttons/AddButton";
import TableCard from "../components/TableCard";
import ScenarioSelector from "./components/ScenarioSelector";
import { Card, CardContent, Typography } from "@material-ui/core";
import { axiosRequest } from "../components/axiosRequest";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(undefined)

  useEffect(() => {
    async function getQuestions() {
      const questionsRequest = await axiosRequest({
        method: "GET",
        url: `${process.env.REACT_APP_BASE_APP}/scenario/${selectedScenario?.id}/questions`
      });

      setQuestions(questionsRequest.data || [])
    }    

    getQuestions()
  }, [selectedScenario])

  return (
      <React.Fragment>
      <Card style={{ marginBottom: "2rem" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          style={{ marginBottom: "1rem" }}
        >
          Scénario associé aux questions
        </Typography>
        <ScenarioSelector selectedScenario={selectedScenario} setSelectedScenario={setSelectedScenario} />
      </CardContent>
    </Card>

      <TableCard
        type="QUESTION"
        title={"Liste des questions par default"}
        elements={questions.filter(question => question.isDefault === true)}
        validIcon={<EditIcon />}
        invalidIcon={<DeleteIcon />}
      >
        <AddButton
          buttonTitle="Ajouter un question"
          type="QUESTION"
          link="/admin/questions/new"
          modalTitle="Creation d'une nouvelle question par default"
        />
      </TableCard>

      <TableCard
        type="QUESTION"
        title={"Autres questions existantes"}
        elements={questions.filter(question => question.isDefault === false)}
        validIcon={<CheckIcon />}
        invalidIcon={<ClearIcon />}
      />
      </React.Fragment>
  );
}

Questions.propTypes = {};

export default Questions;
