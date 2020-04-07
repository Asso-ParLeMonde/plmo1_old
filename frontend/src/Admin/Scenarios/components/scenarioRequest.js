import { updateNotificationResponse } from "../../components/updateNotificationResponse";

const path = "/admin/scenarios";

async function postAdminScenario(
  axiosLoggedRequest,
  scenario,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateScenarios
) {
  const request = await axiosLoggedRequest({
    method: "POST",
    url: "/scenarios",
    data: scenario,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateScenarios,
    history,
    path
  );
}

async function putAdminScenario(
  axiosLoggedRequest,
  scenario,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateScenarios
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/scenarios/${scenario.id}`,
    data: scenario,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateScenarios,
    history,
    path
  );
}

async function putDefaultAdminScenario(
  axiosLoggedRequest,
  scenario,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateScenarios
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/scenarios/${scenario.id}`,
    data: { ...scenario, isDefault: true },
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateScenarios,
    history,
    path
  );
}

async function deleteAdminScenario(
  axiosLoggedRequest,
  scenario,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateScenarios
) {
  const request = await axiosLoggedRequest({
    method: "DELETE",
    url: `/themes/${scenario.themeId}/scenarios/${scenario.id}`,
  });

  updateNotificationResponse(
    request,
    setRes,
    successMessage,
    errorMessage,
    updateScenarios,
    history,
    path
  );
}

export {
  postAdminScenario,
  putAdminScenario,
  putDefaultAdminScenario,
  deleteAdminScenario,
};
