import { axiosRequest } from "../../components/axiosRequest";

async function postScenario(newScenario, setRes) {
  const request = await axiosRequest({
    method: "POST",
    url: `${process.env.REACT_APP_BASE_APP}/scenarios`,
    data: {
      names: newScenario.names,
      description: newScenario.description,
      isPublished: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la creation du scenario"
    });

    return true;
  }

  return false;
}

async function putScenario(inheritedScenario, newScenario, setRes) {
  const request = await axiosRequest({
    method: "PUT",
    url: `${process.env.REACT_APP_BASE_APP}/scenarios/${inheritedScenario.id}`,
    data: {
      names: newScenario.names,
      description: newScenario.description,
      isPublished: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification du scenario"
    });

    return true;
  }

  return false;
}

async function updateScenario(
  requestType,
  inheritedScenario,
  newScenario,
  setRes
) {
  let error = false;

  switch (requestType) {
    default:
      break;
    case "POST":
      error = await postScenario(newScenario, setRes);
      break;
    case "PUT":
      error = await putScenario(inheritedScenario, newScenario, setRes);
      break;
  }

  return error;
}

export { updateScenario };
