import React from "react";
import PropTypes from "prop-types";
import Fab from '@material-ui/core/Fab';
import PlayIcon from '@material-ui/icons/PlayArrow';
import "./videoThumbnail.css";

function VideoThumbnail({thumbnailLink, duration, title}) {
  const minutes = Math.floor((duration / 1000) / 60);
  const seconds = Math.floor(duration / 1000) % 60

  return <div className="video-thumbnail" tabIndex="0" >
    <div className="video-thumbnail-container">
      <img width="100%" height="100%" className="video-thumbnail-img" src={thumbnailLink} alt="thumbnail"/>
      <div className="button-container">
        <Fab aria-label="play" style={{ opacity: 0.85 }} tabIndex="-1" size="small">
          <PlayIcon />
        </Fab>
      </div>
      <div className="duration-container">
        <p>{`0${minutes}`.slice(-2)}:{`0${seconds}`.slice(-2)}</p>
      </div>
    </div>
    <p>{title}</p>
  </div>
}

VideoThumbnail.propTypes = {
  thumbnailLink: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

export default VideoThumbnail;
