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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    croppie = new Croppie(document.getElementById("my-croppie-img"), {
      viewport: {
        width: props.imgWidth,
        height: props.imgHeight,
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

ImgCroppieComponent.defaultProps = {
  imgWidth: 340,
  imgHeight: 340,
};

export default ImgCroppieComponent;
