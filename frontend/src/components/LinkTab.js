import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import Tab from "@material-ui/core/Tab";

function LinkTab(props) {
  // eslint-disable-next-line no-unused-vars,react/prop-types
  const { staticContext, content, tabIcon, ...rest } = props; // Fix for a bug with react-router and passing props ...props

  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
        props.history.push(props.path);
      }}
      label={<span className="tab-label">{content}{tabIcon}</span>}
      {...rest}
    />
  );
}

LinkTab.propTypes = {
  path: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  tabIcon: PropTypes.node,
};

LinkTab.defaultProps = {
  tabIcon: <span/>
};

export default withRouter(LinkTab);
