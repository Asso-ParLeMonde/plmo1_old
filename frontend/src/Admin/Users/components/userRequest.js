import { updateNotificationResponse } from "../../components/updateNotificationResponse";

const path = "/admin/users";

async function postAdminUser(
  axiosLoggedRequest,
  user,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateUsers
) {
  const request = await axiosLoggedRequest({
    method: "POST",
    url: "/users",
    data: user,
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

async function putAdminUser(
  axiosLoggedRequest,
  user,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateUsers
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/users/${user.id}`,
    data: user,
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

async function deleteAdminUser(
  axiosLoggedRequest,
  user,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateUsers
) {
  const request = await axiosLoggedRequest({
    method: "DELETE",
    url: `/users/${user.id}`,
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

export { postAdminUser, putAdminUser, deleteAdminUser };
