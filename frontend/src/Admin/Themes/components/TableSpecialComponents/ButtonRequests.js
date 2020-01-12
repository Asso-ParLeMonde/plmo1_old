import { axiosRequest } from "../../../components/axiosRequest";

async function handleRequest(
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
      request = await axiosRequest({
        method: "PUT",
        url: `${process.env.REACT_APP_BASE_APP}/themes/${theme.id}`,
        data: {
          names: theme.names,
          image: theme.image,
          isPublished: true
        }
      });
      break;
    case "DELETE":
      request = await axiosRequest({
        method: "DELETE",
        url: `${process.env.REACT_APP_BASE_APP}/themes/${theme.id}`
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
