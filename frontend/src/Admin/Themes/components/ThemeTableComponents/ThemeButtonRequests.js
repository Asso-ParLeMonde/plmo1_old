async function handleRequest(
  axiosLoggedRequest,
  type,
  theme,
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
        url: `/themes/${theme.id}`,
        data: {
          names: theme.names,
          image: theme.image,
          isPublished: true
        }
      });
      break;
    case "DELETE":
      request = await axiosLoggedRequest({
        method: "DELETE",
        url: `/themes/${theme.id}`
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
  history.push("/admin/themes");
}

export { handleRequest };
