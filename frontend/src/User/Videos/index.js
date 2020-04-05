import React, { useContext, useState, useEffect } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import Inverted from "../../components/Inverted";

import { UserServiceContext } from "../../services/UserService";
import { ThemesServiceContext } from "../../services/ThemesService";
import WorkInProgressCard from "./components/WorkInProgressCard";
import "./videos.css";
import { Redirect } from "react-router";

function Videos(props) {
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const themesRequest = useContext(ThemesServiceContext).getThemes;
  const [projects, setProjects] = useState(null);
  const [themes, setThemes] = useState({});

  const getProjects = async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: "/projects",
    });
    if (!response.error) {
      setProjects(response.data);
    } else {
      setProjects([]);
    }
  };

  // get projects
  useEffect(() => {
    if (!isLoggedIn()) {
      return;
    }
    getProjects().catch();
  }, []);

  // get themes
  useEffect(() => {
    if (themesRequest.complete && !themesRequest.error) {
      setThemes(
        themesRequest.data.reduce(
          (themesMap, theme) => ({
            ...themesMap,
            [theme.id]: theme,
          }),
          {}
        )
      );
    }
  }, [themesRequest]);

  if (!isLoggedIn()) {
    return <Redirect to="/login?redirect=/my-videos" />;
  }

  if (projects === null) {
    return (
      <div>
        <Typography color="primary" variant="h1">
          Mes <Inverted>supers</Inverted> vidéos
        </Typography>
      </div>
    );
  }

  const handleWipProjectClick = (projectId) => (event) => {
    event.preventDefault();
    props.history.push(
      `/create/3-storyboard-and-filming-schedule?project=${projectId}`
    );
  };

  const handleNewProjectClick = (event) => {
    event.preventDefault();
    props.history.push("/create");
  };

  return (
    <div>
      <Typography color="primary" variant="h1">
        Mes <Inverted>supers</Inverted> vidéos
      </Typography>
      <Typography color="inherit" variant="h2">
        Mes projets en cours
      </Typography>
      <div className="wip-videos">
        {projects.length > 0 ? (
          <React.Fragment>
            {projects.map((p) => (
              <WorkInProgressCard
                key={p.id}
                title={p.title || ""}
                theme={themes[(p.theme || { id: 0 }).id] || {}}
                onClick={handleWipProjectClick(p.id)}
              />
            ))}
          </React.Fragment>
        ) : (
          <WorkInProgressCard
            title="Vous n'avez pas encore de projet en cours. En créer un ?"
            onClick={handleNewProjectClick}
          />
        )}
      </div>
      <Typography color="inherit" variant="h2">
        Mes projets terminés
      </Typography>
    </div>
  );
}

Videos.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Videos);
