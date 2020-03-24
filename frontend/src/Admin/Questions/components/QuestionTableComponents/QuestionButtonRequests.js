import { axiosRequest } from "../../../../components/axiosRequest";

async function handleQuestionButtonRequest(
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
      request = await axiosRequest({
        method: "PUT",
        url: `/questions/${question.id}_${question.language}`,
        data: { ...question, isStandard: true }
      });
      break;
    case "DELETE":
      request = await axiosRequest({
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
