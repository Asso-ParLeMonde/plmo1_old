async function handleQuestionButtonRequest(
  axiosLoggedRequest,
  type,
  question,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateThemes
) {
  let request = null;

  switch (type) {
    default:
      break;
    case "PUT":
      request = await axiosLoggedRequest({
        method: "PUT",
        url: `/questions/${question.id}_${question.language}`,
        data: { ...question, isStandard: true }
      });
      break;
    case "DELETE":
      request = await axiosLoggedRequest({
        method: "DELETE",
        url: `/questions/${question.id}`
      });
      break;
  }

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: errorMessage
    });
  }

  if (request.error === false && request.complete === true) {
    setRes({
      error: false,
      complete: true,
      message: successMessage
    });
  }

  updateThemes().catch();
  history.push("/admin/questions");
}

export { handleQuestionButtonRequest };
