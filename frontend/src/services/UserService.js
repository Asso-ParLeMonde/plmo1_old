import React, { useState } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { axiosRequest } from "../components/axiosRequest";
import Notifications from "../components/Notifications";
import { useTranslation } from "react-i18next";

const UserServiceContext = React.createContext(undefined, undefined);

function sessionExpired() {
  const expiresAt = localStorage.getItem("expiresAt") || null;
  const refreshToken = localStorage.getItem("refreshToken") || null;
  if (expiresAt === null) {
    return refreshToken === null;
  }
  return new Date().getTime() > expiresAt && refreshToken === null;
}

function getCacheUser() {
  if (sessionExpired()) {
    return null;
  }
  return JSON.parse(localStorage.getItem("user")) || null;
}
function getCacheToken() {
  if (sessionExpired()) {
    return "";
  }
  return localStorage.getItem("accessToken") || "";
}

function UserServiceProviderWithRouter(props) {
  const { t } = useTranslation();
  const [user, setUser] = useState(getCacheUser());
  const [token, setToken] = useState(getCacheToken());
  const [res, setRes] = useState({ complete: false });

  const updateToken = (user, accessToken) => {
    setToken(accessToken || "");
    setUser(user || null);
    localStorage.setItem("user", JSON.stringify(user || null));
    localStorage.setItem("accessToken", accessToken || "");
    localStorage.setItem("expiresAt", new Date().getTime() + 3540000);
    localStorage.removeItem("scenarios");
    localStorage.removeItem("localThemes");
  };

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
        password,
        getRefreshToken: localSave,
      },
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }

    updateToken(response.data.user, response.data.accessToken);

    if (localSave && response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken || "");
    }

    setRes({
      complete: true,
      error: false,
      message: t("welcome_message", { pseudo: response.data.user.pseudo }),
    });

    return {
      success: true,
      errorCode: 0,
    };
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken") || null;
    if (refreshToken !== null) {
      await axiosRequest({
        method: "POST",
        url: "/login/token/reject",
        data: {
          refreshToken,
          userId: user.id,
        },
      });
    }
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("refreshToken");
    props.history.push("/");
  };

  /**
   * Signup the user.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const signup = async (user, inviteCode = undefined) => {
    const response = await axiosRequest({
      method: "POST",
      url: "/users",
      data: {
        inviteCode,
        ...user,
      },
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }
    updateToken(response.data.user, response.data.accessToken);
    return {
      success: true,
      errorCode: 0,
    };
  };

  /**
   * Updates the user password.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const updatePassword = async (user) => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login/update-password",
      data: {
        ...user,
      },
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }
    updateToken(response.data.user, response.data.accessToken);
    return {
      success: true,
      errorCode: 0,
    };
  };

  /**
   * Verifies the user email.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const verifyEmail = async (user) => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login/verify-email",
      data: {
        ...user,
      },
    });
    if (response.error && response.complete) {
      return {
        success: false,
        errorCode: response.data.errorCode || 0,
      };
    }
    updateToken(response.data.user, response.data.accessToken);
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

  const logoutSessionExpired = async () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("refreshToken");
    setRes({
      complete: true,
      error: true,
      message: "Une erreur est survenue, veuillez vous reconnecter",
    });
    props.history.push(`/login?redirect=${encodeURI(props.location.pathname)}`);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken") || null;
    if (refreshToken === null) {
      return null;
    }
    const response = await axiosRequest({
      method: "POST",
      url: "/login/token",
      data: {
        refreshToken,
        userId: user.id,
      },
    });
    if (response.error) {
      return null;
    }
    setToken(response.data.accessToken || "");
    localStorage.setItem("accessToken", response.data.accessToken || "");
    localStorage.setItem("expiresAt", new Date().getTime() + 3540000);
    return response.data.accessToken;
  };

  /**
   * Do an Axios request to the backend with the user token.
   * @param req
   * @returns {Promise<{data, pending, error, complete}>}
   */
  const axiosLoggedRequest = async (req) => {
    const response = await axiosRequest(req, token);
    // User token is invalid
    if (response.error && response.status === 401) {
      // try refresh the session
      const newToken = await refreshAccessToken();
      if (newToken !== null) {
        const response2 = await axiosRequest(req, newToken);
        if (!response2.error || response2.status !== 401) {
          return response2;
        }
      }
      logoutSessionExpired();
    }
    return response;
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
        verifyEmail,
        logout,
      }}
    >
      {props.children}
      <Notifications res={res} />
    </UserServiceContext.Provider>
  );
}

UserServiceProviderWithRouter.propTypes = {
  children: PropTypes.any,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

const UserServiceProvider = withRouter(UserServiceProviderWithRouter);

export { UserServiceContext, UserServiceProvider };
