import axios from "axios";

const axiosRequest = async req => {
  let response = {
    data: null,
    pending: null,
    error: null,
    complete: null
  };

  await axios(req)
    .then(
      res =>
        (response = {
          data: res.data,
          pending: false,
          error: false,
          complete: true
        })
    )
    .catch(
      () =>
        (response = {
          data: null,
          pending: false,
          error: true,
          complete: true
        })
    );

  return response;
};

export { axiosRequest };
