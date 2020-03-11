import React, {useEffect} from "react";
import PropTypes from "prop-types";

import Croppie from "croppie";
import "croppie/croppie.css";

function ImgCroppie(props) {
  let croppie;

  useEffect(() => {
    croppie = new Croppie(document.getElementById("my-croppie-img"), {
      viewport: {
        width: 340,
        height: 340,
        type: 'square',
      },
    });
  });

  return <img id="my-croppie-img" alt={props.alt} src={props.src} />;
}

ImgCroppie.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  imgWidth: PropTypes.number,
  imgHeight: PropTypes.number,
};

export default ImgCroppie;
