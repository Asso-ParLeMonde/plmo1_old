import { axiosRequest } from "../../components/axiosRequest";

async function themeImagePOSTRequest(newTheme, requestedThemeId, setRes) {
  const bodyFormData = new FormData();
  bodyFormData.append("image", newTheme.image);

  const requestImage = await axiosRequest({
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    url: `${process.env.REACT_APP_BASE_APP}/themes/${requestedThemeId}/image`,
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

async function postTheme(newTheme, setRes) {
  const request = await axiosRequest({
    method: "POST",
    url: `${process.env.REACT_APP_BASE_APP}/themes`,
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

async function putTheme(inheritedTheme, newTheme, setRes) {
  const request = await axiosRequest({
    method: "PUT",
    url: `${process.env.REACT_APP_BASE_APP}/themes/${inheritedTheme.id}`,
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

async function updateTheme(requestType, inheritedTheme, newTheme, setRes) {
  let error = false;
  let requestedThemeId = undefined;

  switch (requestType) {
    default:
      break;
    case "POST":
      [requestedThemeId, error] = await postTheme(newTheme, setRes);
      break;
    case "PUT":
      [requestedThemeId, error] = await putTheme(
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
    error = await themeImagePOSTRequest(newTheme, requestedThemeId, setRes);
  }

  return error;
}

export { updateTheme };
