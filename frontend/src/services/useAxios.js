import { useState, useEffect } from "react";
import axios from "axios";

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
    setRes({
      data: null,
      pending: true,
      error: false,
      complete: false
    });
    if (req.url !== null) {
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
    // eslint-disable-next-line
  }, [req.url]);

  return res;
}

export default useAxios;
