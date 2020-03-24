import axios from "axios";

const axiosRequest = async req => {
  try {
    const res = await axios({
      ...req,
      baseURL: process.env.REACT_APP_BASE_APP
    });
    return {
      data: res.data,
      pending: false,
      error: false,
      complete: true
    };
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
    } else {
      console.log(error);
    }
    return {
      data: error.response ? error.response.data || null : null,
      pending: false,
      error: true,
      complete: true
    };
  }
};

export { axiosRequest };
