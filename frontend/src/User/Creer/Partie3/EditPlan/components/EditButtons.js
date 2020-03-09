import React from "react";
import PropTypes from "prop-types";

import {Button, Hidden, makeStyles, Typography} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CreateIcon from '@material-ui/icons/Create';

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

function EditButtons(props) {
  const classes = useStyles();

  const handleDraw = (event) => {
    event.preventDefault();
    props.history.push(`/creer/3-storyboard-et-plan-de-tournage/draw?question=${props.questionIndex}&plan=${props.planIndex}`);
  };

  return (
    <React.Fragment>
      <Hidden smDown>
        <Typography color="inherit" variant="h2">
          Pour créer votre plan vous pouvez soit l&apos;importer, soit le prendre en photo ou le dessiner en ligne !
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
            href={`/creer/3-storyboard-et-plan-de-tournage/draw?question=${props.questionIndex}&plan=${props.planIndex}`}
            onClick={handleDraw}
          >Dessiner le plan</Button>
        </div>
      </Hidden>
      <Hidden mdUp>
        <Typography color="inherit" variant="h2">
          Pour créer votre plan vous pouvez l&apos;importer ou le prendre en photo !
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
      </Hidden>
    </React.Fragment>
  );
}

EditButtons.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  planIndex: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default EditButtons;
