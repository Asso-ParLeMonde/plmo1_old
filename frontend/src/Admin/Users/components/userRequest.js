async function postUser(axiosLoggedRequest, newUser, setRes) {
  const request = await axiosLoggedRequest({
    method: "POST",
    url: "/users",
    data: newUser
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la creation de la utilisateur"
    });

    return true;
  }

  return false;
}

async function putUser(axiosLoggedRequest, inheritedUser, newUser, setRes) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/users/${inheritedUser.id}`,
    data: newUser
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification de la utilisateur"
    });

    return true;
  }

  return false;
}

async function updateUser(
  axiosLoggedRequest,
  requestType,
  inheritedUser,
  newUser,
  setRes
) {
  let error = false;

  switch (requestType) {
    default:
      break;
    case "POST":
      error = await postUser(axiosLoggedRequest, newUser, setRes);
      break;
    case "PUT":
      error = await putUser(axiosLoggedRequest, inheritedUser, newUser, setRes);
      break;
  }

  return error;
}

export { updateUser };
