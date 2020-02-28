import React, {useContext} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";

import {Typography, Button, makeStyles, Hidden} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CreateIcon from '@material-ui/icons/Create';

import Inverted from "../../../../components/Inverted";
import {ProjectServiceContext} from "../../../../services/ProjectService";
import "./edit-plan.css";

const useStyles = makeStyles(theme => ({
  verticalLine: {
    backgroundColor: theme.palette.secondary.main,
    flex: 1,
    width: "1px",
    margin: "0.2rem 0",
  },
  horizontalLine: {
    backgroundColor: theme.palette.secondary.main,
    flex: 1,
    height: "1px",
    margin: "2rem 1rem",
  },
  secondaryColor: {
    color: theme.palette.secondary.main,
  },
}));

function EditPlans(props) {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { project, updateProject } = useContext(ProjectServiceContext);

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push("/creer/3-storyboard-et-plan-de-tournage");
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Créez votre plan
        </Typography>

        <Hidden smDown>
          <Typography color="inherit" variant="h2">
            Pour créer votre plan vous pouvez soit l'importer, soit le prendre en photo ou le dessiner en ligne !
          </Typography>
          <div className="edit-plans-container">
            <Button
              variant="outlined"
              color="secondary"
              style={{textTransform: "none"}}
              startIcon={<CloudUploadIcon />}
            >Importez une image</Button>
            <div className="or-vertical-divider">
              <div className={classes.verticalLine} />
              <span className={classes.secondaryColor}>OU</span>
              <div className={classes.verticalLine} />
            </div>
            <Button
              variant="outlined" color="secondary"
              style={{textTransform: "none"}}
              startIcon={<PhotoCameraIcon />}
            >Prendre une photo</Button>
            <div className="or-vertical-divider">
              <div className={classes.verticalLine} />
              <span className={classes.secondaryColor}>OU</span>
              <div className={classes.verticalLine} />
            </div>
            <Button
              variant="outlined"
              color="secondary"
              style={{textTransform: "none"}}
              startIcon={<CreateIcon />}
            >Dessiner le plan</Button>
          </div>

          <div style={{width: "100%", textAlign: "right"}}>
            <Button
              as="a"
              variant="contained"
              color="secondary"
              style={{ marginRight: "1rem" }}
              href={`/creer/3-storyboard-et-plan-de-tournage`}
              onClick={handleBack}
            >
              Retour
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Typography color="inherit" variant="h2">
            Pour créer votre plan vous pouvez l'importer ou le prendre en photo !
          </Typography>
          <div className="edit-plans-container-mobile">
            <Button
              variant="outlined"
              color="secondary"
              style={{textTransform: "none"}}
              startIcon={<CloudUploadIcon />}
            >Importez une image</Button>
            <div className="or-horizontal-divider">
              <div className={classes.horizontalLine} />
              <span className={classes.secondaryColor}>OU</span>
              <div className={classes.horizontalLine} />
            </div>
            <Button
              variant="outlined" color="secondary"
              style={{textTransform: "none"}}
              startIcon={<PhotoCameraIcon />}
            >Prendre une photo</Button>
          </div>

          <Button
            as="a"
            variant="contained"
            color="secondary"
            style={{ margin: "3rem 0", width: "100%" }}
            href={`/creer/3-storyboard-et-plan-de-tournage`}
            onClick={handleBack}
          >
            Retour
          </Button>
        </Hidden>
      </div>
    </div>
  );
}

EditPlans.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(EditPlans);
