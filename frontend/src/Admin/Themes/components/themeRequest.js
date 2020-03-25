async function themeImagePOSTRequest(
  axiosLoggedRequest,
  newTheme,
  requestedThemeId,
  setRes
) {
  const bodyFormData = new FormData();
  bodyFormData.append("image", newTheme.image);

  const requestImage = await axiosLoggedRequest({
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    url: `/themes/${requestedThemeId}/image`,
    data: bodyFormData
  });

  if (requestImage.error === true && requestImage.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification de l'image du theme"
    });

    return true;
  }

  return false;
}

async function postTheme(axiosLoggedRequest, newTheme, setRes) {
  const request = await axiosLoggedRequest({
    method: "POST",
    url: "/themes",
    data: {
      names: newTheme.names,
      isPublished: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la creation du theme"
    });

    return [undefined, true];
  }

  return [request.data.id, false];
}

async function putTheme(axiosLoggedRequest, inheritedTheme, newTheme, setRes) {
  const request = await axiosLoggedRequest({
    method: "PUT",
    url: `/themes/${inheritedTheme.id}`,
    data: {
      names: newTheme.names,
      isPublished: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification du theme"
    });

    return [undefined, true];
  }

  return [request.data.id, false];
}

async function updateTheme(
  axiosLoggedRequest,
  requestType,
  inheritedTheme,
  newTheme,
  setRes
) {
  let error = false;
  let requestedThemeId = undefined;

  switch (requestType) {
    default:
      break;
    case "POST":
      [requestedThemeId, error] = await postTheme(
        axiosLoggedRequest,
        newTheme,
        setRes
      );
      break;
    case "PUT":
      [requestedThemeId, error] = await putTheme(
        axiosLoggedRequest,
        inheritedTheme,
        newTheme,
        setRes
      );
      break;
  }

  if (
    (requestType === "PUT" || requestType === "POST") &&
    error === false &&
    newTheme.image !== undefined &&
    newTheme.image !== null &&
    newTheme.image.path === undefined
  ) {
    error = await themeImagePOSTRequest(
      axiosLoggedRequest,
      newTheme,
      requestedThemeId,
      setRes
    );
  }

  return error;
}

export { updateTheme };
