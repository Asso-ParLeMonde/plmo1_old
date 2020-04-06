import React, { useContext, useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router";
import PropTypes from "prop-types";
import { Typography, TextField, Button, withStyles } from "@material-ui/core";

import { UserServiceContext } from "../../../services/UserService";
import Notifications from "../../../components/Notifications";
import CustomModal from "../../../components/CustomModal";

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}))(Button);

function EditProjet(props) {
  const { isLoggedIn, axiosLoggedRequest } = useContext(UserServiceContext);
  const projectId = parseInt(props.location.pathname.split("/")[3], 10) || 0;
  const [project, setProject] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [res, setRes] = useState({ complete: false });

  const getProject = async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/projects/${projectId}`,
    });
    if (!response.error) {
      setProject(response.data);
    } else {
      props.history.push("/create");
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      return;
    }

    getProject().catch();
    // eslint-disable-next-line
  }, []);

  if (!isLoggedIn()) {
    return (
      <Redirect to={`/login?redirect=/create/edit-project/${projectId}`} />
    );
  }

  if (project === null) {
    return <div></div>;
  }

  const handleEditTitle = (event) => {
    setProject({ ...project, title: event.target.value.slice(0, 200) });
    setHasError(false);
  };

  const handleSaveProject = async (event) => {
    event.preventDefault();
    if (project.title.length === 0) {
      setHasError(true);
      return;
    }
    const response = await axiosLoggedRequest({
      method: "PUT",
      url: `/projects/${projectId}`,
      data: {
        title: project.title,
      },
    });
    if (!response.error) {
      setRes({
        complete: true,
        error: false,
        message: "Projet modifié !",
      });
    } else {
      setRes({
        complete: true,
        error: true,
        message: "Une erreur inconnue est survenue...",
      });
    }
  };

  const handleGoBack = (event) => {
    event.preventDefault();
    props.history.push(
      `/create/3-storyboard-and-filming-schedule?project=${projectId}`
    );
  };

  const toggleDeleteModal = (deleteProject) => async (event) => {
    event.preventDefault();
    setShowDeleteModal((s) => !s);

    if (deleteProject) {
      const response = await axiosLoggedRequest({
        method: "DELETE",
        url: `/projects/${projectId}`,
      });
      if (!response.error) {
        props.history.push("/create");
      } else {
        setRes({
          complete: true,
          error: true,
          message: "Une erreur inconnue est survenue...",
        });
      }
    }
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <div className="text-center" style={{ margin: "1rem 0" }}>
          <Typography
            color="primary"
            variant="h1"
            style={{ display: "inline" }}
          >
            Projet :
          </Typography>
          <Typography
            color="inherit"
            variant="h1"
            style={{ display: "inline", marginLeft: "0.5rem" }}
          >
            {project.title}
          </Typography>
        </div>
        <div className="text-center">
          <form
            className="login-form"
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
              onChange={handleEditTitle}
              variant="outlined"
              size="small"
              className={hasError ? "shake" : ""}
              error={hasError}
              helperText={hasError ? "Requis" : ""}
              fullWidth
            />
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              value="Submit"
              onClick={handleSaveProject}
            >
              Enregistrer
            </Button>

            <RedButton variant="outlined" onClick={toggleDeleteModal(false)}>
              Supprimer le projet
            </RedButton>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGoBack}
              style={{ margin: "4rem 0 2rem 0" }}
            >
              Retour
            </Button>
          </form>
        </div>
      </div>
      <CustomModal
        open={showDeleteModal}
        title="Supprimer le projet ?"
        cancelLabel="Annuler"
        confirmLabel="Supprimer le projet"
        onClose={toggleDeleteModal(false)}
        onConfirm={toggleDeleteModal(true)}
        ariaLabelledBy="delete-project-title"
        ariaDescribedBy="delete-project-desc"
        fullWidth
        error
      >
        <div id="delete-project-desc">
          <p>
            Voulez-vous vraiment supprimer le projet{" "}
            <strong>{project.title}</strong> ?
            <br />
            Attention ! Cette action est irréversible !
          </p>
        </div>
      </CustomModal>
      <Notifications res={res} />
    </div>
  );
}

EditProjet.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(EditProjet);
