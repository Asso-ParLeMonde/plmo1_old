import { axiosRequest } from "../../components/axiosRequest";

async function languageImagePOSTRequest(newLanguage, requestedLanguageId, setRes) {
  const bodyFormData = new FormData();
  bodyFormData.append("image", newLanguage.image);

  const requestImage = await axiosRequest({
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    url: `${process.env.REACT_APP_BASE_APP}/languages/${requestedLanguageId}/image`,
    data: bodyFormData
  });

  if (requestImage.error === true && requestImage.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification de l'image du langage"
    });

    return true;
  }

  return false;
}

async function postLanguage(newLanguage, setRes) {
  const request = await axiosRequest({
    method: "POST",
    url: `${process.env.REACT_APP_BASE_APP}/languages`,
    data: {
      names: newLanguage.names,
      isPublished: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la creation du langage"
    });

    return [undefined, true];
  }

  return [request.data.id, false];
}

async function putLanguage(inheritedLanguage, newLanguage, setRes) {
  const request = await axiosRequest({
    method: "PUT",
    url: `${process.env.REACT_APP_BASE_APP}/languages/${inheritedLanguage.id}`,
    data: {
      names: newLanguage.names,
      isPublished: true
    }
  });

  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: "Erreur lors de la modification du langage"
    });

    return [undefined, true];
  }

  return [request.data.id, false];
}

async function updateLanguage(requestType, inheritedLanguage, newLanguage, setRes) {
  let error = false;
  let requestedLanguageId = undefined;

  switch (requestType) {
    default:
      break;
    case "POST":
      [requestedLanguageId, error] = await postLanguage(newLanguage, setRes);
      break;
    case "PUT":
      [requestedLanguageId, error] = await putLanguage(
        inheritedLanguage,
        newLanguage,
        setRes
      );
      break;
  }

  if (
    (requestType === "PUT" || requestType === "POST") &&
    error === false &&
    newLanguage.image !== undefined &&
    newLanguage.image !== null &&
    newLanguage.image.path === undefined
  ) {
    error = await languageImagePOSTRequest(newLanguage, requestedLanguageId, setRes);
  }

  return error;
}

export { updateLanguage };
