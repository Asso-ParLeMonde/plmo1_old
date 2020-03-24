import { axiosRequest } from "../../../components/axiosRequest";

async function postQuestion(newQuestion, setRes) {
  const request = await axiosRequest({
    method: "POST",
    url: "/questions",
    data: newQuestion
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la creation de la question"
    });

    return true;
  }

  return false;
}

async function putQuestion(inheritedQuestion, newQuestion, setRes) {
  const request = await axiosRequest({
    method: "PUT",
    url: `/questions/${inheritedQuestion.id}`,
    data: {
      scenarioId: newQuestion.scenarioId,
      question: newQuestion.question,
      isDefault: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification de la question"
    });

    return true;
  }

  return false;
}

async function updateQuestion(
  requestType,
  inheritedQuestion,
  newQuestion,
  setRes
) {
  let error = false;

  switch (requestType) {
    default:
      break;
    case "POST":
      error = await postQuestion(newQuestion, setRes);
      break;
    case "PUT":
      error = await putQuestion(inheritedQuestion, newQuestion, setRes);
      break;
  }

  return error;
}

export { updateQuestion };
