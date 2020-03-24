import { useState, useEffect } from "react";
import { axiosRequest } from "../components/axiosRequest";

function useAxios(req) {
  const [res, setRes] = useState({
    data: null,
    complete: false,
    pending: false,
    error: false
  });

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(req.url);
    if (req.url !== null) {
      setRes({
        data: null,
        pending: true,
        error: false,
        complete: false
      });
      axiosRequest(req)
        .then(r => setRes(r))
        .catch(() =>
          setRes({
            data: null,
            pending: false,
            error: true,
            complete: true
          })
        );
    }
    // eslint-disable-next-line
  }, [req.url]);

  return res;
}

export default useAxios;
