async function postQuestion(axiosLoggedRequest, newQuestion, setRes) {
  const request = await axiosLoggedRequest({
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

async function putQuestion(
  axiosLoggedRequest,
  inheritedQuestion,
  newQuestion,
  setRes
) {
  const request = await axiosLoggedRequest({
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
  axiosLoggedRequest,
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
      error = await postQuestion(axiosLoggedRequest, newQuestion, setRes);
      break;
    case "PUT":
      error = await putQuestion(
        axiosLoggedRequest,
        inheritedQuestion,
        newQuestion,
        setRes
      );
      break;
  }

  return error;
}

export { updateQuestion };
