import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import qs from "query-string";
import { useTranslation } from "react-i18next";

import {
  Button,
  Typography,
  Backdrop,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import Canvas from "./components/canvas";
import { uploadPlanImage } from "../../components/planRequest";
import { UserServiceContext } from "../../../../services/UserService";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function DrawPlan(props) {
  const { t } = useTranslation();
  const { axiosLoggedRequest, isLoggedIn } = useContext(UserServiceContext);
  const classes = useStyles();
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planIndex, setPlanIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = props.questions[questionIndex] || {};

  useEffect(() => {
    setQuestionIndex(
      parseInt(
        qs.parse(props.location.search, { ignoreQueryPrefix: true }).question
      ) || 0
    );
    setPlanIndex(
      parseInt(
        qs.parse(props.location.search, { ignoreQueryPrefix: true }).plan
      ) || 0
    );
  }, [props.location.search]);

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push(
      `/create/3-storyboard-and-filming-schedule/edit?question=${questionIndex}&plan=${planIndex}`
    );
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const imageBlob = await canvasRef.current.getBlob();
      await uploadPlanImage(
        axiosLoggedRequest,
        isLoggedIn,
        props.project,
        props.updateProject,
        questionIndex,
        planIndex,
        imageBlob
      );
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
    props.history.push(
      `/create/3-storyboard-and-filming-schedule/edit?question=${questionIndex}&plan=${planIndex}`
    );
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> {t("draw_plan_title")}
        </Typography>
        <Typography variant="h2">
          <span>{t("part3_question")}</span> {question.question}
        </Typography>
        <Typography variant="h2">
          <span>{t("part3_plan_number")}</span>{" "}
          {question.planStartIndex + planIndex}
        </Typography>

        <Canvas ref={canvasRef} />

        <Backdrop
          className={classes.backdrop}
          open={isLoading}
          onClick={() => {}}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div style={{ width: "100%", textAlign: "right", margin: "2rem 0" }}>
          <Button
            as="a"
            variant="outlined"
            color="secondary"
            style={{ marginRight: "1rem" }}
            href="/create/3-storyboard-and-filming-schedule"
            onClick={handleBack}
          >
            {t("cancel")}
          </Button>
          <Button
            as="a"
            variant="contained"
            color="secondary"
            style={{ marginRight: "1rem" }}
            href={`/create/3-storyboard-and-filming-schedule/edit?question=${questionIndex}&plan=${planIndex}`}
            onClick={handleConfirm}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

DrawPlan.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  updateProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default withRouter(DrawPlan);
