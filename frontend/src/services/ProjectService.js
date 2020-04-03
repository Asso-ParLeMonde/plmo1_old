import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import qs from "query-string";

import { TextField } from "@material-ui/core";

import useAxios from "./useAxios";
import { ThemesServiceContext } from "./ThemesService";
import { UserServiceContext } from "./UserService";
import CustomModal from "../components/CustomModal";

const ProjectServiceContext = React.createContext(undefined, undefined);

const DEFAULT_PROJECT = {
  id: null,
  themeId: null,
  themeName: "",
  scenarioId: null,
  scenarioName: "",
  languageCode: "fr",
  questions: []
};

const getInitialState = path => {
  if (
    path.slice(0, 26) !== "/create/2-questions-choice" &&
    path.slice(0, 41) !== "/create/3-storyboard-and-filming-schedule" &&
    path.slice(0, 24) !== "/create/4-to-your-camera"
  ) {
    return DEFAULT_PROJECT;
  }
  const lastProject = JSON.parse(localStorage.getItem("lastProject")) || {};
  const initialProject = {
    ...DEFAULT_PROJECT,
    ...lastProject
  };
  initialProject.questions = initialProject.questions.sort((a, b) =>
    a.index > b.index ? 1 : -1
  );
  if (initialProject.questions.length > 0) {
    initialProject.preventDataFetch = true;
  }
  return initialProject;
};

function ProjectService(props) {
  const { isLoggedIn, axiosLoggedRequest } = useContext(UserServiceContext);
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  const [project, setProject] = useState(() =>
    getInitialState(props.location.pathname)
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [modalCallback, setModalCallback] = useState(() => () => {});
  const [hasError, setHasError] = useState(false);

  const updateProject = updatedProject => {
    setProject(previousProject => {
      localStorage.setItem(
        "lastProject",
        JSON.stringify({ ...previousProject, ...updatedProject })
      );
      return { ...previousProject, ...updatedProject };
    });
  };

  const updateProjectFromId = async projectId => {
    if (!isLoggedIn()) {
      return;
    }
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/projects/${projectId}`
    });
    if (!response.error) {
      console.log(response.data);
      updateProject({
        id: response.data.id,
        themeId: response.data.theme.id,
        scenarioId: response.data.scenario.id,
        scenarioName: response.data.scenario.name,
        languageCode: response.data.scenario.languageCode,
        questions: response.data.questions.sort((a, b) =>
          a.index > b.index ? 1 : -1
        ),
        preventDataFetch: true
      });
    } else {
      props.history.push("/create");
    }
  };

  const askSaveProject = callback => {
    setModalCallback(() => callback);
    setShowSaveModal(true);
  };

  const saveProject = async () => {
    if (!isLoggedIn() || project.id !== null) {
      return;
    }
    const response = await axiosLoggedRequest({
      method: "POST",
      url: "/projects",
      data: project
    });
    if (!response.error) {
      updateProject({
        id: response.data.id,
        questions: response.data.questions
      });
    } else {
      console.log(response.data);
    }
  };

  useEffect(() => {
    // get project when projectId is not null
    const locationParams = qs.parse(props.location.search, {
      ignoreQueryPrefix: true
    });
    const projectId = parseInt(locationParams.project, 10) || project.id || 0;
    if (projectId !== 0) {
      if (!isLoggedIn()) {
        props.history.push(
          `/login?redirect=${encodeURI(
            `${props.location.pathname}?project=${projectId}`
          )}`
        );
      } else {
        updateProjectFromId(projectId).catch();
      }
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

  const handleToggleModal = save => async () => {
    if (save && (project.title || "").length === 0) {
      setHasError(true);
      return;
    }

    setHasError(false);
    setShowSaveModal(s => !s);
    if (save) {
      await saveProject();
    }
    if (typeof modalCallback === "function") {
      modalCallback(save);
    }
  };

  const updateProjectTitle = event => {
    event.preventDefault();
    updateProject({
      title: event.target.value.slice(0, 200)
    });
    setHasError(false);
  };

  return (
    <ProjectServiceContext.Provider
      value={{ project, updateProject, askSaveProject }}
    >
      {props.children}
      <CustomModal
        open={showSaveModal}
        title="Sauvegarder le projet ?"
        cancelLabel="Ne pas sauvegarder"
        confirmLabel="Sauvegarder le projet"
        onClose={handleToggleModal(false)}
        onConfirm={handleToggleModal(true)}
        noCloseOutsideModal
        ariaLabelledBy="save-project-title"
        ariaDescribedBy="save-project-form"
        fullWidth
      >
        <div id="save-project-form">
          <p>
            Enregistrer le projet vous permettra de le retrouver dans l'onglet
            "Mes vidéos" et également dans l'application Par Le Monde.
          </p>
          <form
            className="project-form"
            noValidate
            autoComplete="off"
            style={{ margin: "1rem 0" }}
          >
            <TextField
              id="project-name"
              name="project-name"
              type="text"
              color="secondary"
              label="Nom du projet"
              value={project.title || ""}
              onChange={updateProjectTitle}
              variant="outlined"
              size="small"
              className={hasError ? "shake" : ""}
              error={hasError}
              helperText={hasError ? "Requis" : ""}
              fullWidth
            />
          </form>
        </div>
      </CustomModal>
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
