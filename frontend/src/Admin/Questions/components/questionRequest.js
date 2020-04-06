import { updateNotificationResponse } from "../../components/updateNotificationResponse";

const path = "/admin/questions";

async function postAdminQuestion(
  axiosLoggedRequest,
  question,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateQuestions
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: "/questions/",
    data: question,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateQuestions,
    history,
    path
  );
}

async function putAdminQuestion(
  axiosLoggedRequest,
  question,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateQuestions
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/questions/${question.id}`,
    data: question,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateQuestions,
    history,
    path
  );
}

async function deleteAdminQuestion(
  axiosLoggedRequest,
  question,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateQuestions
) {
  const request = await axiosLoggedRequest({
    method: "DELETE",
    url: `/questions/${question.id}`,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateQuestions,
    history,
    path
  );
}

export { postAdminQuestion, putAdminQuestion, deleteAdminQuestion };
