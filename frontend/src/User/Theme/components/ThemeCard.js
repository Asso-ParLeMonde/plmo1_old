import React, {useEffect, useRef} from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import CardMedia from "@material-ui/core/CardMedia";

import "./ThemeCard.css";
import {Typography} from "@material-ui/core";

// import { ReactComponent as DefaultImage } from '../../../images/classe_default.png';

const colors = [
  "rgb(96, 105, 243)",
  "rgb(213, 89, 84)",
  "rgb(250, 225, 108)",
  "rgb(62, 65, 87)",
  "rgb(215, 213, 209)",
  "rgb(162, 220, 174)",
];

function ThemeCard(props) {
  const img = useRef(null);

  useEffect(() => {
    if (props.theme.image !== undefined && props.theme.image !== null) {
      const image = new Image();
      image.onload = () => {
        img.current.src = image.src;
      };
      image.src = props.theme.image.path;
    }
  }, [props.theme.image]);

  return (
    <a className="theme-card-button"
       href={`/themes/${props.themeID}`}
       onClick={(event) => {
         event.preventDefault();
         props.history.push(`/themes/${props.themeID}`);
       }}
    >
      <Paper className="theme-card-paper">
        {
          props.theme.image ? (
            <CardMedia
              ref={img}
              component="img"
              alt={`picture of ${props.theme.names.fr} thene`}
              image="/classe_default.png"
            />
          ) : (
            <div className="theme-card-default" style={{backgroundColor: colors[props.themeID % 6]}}/>
          )
        }
      </Paper>
      <Typography className="theme-card-title">{props.theme.names.fr}</Typography>
    </a>
  )
}

ThemeCard.propTypes = {
  themeID: PropTypes.number,
  theme: PropTypes.object,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

ThemeCard.defaultProps = {
  themeID: 0,
  theme: {
    image: null,
  },
};

export default withRouter(ThemeCard);
