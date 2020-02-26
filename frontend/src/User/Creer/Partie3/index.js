import React, {useContext} from "react";
import PropTypes from "prop-types";
import {Route, Switch, withRouter} from "react-router";

import {Breadcrumbs, Hidden, Link, Typography} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import {ProjectServiceContext} from "../../../services/ProjectService";
import Steps from "../../components/Steps";
import AllPlans from "./AllPlans";
import EditPlan from "./EditPlan";

function Partie3(props) {
  const { project } = useContext(ProjectServiceContext);

  const handleHome = (event) => {
    event.preventDefault();
    props.history.push("/creer");
  };

  return (
    <div>
      {
        project.themeId !== null && project.scenarioId !== null && (
          <React.Fragment>
            <Hidden smDown>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>} aria-label="breadcrumb">
                <Link color="inherit" href="/creer" onClick={handleHome}>
                  Tout les thèmes
                </Link>
                <Typography color="textPrimary">{project.themeName}</Typography>
              </Breadcrumbs>
            </Hidden>

            <Steps activeStep={2}/>

            <Switch>
              <Route path="/creer/3-storyboard-et-plan-de-tournage/edit" component={EditPlan} />
              <Route path="/creer/3-storyboard-et-plan-de-tournage" component={AllPlans} />
            </Switch>

          </React.Fragment>
        )
      }
    </div>
  );
}

Partie3.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(Partie3);