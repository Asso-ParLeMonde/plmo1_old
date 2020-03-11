import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../components/axiosRequest";

const UsersServiceContext = React.createContext(undefined, undefined);

function UsersServiceProvider({ children }) {
  const [getUsers, setGetUsers] = useState({
    data: null,
    pendint: null,
    error: null,
    complete: null
  });

  const updateUsers = useCallback(async () => {
    const usersRequest = await axiosRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/users`
    });

    setGetUsers(usersRequest);
  }, []);

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
