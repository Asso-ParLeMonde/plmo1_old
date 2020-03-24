import React, { useCallback, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { UserServiceContext } from "./UserService";

const UsersServiceContext = React.createContext(undefined, undefined);

function UsersServiceProvider({ children }) {
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const [getUsers, setGetUsers] = useState({
    data: null,
    pending: null,
    error: null,
    complete: null
  });

  const updateUsers = useCallback(async () => {
    const usersRequest = await axiosLoggedRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/users`
    });

    setGetUsers(usersRequest);
  }, [axiosLoggedRequest]);

  useEffect(() => {
    updateUsers().catch();
  }, [updateUsers]);

  return (
    <UsersServiceContext.Provider value={{ getUsers, updateUsers }}>
      {children}
    </UsersServiceContext.Provider>
  );
}

UsersServiceProvider.propTypes = {
  children: PropTypes.any
};

export { UsersServiceContext, UsersServiceProvider };
