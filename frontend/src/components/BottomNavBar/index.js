import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import { withStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { useTranslation } from "react-i18next";

import "./bottomNavBar.css";

const StyledTab = withStyles((theme) => ({
  root: {
    fill: "#808080",
    color: "#808080",
  },
  selected: {
    fill: theme.palette.secondary.main,
    color: `${theme.palette.secondary.main}!important`,
  },
}))(BottomNavigationAction);

function BottomNavBar(props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    const index = props.tabs.reduce(
      (i1, tab, i2) =>
        tab.path.split("/")[1] === props.location.pathname.split("/")[1]
          ? i2
          : i1,
      -1
    );
    setActiveTab(index + 1);
    // eslint-disable-next-line
  }, [props.location.pathname]);

  return (
    <React.Fragment>
      <div style={{ height: "60px" }} />
      <BottomNavigation
        value={activeTab}
        onChange={(event, newValue) => {
          setActiveTab(newValue);
        }}
        showLabels
        className="bottom-navbar"
      >
        <StyledTab label="" style={{ display: "none" }} />
        {props.tabs.map((tab, index) => (
          <StyledTab
            label={t(tab.label)}
            icon={tab.icon}
            href={tab.path}
            key={index}
            onClick={(event) => {
              event.preventDefault();
              props.history.push(tab.path);
            }}
          />
        ))}
      </BottomNavigation>
    </React.Fragment>
  );
}

BottomNavBar.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
};

export default withRouter(BottomNavBar);
