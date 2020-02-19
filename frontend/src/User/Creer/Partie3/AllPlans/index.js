import React, {useContext} from "react";
import {Button, Hidden, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import {withRouter} from "react-router";

import {ProjectServiceContext} from "../../../../services/ProjectService";
import Inverted from "../../../../components/Inverted";


function AllPlans(props) {
  const { project, updateProject } = useContext(ProjectServiceContext);

  const handleNext = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Création du <Inverted>Storyboard</Inverted> et du <Inverted>plan de tournage</Inverted>
        </Typography>
        <Typography color="inherit" variant="h2">
          Blabla bla...
        </Typography>

        <Hidden smDown>
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button
              component="a"
              href={`/creer/4-a-votre-caméra`}
              color="secondary"
              onClick={handleNext}
              variant="contained"
              style={{ width: "200px" }}
            >
              Suivant
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            component="a"
            href={`/creer/4-a-votre-caméra`}
            color="secondary"
            onClick={handleNext}
            variant="contained"
            style={{ width: "100%", marginTop: "2rem" }}
          >
            Suivant
          </Button>
        </Hidden>
      </div>
    </div>
  );
}

AllPlans.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AllPlans);
