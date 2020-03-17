import React, { useEffect, useState, useCallback } from "react";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import AddButton from "../components/Buttons/AddButton";
import TableCard from "../components/TableCard";
import ScenarioSelector from "./components/ScenarioSelector";
import { Card, CardContent, Typography } from "@material-ui/core";
import { axiosRequest } from "../components/axiosRequest";

export const QuestionsContext = React.createContext(undefined);

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState(undefined);

  const updateQuestions = useCallback(async () => {
    const questionsRequest = await axiosRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/scenarios/${selectedScenarioId}/questions`
    });
    setQuestions(questionsRequest.data || []);
  }, [selectedScenarioId]);

  useEffect(() => {
    updateQuestions().catch();
  }, [updateQuestions]);

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
          <ScenarioSelector
            selectedScenario={selectedScenarioId}
            setSelectedScenario={setSelectedScenarioId}
          />
        </CardContent>
      </Card>

      <QuestionsContext.Provider value={updateQuestions}>
        {selectedScenarioId && (
          <React.Fragment>
            <TableCard
              type="QUESTION"
              title={"Liste des questions par défault"}
              elements={questions.filter(
                question => question.isDefault === true
              )}
              validIcon={<EditIcon />}
              invalidIcon={<DeleteIcon />}
            >
              <AddButton
                buttonTitle="Ajouter une question"
                type="QUESTION"
                link="/admin/questions/new"
                modalTitle="Creation d'une nouvelle question par default"
                scenarioId={selectedScenarioId || 0}
              />
            </TableCard>

            <TableCard
              type="QUESTION"
              title={"Autres questions existantes"}
              elements={questions.filter(
                question => question.isDefault === false
              )}
              validIcon={<CheckIcon />}
              invalidIcon={<ClearIcon />}
            />
          </React.Fragment>
        )}
      </QuestionsContext.Provider>
    </React.Fragment>
  );
}

export default Questions;
