import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import qs from "query-string";
import { ThemesServiceContext } from "./ThemesService";
import useAxios from "./useAxios";

const ProjectServiceContext = React.createContext(undefined, undefined);

const getInitialState = () => {
  const lastProject = JSON.parse(localStorage.getItem("lastProject")) || {};
  const initialProject = {
    ...{
      themeId: null,
      themeName: "",
      scenarioId: null,
      scenarioName: "",
      languageCode: "fr",
      questions: []
    },
    ...lastProject
  };
  if (initialProject.questions.length > 0) {
    initialProject.preventDataFetch = true;
  }
  return initialProject;
};

function ProjectService(props) {
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  const [project, setProject] = useState(getInitialState());

  const updateProject = updatedProject => {
    setProject(previousProject => {
      localStorage.setItem(
        "lastProject",
        JSON.stringify({ ...previousProject, ...updatedProject })
      );
      return { ...previousProject, ...updatedProject };
    });
  };

  useEffect(() => {
    // update project base on location
    const themeId =
      parseInt(
        qs.parse(props.location.search, { ignoreQueryPrefix: true }).themeId
      ) || null;
    const scenarioId =
      parseInt(
        qs.parse(props.location.search, { ignoreQueryPrefix: true }).scenarioId
      ) || null;
    if (project.themeId !== themeId && themeId !== null) {
      updateProject({ themeId });
    }
    if (project.scenarioId !== scenarioId && scenarioId !== null) {
      updateProject({ scenarioId });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // update theme name when themeId change
    if (
      project.themeId !== null &&
      themesRequest.complete &&
      !themesRequest.error
    ) {
      const themeIndex = themesRequest.data.reduce(
        (i1, t, i2) => (t.id === project.themeId ? i2 : i1),
        -1
      );
      if (themeIndex === -1) {
        updateProject({ themeId: null, scenarioId: null });
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
    url:
      project.scenarioId === null
        ? null
        : `/scenarios/${project.scenarioId}_${project.languageCode}/questions/?isDefault=true`
  });
  useEffect(() => {
    // Get questions when scenarioId change
    if (
      project.scenarioId !== null &&
      getQuestions.complete &&
      !getQuestions.error
    ) {
      if (project.preventDataFetch) {
        updateProject({ preventDataFetch: false });
        return;
      }
      updateProject({ questions: getQuestions.data });
    }
    // eslint-disable-next-line
  }, [project.scenarioId, getQuestions]);

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
