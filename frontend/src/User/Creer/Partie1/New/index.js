import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';

function NewScenario(props) {
  return (
    <div>
      Page new scenario
    </div>
  )
}

NewScenario.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withRouter(NewScenario);
