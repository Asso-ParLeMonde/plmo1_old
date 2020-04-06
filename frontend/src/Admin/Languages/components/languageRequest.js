import { updateNotificationResponse } from "../../components/updateNotificationResponse";

const path = "/admin/languages";

async function postAdminLanguage(
  axiosLoggedRequest,
  language,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateUsers
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: "/languages/",
    data: language,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateUsers,
    history,
    path
  );
}

async function deleteAdminLanguage(
  axiosLoggedRequest,
  language,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateLanguages
) {
  const request = await axiosLoggedRequest({
    method: "DELETE",
    url: `/languages/${language.id}`,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateLanguages,
    history,
    path
  );
}

export { postAdminLanguage, deleteAdminLanguage };
