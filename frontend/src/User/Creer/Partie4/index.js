import React, {useContext} from "react";
import {withRouter} from "react-router";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";

import {Breadcrumbs, Hidden, Link, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/core/SvgIcon/SvgIcon";
import VideocamIcon from '@material-ui/icons/Videocam';

import {ProjectServiceContext} from "../../../services/ProjectService";
import Steps from "../../components/Steps";
import Inverted from "../../../components/Inverted";


function Partie4(props) {
  const { project } = useContext(ProjectServiceContext);

  const handleHome = (event) => {
    event.preventDefault();
    props.history.push("/creer");
  };

  return (
    <div>
      {
        project.themeId !== null && project.scenarioId !== null && (
          <React.Fragment>
            <Hidden smDown>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>} aria-label="breadcrumb">
                <Link color="inherit" href="/creer" onClick={handleHome}>
                  Tout les thèmes
                </Link>
                <Typography color="textPrimary">{project.themeName}</Typography>
              </Breadcrumbs>
            </Hidden>

            <Steps activeStep={3}/>

            <div style={{ maxWidth: "1000px", margin: "auto", paddingBottom: "2rem" }}>
              <Typography color="primary" variant="h1">
                <Inverted round>4</Inverted> À votre <Inverted>caméra</Inverted> !
                <VideocamIcon fontSize="large" color="primary" style={{ transform: "translateY(0.5rem)", marginLeft: "1.5rem" }}/>
              </Typography>
            </div>

            <div className="text-center">
              <Typography variant="h2">
                Flashez ce code QR pour accéder directement à l'application et commencer à filmer !
              </Typography>
              <QRCode
                size={192}
                value="https://par-le-monde-1.herokuapp.com/creer/4-a-votre-camera"/>
            </div>

          </React.Fragment>
        )
      }
    </div>
  );
}

Partie4.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie4);