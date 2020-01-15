import React, {useEffect} from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import { Drawer, makeStyles, List, ListItem, ListItemText } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "white",
  },
  toolbar: theme.mixins.toolbar,
}));

function AdminDrawer(props) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    const index = props.tabs.reduce(
      (i1, tab, i2) => (tab.path === props.location.pathname ? i2 : i1),
      0
    );
    setSelectedIndex(index);
    // eslint-disable-next-line
  }, [props.location.pathname]);

  return (
    <Drawer className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
    >
      <div className={classes.toolbar} />
      <List>
        {
          props.tabs.map((tab, index) => (
            <ListItem
              component="a"
              button
              key={tab.label}
              href={tab.path}
              onClick={(event) => {
                event.preventDefault();
                props.history.push(tab.path);
              }}
              selected={selectedIndex === index}
            >
              <ListItemText primary={tab.label} />
            </ListItem>
          ))
        }
      </List>
    </Drawer>
  );
}

AdminDrawer.propTypes = {
  tabs: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AdminDrawer);
