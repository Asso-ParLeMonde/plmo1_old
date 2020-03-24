import { axiosRequest } from "../../../components/axiosRequest";

async function postUser(newUser, setRes) {
  const request = await axiosRequest({
    method: "POST",
    url: `${process.env.REACT_APP_BASE_APP}/users`,
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

async function putUser(inheritedUser, newUser, setRes) {
  const request = await axiosRequest({
    method: "PUT",
    url: `${process.env.REACT_APP_BASE_APP}/users/${inheritedUser.id}`,
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

async function updateUser(requestType, inheritedUser, newUser, setRes) {
  let error = false;

  switch (requestType) {
    default:
      break;
    case "POST":
      error = await postUser(newUser, setRes);
      break;
    case "PUT":
      error = await putUser(inheritedUser, newUser, setRes);
      break;
  }

  return error;
}

export { updateUser };
