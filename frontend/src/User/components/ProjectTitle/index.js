import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Typography, withStyles, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import { ProjectServiceContext } from "../../../services/ProjectService";

const StyledEditButton = withStyles((theme) => ({
  root: {
    border: "1px solid",
    borderColor: theme.palette.primary.main,
  },
}))(IconButton);

function ProjectTitle(props) {
  const { project } = useContext(ProjectServiceContext);

  if (project.id === null) {
    return <div></div>;
  }

  return (
    <div className="text-center">
      <Typography
        color="primary"
        variant="h2"
        style={{
          display: "inline",
          fontSize: props.smaller ? "1.2rem" : "1.5rem",
        }}
      >
        Projet :
      </Typography>
      <Typography
        color="inherit"
        variant="h2"
        style={{
          display: "inline",
          marginLeft: "0.5rem",
          fontSize: props.smaller ? "1.2rem" : "1.5rem",
        }}
      >
        {project.title}
      </Typography>
      <StyledEditButton
        aria-label="edit"
        size="small"
        color="primary"
        style={{ marginLeft: "0.6rem", marginTop: "-0.3rem" }}
        onClick={props.onClick}
      >
        <EditIcon />
      </StyledEditButton>
    </div>
  );
}

ProjectTitle.propTypes = {
  onClick: PropTypes.func,
  smaller: PropTypes.bool,
};

ProjectTitle.defaultProps = {
  onClick: () => {},
  smaller: false,
};

export default ProjectTitle;
