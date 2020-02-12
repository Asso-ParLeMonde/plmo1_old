import React, {useContext, useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import qs from "query-string";
import { ThemesServiceContext } from "./ThemesService";
import useAxios from "./useAxios";

const ProjectServiceContext = React.createContext(undefined, undefined);

function ProjectService(props) {
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  const [project, setProject] = useState({
    themeId: null,
    themeName: '',
    scenarioId: null,
    languageCode: 'fr',
    questions: []
  });

  const updateProject = updatedProject => {
    // TODO, update project in a cookie.
    // eslint-disable-next-line no-console
    console.log(updatedProject);
    setProject(previousProject => ({ ...previousProject, ...updatedProject }));
  };

  useEffect(() => { // update project base on location search and cookies
    if (project.themeId === null) {
      const themeId = parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).themeId) || null;
      updateProject({ themeId });
    }
    if (project.scenarioId === null) {
      const scenarioId = parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).scenarioId) || null;
      updateProject({ scenarioId });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (project.themeId !== null && themesRequest.complete && !themesRequest.error) {
      const themeId = parseInt(qs.parse(props.location.search, { ignoreQueryPrefix: true }).themeId) || 0;
      const themeIndex = themesRequest.data.reduce((i1, t, i2) => t.id === themeId ? i2 : i1, -1);
      if (themeIndex === -1) {
        props.history.push("/");
      } else {
        const theme = themesRequest.data[themeIndex];
        updateProject({ themeId: theme.id, themeName: theme.names.fr });
      }
    }
    // eslint-disable-next-line
  }, [project.themeId, themesRequest]);

  const getQuestions = useAxios({
    method: "GET",
    url: project.scenarioId === null ? null : `${process.env.REACT_APP_BASE_APP}/scenarios/${project.scenarioId}_${project.languageCode}/questions/?isDefault=true`,
  });
  useEffect(() => { // Get questions
    if (getQuestions.complete && !getQuestions.error) {
      updateProject({ questions: getQuestions.data });
    }
  }, [getQuestions]);

  return (
    <ProjectServiceContext.Provider value={{ project, updateProject }}>
      {props.children}
    </ProjectServiceContext.Provider>
  );
}

ProjectService.propTypes = {
  children: PropTypes.any,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const ProjectServiceProvider = withRouter(ProjectService);

export { ProjectServiceContext, ProjectServiceProvider };
