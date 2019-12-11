import axios from "axios";

function axiosRequest(req, setRes) {
  axios(req)
    .then(res =>
      setRes({
        data: res.data,
        pending: false,
        error: false,
        complete: true
      })
    )
    .catch(() =>
      setRes({
        data: null,
        pending: false,
        error: true,
        complete: true
      })
    );
}

export { axiosRequest };
