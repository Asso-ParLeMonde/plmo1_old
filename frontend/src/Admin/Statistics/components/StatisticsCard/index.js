import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import MoreInfo from "../MoreInfo";
import MapInfo from "../MapInfo";

const useStyles = makeStyles(() => ({
  link: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
}));

function StatisticsCard(props) {
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const classes = useStyles();

  const openMoreInfo = () => {
    setIsMoreInfoOpen(!isMoreInfoOpen);
  };

  return (
    <Card style={{ marginBottom: "2rem" }}>
      <CardContent style={{ padding: "16px" }}>
        <Typography
          variant="h5"
          component="h2"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>{props.title}</span>
          <span>{props.value}</span>
        </Typography>

        {isMoreInfoOpen && props.type !== "COUNTRY" ? (
          <div style={{ transition: "height 1s" }}>
            <MoreInfo type={props.type} />
          </div>
        ) : (
          <div style={{ transition: "height 1s" }} />
        )}
        {isMoreInfoOpen && props.type === "COUNTRY" ? (
          <div style={{ transition: "height 1s" }}>
            <MapInfo />
          </div>
        ) : (
          <div style={{ transition: "height 1s" }} />
        )}
      </CardContent>
      <CardActions
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "16px",
        }}
      >
        <Button
          component="a"
          variant="contained"
          color="primary"
          onClick={openMoreInfo}
          className={classes.link}
          startIcon={isMoreInfoOpen ? <RemoveCircle /> : <AddCircleIcon />}
        >
          Informations
        </Button>
      </CardActions>
    </Card>
  );
}

StatisticsCard.propTypes = {
  type: PropTypes.oneOf(["CLASS", "COUNTRY", "PROJECTS", "PDF"]).isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default StatisticsCard;
