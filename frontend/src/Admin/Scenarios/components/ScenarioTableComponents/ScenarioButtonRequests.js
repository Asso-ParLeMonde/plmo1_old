async function handleScenarioButtonRequest(
  axiosLoggedRequest,
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
      request = await axiosLoggedRequest({
        method: "PUT",
        url: `/scenarios/${scenario.id}`,
        data: { ...scenario, isDefault: true }
      });
      break;
    case "DELETE":
      request = await axiosLoggedRequest({
        method: "DELETE",
        url: `/themes/${scenario.themeId}/scenarios/${scenario.id}`
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
