import React, {forwardRef, memo, useEffect, useImperativeHandle} from "react";
import PropTypes from "prop-types";

import Croppie from "croppie";
import "croppie/croppie.css";

function ImgCroppie(props, ref) {
  let croppie = null;

  useImperativeHandle(ref, () => ({
    async getBlob() {
      if (croppie === null) {
        return null;
      }
      return await croppie.result({
        type: "blob",
        format: "jpeg",
        circle: false,
      });
    },
  }));

  useEffect(() => {
    croppie = new Croppie(document.getElementById("my-croppie-img"), {
      viewport: {
        width: 340,
        height: 340,
        type: 'square',
      },
    });
    return () => {
      croppie = null;
    }
  }, []);

  return <img id="my-croppie-img" alt={props.alt} src={props.src} />;
}

const ImgCroppieComponent = memo(forwardRef(ImgCroppie));

ImgCroppieComponent.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  imgWidth: PropTypes.number,
  imgHeight: PropTypes.number,
};

export default ImgCroppieComponent;
