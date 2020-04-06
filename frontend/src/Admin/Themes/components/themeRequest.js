import { updateNotificationResponse } from "../../components/updateNotificationResponse";

const path = "/admin/themes";

async function postImageAdminTheme(
  axiosLoggedRequest,
  theme,
  request,
  errorMessage
) {
  if (
    request.error &&
    theme.image !== undefined &&
    theme.image !== null &&
    theme.image.path === undefined
  ) {
    const bodyFormData = new FormData();
    bodyFormData.append("image", theme.image);

    const requestImage = await axiosLoggedRequest({
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      url: `/themes/${request.data.id}/image`,
      data: bodyFormData,
    });

    if (requestImage.error !== request.error) {
      request.error = true;
      errorMessage = "Erreur lors de l'enregistrement de l'image";
    }
  }
}

async function postAdminTheme(
  axiosLoggedRequest,
  theme,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateThemes
) {
  const request = await axiosLoggedRequest({
    method: "POST",
    url: "/themes",
    data: theme,
  });

  await postImageAdminTheme(axiosLoggedRequest, theme, request);

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateThemes,
    history,
    path
  );
}

async function putAdminTheme(
  axiosLoggedRequest,
  theme,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateThemes
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/themes/${theme.id}`,
    data: theme,
  });

  await postImageAdminTheme(axiosLoggedRequest, theme, request);

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateThemes,
    history,
    path
  );
}

async function putPublishedAdminTheme(
  axiosLoggedRequest,
  theme,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateThemes
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/scenarios/${theme.id}`,
    data: { ...theme, isPublished: true },
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateThemes,
    history,
    path
  );
}

async function deleteAdminTheme(
  axiosLoggedRequest,
  theme,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateThemes
) {
  const request = await axiosLoggedRequest({
    method: "DELETE",
    url: `/themes/${theme.id}`,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateThemes,
    history,
    path
  );
}

export {
  postAdminTheme,
  putAdminTheme,
  putPublishedAdminTheme,
  deleteAdminTheme,
};
