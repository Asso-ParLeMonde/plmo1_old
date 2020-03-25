import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../components/axiosRequest";
import Notifications from "../components/Notifications";

const UserServiceContext = React.createContext(undefined, undefined);

function getCacheUser() {
  return JSON.parse(localStorage.getItem("user")) || null;
}
function getCacheToken() {
  return localStorage.getItem("token") || "";
}

function UserServiceProvider(props) {
  const [user, setUser] = useState(getCacheUser());
  const [token, setToken] = useState(getCacheToken());
  const [res, setRes] = useState({ complete: false });

  useEffect(() => {
    if (token.length > 0) {
      setRes({
        complete: true,
        error: false,
        message: `Bienvenue ${user.pseudo} !`
      });
    }
    // eslint-disable-next-line
  }, [token]);

  /**
   * Login the user with username and password.
   * Return a number 0 -> success or not.
   * @param username
   * @param password
   * @param localSave
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const login = async (username, password, localSave = false) => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login",
      data: {
        username,
        password
      }
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0
      };
    }
    setUser(response.data.user || null);
    setToken(response.data.token || "");
    if (localSave) {
      localStorage.setItem("user", JSON.stringify(response.data.user || null));
      localStorage.setItem("token", response.data.token || "");
    }
    return {
      success: true,
      errorCode: 0
    };
  };

  /**
   * Signup the user.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const signup = async user => {
    const response = await axiosRequest({
      method: "POST",
      url: "/users",
      data: {
        ...user
      }
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0
      };
    }
    setUser(response.data.user || null);
    setToken(response.data.token || "");
    return {
      success: true,
      errorCode: 0
    };
  };

  /**
   * Updates the user password.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const updatePassword = async user => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login/update-password",
      data: {
        ...user
      }
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0
      };
    }
    setUser(response.data.user || null);
    setToken(response.data.token || "");
    return {
      success: true,
      errorCode: 0
    };
  };

  /**
   * Verifies the user email.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const verifyEmail = async user => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login/verify-email",
      data: {
        ...user
      }
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0
      };
    }
    setUser(response.data.user || null);
    setToken(response.data.token || "");
    return {
      success: true,
      errorCode: 0
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
  const axiosLoggedRequest = async req => {
    return await axiosRequest(req, token);
  };

  return (
    <UserServiceContext.Provider
      value={{
        user,
        login,
        isLoggedIn,
        axiosLoggedRequest,
        signup,
        updatePassword,
        verifyEmail
      }}
    >
      {props.children}
      <Notifications res={res} />
    </UserServiceContext.Provider>
  );
}

UserServiceProvider.propTypes = {
  children: PropTypes.any
};

export { UserServiceContext, UserServiceProvider };
