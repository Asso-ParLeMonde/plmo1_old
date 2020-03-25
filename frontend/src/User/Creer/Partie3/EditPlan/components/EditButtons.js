import React, {useRef, useState} from "react";
import PropTypes from "prop-types";

import {Backdrop, Button, CircularProgress, Hidden, makeStyles, Typography} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CreateIcon from '@material-ui/icons/Create';

import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import "./upload-plan.css";
import UploadPlan from "./UploadPlan";

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function EditButtons(props) {
  const classes = useStyles();

  const inputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputchange = (event) => {
    if (event.target.files.length > 0) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const handleClearInput = () => {
    setImageUrl(null);
    if (inputRef.current !== undefined && inputRef.current !== null) {
      inputRef.current.value = "";
    }
  };

  const submitImage = async (blob) => {
    setIsLoading(true);
    await props.submitImageWithUrl(blob);
    setIsLoading(false);
  };

  const handleDraw = (event) => {
    event.preventDefault();
    props.history.push(`/create/3-storyboard-and-filming-schedule/draw?question=${props.questionIndex}&plan=${props.planIndex}`);
  };

  const toggleShowCamera = show => () => {
    setShowCamera(show);
  };

  const handlePhotoTaken = (imageUri) => {
    setShowCamera(false);
    setImageUrl(imageUri);
  };

  let content;
  if (showCamera) {
    content = (
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Camera onTakePhoto={handlePhotoTaken}/>
        <Button
          variant="outlined"
          color="secondary"
          className="mobile-full-width"
          onClick={toggleShowCamera(false)}
        >
          Annuler
        </Button>
      </div>
    );
  } else if (imageUrl !== null && imageUrl.length > 0) {
    content = <UploadPlan imageUrl={imageUrl} handleClearInput={handleClearInput} handleSubmit={submitImage}/>;
  } else {
    content = (
      <React.Fragment>
        <Hidden smDown>
          <Typography color="inherit" variant="h2">
            Pour créer votre plan vous pouvez soit l&apos;importer, soit le prendre en photo ou le dessiner en ligne !
          </Typography>
          <div className="edit-plans-container">
            <Button
              variant="outlined"
              color="secondary"
              component="label"
              htmlFor="plan-img-upload"
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
              onClick={toggleShowCamera(true)}
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
              href={`/create/3-storyboard-and-filming-schedule/draw?question=${props.questionIndex}&plan=${props.planIndex}`}
              onClick={handleDraw}
            >Dessiner le plan</Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Typography color="inherit" variant="h2">
            Pour créer votre plan vous pouvez l&apos;importer ou le prendre en photo !
          </Typography>
          <div className="edit-plans-container-mobile" style={{ marginTop: "1rem" }}>
            <Button
              variant="outlined"
              component="label"
              htmlFor="plan-img-upload"
              color="secondary"
              style={{textTransform: "none", width: "100%"}}
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
              onClick={toggleShowCamera(true)}
              startIcon={<PhotoCameraIcon />}
            >Prendre une photo</Button>
          </div>
        </Hidden>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={isLoading} timeout={10000}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {content}
      <input id="plan-img-upload" type="file" accept="image/*" onChange={handleInputchange} ref={inputRef} style={{display: "none"}}/>
    </React.Fragment>
  );
}

EditButtons.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  submitImageWithUrl: PropTypes.func,
  planIndex: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

EditButtons.defaultProps = {
  submitImageWithUrl: async () => {},
};

export default EditButtons;
