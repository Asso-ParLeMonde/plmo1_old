async function handleRequest(
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
