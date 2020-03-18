import React, {useState} from "react";
import PropTypes from "prop-types";
import {axiosRequest} from "../components/axiosRequest";

const UserServiceContext = React.createContext(undefined, undefined);

function UserServiceProvider(props) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  /**
   * Login the user with username and password.
   * Return a number 0 -> success or not.
   * @param username
   * @param password
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const login = async (username, password) => {
    const response = await axiosRequest({
      method: "POST",
      baseURL: process.env.REACT_APP_BASE_APP,
      url: "/login",
      data: {
        username,
        password,
      },
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }
    setUser(response.data.user || null);
    setToken(response.data.token || "");
    return {
      success: true,
      errorCode: 0,
    };
  };

  /**
   * Returns if the user is loggedIn
   * @returns {boolean}
   */
  const isLoggedIn = () => {
    return user !== null;
  };

  /**
   * Do an Axios request to the backend with the user token.
   * @param req
   * @returns {Promise<{data, pending, error, complete}>}
   */
  const axiosLoggedRequest = async (req) => {
    return await axiosRequest({
      ...req,
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
  };

  return (
    <UserServiceContext.Provider value={{ user, login, isLoggedIn, axiosLoggedRequest }}>
      {props.children}
    </UserServiceContext.Provider>
  );
}

UserServiceProvider.propTypes = {
  children: PropTypes.any,
};

export { UserServiceContext, UserServiceProvider };
