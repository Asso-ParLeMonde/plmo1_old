import { axiosRequest } from "../../../components/axiosRequest";

async function handleScenarioButtonRequest(
  type,
  scenario,
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
        url: `${process.env.REACT_APP_BASE_APP}/scenarios/${scenario.id}`,
        data: { ...scenario, isDefault: true }
      });
      break;
    case "DELETE":
      request = await axiosRequest({
        method: "DELETE",
        url: `${process.env.REACT_APP_BASE_APP}/themes/${scenario.themeId}/scenarios/${scenario.id}`
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
  history.push("/admin/scenarios");
}

export { handleScenarioButtonRequest };
