import { axiosRequest } from "../../../../components/axiosRequest";

async function handleRequest(
  user,
  setRes,
  successMessage,
  errorMessage,
  history,
  updateUsers
) {
  const request = await axiosRequest({
    method: "DELETE",
    url: `/users/${user.id}`
  });

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

  updateUsers().catch();
  history.push("/admin/users");
}

export { handleRequest };
