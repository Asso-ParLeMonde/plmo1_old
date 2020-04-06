function updateNotificationResponse(
  request,
  setRes,
  successMessage,
  errorMessage,
  updateElements,
  history,
  path
) {
  if (request.error === true && request.complete === true) {
    setRes({
      error: true,
      complete: true,
      message: errorMessage,
    });
  }

  if (request.error === false && request.complete === true) {
    setRes({
      error: false,
      complete: true,
      message: successMessage,
    });
  }

  updateElements().catch();
  history.push(path);
}

export { updateNotificationResponse };
