import React, {useState, useEffect, useContext} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import qs from "query-string";

import {Typography, Button, makeStyles, Hidden} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CreateIcon from '@material-ui/icons/Create';

import {ProjectServiceContext} from "../../../../services/ProjectService";
import {getQuestions} from "../../../../util/questions";
import Inverted from "../../../../components/Inverted";
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

function EditPlan(props) {
  const classes = useStyles();

  const [planIndex, setPlanIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const { project } = useContext(ProjectServiceContext);
  const questions = getQuestions(project);
  const question = questions[questionIndex] || {};

  useEffect(() => {
    setQuestionIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).question) || 0);
    setPlanIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).plan) || 0);
  }, [props.location.search]);

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push("/creer/3-storyboard-et-plan-de-tournage");
  };

  const handleDraw = (event) => {
    event.preventDefault();
    props.history.push(`/creer/3-storyboard-et-plan-de-tournage/draw?question=${questionIndex}&plan=${planIndex}`);
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Créez votre plan
        </Typography>
        <Typography variant="h2">
          <span>Question :</span> {question.question}
        </Typography>
        <Typography variant="h2">
          <span>Plan numéro :</span> {question.planStartIndex + planIndex}
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
              component="a"
              variant="outlined"
              color="secondary"
              style={{textTransform: "none"}}
              startIcon={<CreateIcon />}
              href={`/creer/3-storyboard-et-plan-de-tournage/draw?question=${questionIndex}&plan=${planIndex}`}
              onClick={handleDraw}
            >Dessiner le plan</Button>
          </div>

          <div style={{width: "100%", textAlign: "right"}}>
            <Button
              as="a"
              variant="contained"
              color="secondary"
              style={{ marginRight: "1rem" }}
              href="/creer/3-storyboard-et-plan-de-tournage"
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

EditPlan.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(EditPlan);
