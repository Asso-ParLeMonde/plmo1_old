import React from "react";
import PropTypes from "prop-types";
import "./sharedLink.css";

import { Fab, Tooltip } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const SharedLink = (props) => {
  const copyToClipboard = async (e) => {
    try {
      await navigator.clipboard.writeText(props.link);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sharedLink">
      <span>{props.link}</span>
      {document.queryCommandSupported("copy") && (
        <Tooltip title="Cliquez pour copier" aria-label="Cliquez pour copier">
          <Fab
            color="primary"
            aria-label="copy"
            style={{ height: "2rem", width: "2rem", minHeight: "unset" }}
            onClick={copyToClipboard}
          >
            <FileCopyIcon style={{ heiht: "0.8em", width: "0.8em" }} />
          </Fab>
        </Tooltip>
      )}
    </div>
  );
};

SharedLink.propTypes = {
  link: PropTypes.string,
};

SharedLink.defaultProps = {
  link: "",
};

export default SharedLink;
