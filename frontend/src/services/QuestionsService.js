import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosRequest } from "../Admin/components/axiosRequest";

const QuestionsServiceContext = React.createContext(undefined, undefined);

function QuestionsServiceProvider({ children, isDefault }) {
  const [getQuestions, setGetQuestions] = useState({
    data: null,
    pendint: null,
    error: null,
    complete: null
  });

  const updateQuestions = useCallback(async () => {
    const questionsRequest = await axiosRequest({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_APP}/questions?default=${isDefault}`
    });
    setGetQuestions(questionsRequest);
  }, [isDefault]);

  useEffect(() => {
    updateQuestions().catch();
  }, [updateQuestions]);

  return (
    <QuestionsServiceContext.Provider value={{ getQuestions, updateQuestions }}>
      {children}
    </QuestionsServiceContext.Provider>
  );
}

QuestionsServiceProvider.propTypes = {
  children: PropTypes.any,
  isDefault: PropTypes.bool
};

QuestionsServiceProvider.defaultProps = {
  isDefault: null
};

export { QuestionsServiceContext, QuestionsServiceProvider };
