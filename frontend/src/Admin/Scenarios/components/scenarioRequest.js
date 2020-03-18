import { axiosRequest } from "../../../components/axiosRequest";

async function postScenario(newScenario, setRes) {
  const request = await axiosRequest({
    method: "POST",
    url: `${process.env.REACT_APP_BASE_APP}/scenarios`,
    data: {
      names: newScenario.names,
      descriptions: newScenario.descriptions,
      themeId: newScenario.themeId,
      isDefault: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la creation du scenario"
    });
  }

  if (request.error === false && request.complete === true) {
    setRes({
      error: false,
      complete: true,
      message: "Success lors dans la creation du scenario"
    });
  }

  return;
}

async function putScenario(inheritedScenario, newScenario, setRes) {
  const request = await axiosRequest({
    method: "PUT",
    url: `${process.env.REACT_APP_BASE_APP}/scenarios/${inheritedScenario.id}`,
    data: {
      names: newScenario.names,
      descriptions: newScenario.descriptions,
      themeId: newScenario.themeId,
      isDefault: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification du scenario"
    });
  }

  if (request.error === false && request.complete === true) {
    setRes({
      error: false,
      complete: true,
      message: "Success lors dans la modification du scenario"
    });
  }

  return;
}

export { postScenario, putScenario };
