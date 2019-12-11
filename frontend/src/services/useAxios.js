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
    setRes({
      data: null,
      pending: true,
      error: false,
      complete: false
    });
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
    // eslint-disable-next-line
  }, [req.url]);

  return res;
}

export default useAxios;
