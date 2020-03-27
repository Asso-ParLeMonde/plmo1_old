import React, { useState, useContext } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import { getQuestions } from "../../../util/questions";

import {
  Breadcrumbs,
  Hidden,
  Link,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/core/SvgIcon/SvgIcon";
import VideocamIcon from "@material-ui/icons/Videocam";

import { ProjectServiceContext } from "../../../services/ProjectService";
import Steps from "../../components/Steps";
import Inverted from "../../../components/Inverted";
import { UserServiceContext } from "../../../services/UserService";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

function Partie4(props) {
  const classes = useStyles();
  const { axiosLoggedRequest } = useContext(UserServiceContext);
  const { project } = useContext(ProjectServiceContext);
  const questions = getQuestions(project);
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async event => {
    event.preventDefault();
    setIsLoading(true);
    const response = await axiosLoggedRequest({
      method: "POST",
      url: "/project/pdf",
      data: {
        themeId: project.themeId,
        scenarioId: project.scenarioId,
        scenarioName: project.scenarioName,
        scenarioDescription: "",
        questions
      }
    });
    setIsLoading(false);
    if (response.complete && !response.error) {
      window.open(`${process.env.REACT_APP_BASE_APP}/pdf/${response.data.url}`);
    }
  };

  const handleHome = event => {
    event.preventDefault();
    props.history.push("/create");
  };

  return (
    <div>
      {project.themeId !== null && project.scenarioId !== null && (
        <React.Fragment>
          <Hidden smDown>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link color="inherit" href="/create" onClick={handleHome}>
                Tout les thèmes
              </Link>
              <Typography color="textPrimary">{project.themeName}</Typography>
            </Breadcrumbs>
          </Hidden>

          <Steps activeStep={3} />

          <div
            style={{
              maxWidth: "1000px",
              margin: "auto",
              paddingBottom: "2rem"
            }}
          >
            <Typography color="primary" variant="h1">
              <Inverted round>4</Inverted> À votre <Inverted>caméra</Inverted> !
              <VideocamIcon
                fontSize="large"
                color="primary"
                style={{
                  transform: "translateY(0.5rem)",
                  marginLeft: "1.5rem"
                }}
              />
            </Typography>

            <Backdrop
              className={classes.backdrop}
              open={isLoading}
              onClick={() => {}}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Typography variant="h2" style={{ marginBottom: "1rem" }}>
              Téléchargez votre plan de tournage :
            </Typography>
            <div className="text-center">
              <Button
                className="mobile-full-width"
                variant="contained"
                color="secondary"
                onClick={generatePDF}
              >
                plan de tournage
              </Button>
            </div>

            <Typography variant="h2" style={{ margin: "1rem 0" }}>
              Flashez ce code QR pour accéder directement à l&apos;application
              et commencer à filmer !
            </Typography>
            <div className="text-center">
              <QRCode
                size={192}
                value="https://par-le-monde-1.herokuapp.com/create/4-to-your-camera"
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

Partie4.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie4);
