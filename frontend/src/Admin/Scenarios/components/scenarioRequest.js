async function postScenario(axiosLoggedRequest, newScenario, setRes) {
  const request = await axiosLoggedRequest({
    method: "POST",
    url: "/scenarios",
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
      message: "Succès lors dans la creation du scenario"
    });
  }

  return;
}

async function putScenario(
  axiosLoggedRequest,
  inheritedScenario,
  newScenario,
  setRes
) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/scenarios/${inheritedScenario.id}`,
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
      message: "Succès lors dans la modification du scenario"
    });
  }

  return;
}

export { postScenario, putScenario };
