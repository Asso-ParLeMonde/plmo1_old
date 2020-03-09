import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import qs from "query-string";

import {Button, Hidden, Typography, TextField, FormHelperText} from "@material-ui/core";

import Inverted from "../../../../components/Inverted";
import EditButtons from "./components/EditButtons";

import "./edit-plan.css";
import CustomModal from "../../../components/CustomModal";


function EditPlan(props) {
  const [showEditPlan, setshowEditPlan] = useState(false);
  const [planIndex, setPlanIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = props.questions[questionIndex] || {};

  useEffect(() => {
    setQuestionIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).question) || 0);
    setPlanIndex(parseInt(qs.parse(props.location.search, {ignoreQueryPrefix: true}).plan) || 0);
  }, [props.location.search]);

  const handleBack = (event) => {
    event.preventDefault();
    props.history.push("/creer/3-storyboard-et-plan-de-tournage");
  };

  const handleDescriptionChange = (event) => {
    if (!event || !event.target) return;
    event.preventDefault();
    question.plans[planIndex].description = (event.target.value || "").slice(0, 2000);
    props.updateQuestion(questionIndex, question);
  };

  const handleEditPlanModal = show => (event) => {
    event.preventDefault();
    setshowEditPlan(show);
  };

  return (
    <div>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted> Créez votre plan
        </Typography>
        <Typography variant="h2">
          <span>Question :</span> {question.question}
        </Typography>
        <Typography variant="h2">
          <span>Plan numéro :</span> {question.planStartIndex + planIndex}
        </Typography>

        <Typography color="inherit" variant="h2" style={{margin: "1rem 0"}}>
          Description du plan :
          <div>
            <TextField
              value={question.plans[planIndex].description || ""}
              onChange={handleDescriptionChange}
              required
              multiline
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget pellentesque dolor,
              posuere dapibus metus. In id est eu enim efficitur convallis. Suspendisse volutpat libero eu lectus vulputate,
              eget pulvinar turpis aliquet. Sed ac cursus est. Phasellus laoreet metus sed pulvinar rutrum."
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant = "outlined"
              color="secondary"
              autoComplete="off"
            />
            <FormHelperText
              id="component-helper-text"
              style={{ marginLeft: "0.2rem", marginTop: "0.2rem" }}>
              {(question.plans[planIndex].description || "").length}/2000
            </FormHelperText>
          </div>
        </Typography>

        {
          question.plans[planIndex].url && (
            <div>
              <Typography color="inherit" variant="h2" style={{margin: "1rem 0"}}>
                Dessin du plan :
              </Typography>
              <div className="text-center">
                <img className="plan-img" alt="dessin du plan" src={question.plans[planIndex].url} />
              </div>
              <div className="text-center">
                <Button
                  className="plan-button"
                  variant="outlined"
                  color="secondary"
                  style={{ display: "inline-block" }}
                  onClick={handleEditPlanModal(true)}
                >
                  Changer le dessin
                </Button>
              </div>
              <CustomModal
                ariaLabelledBy="edit-drawing-title"
                ariaDescribedBy="edit-drawing-desc"
                title="Changer le dessin du plan"
                onClose={handleEditPlanModal(false)}
                fullWidth={true}
                maxWidth="md"
                open={showEditPlan}>
                <div id="edit-drawing-desc">
                  <EditButtons questionIndex={questionIndex} planIndex={planIndex} history={props.history}/>
                </div>
              </CustomModal>
            </div>
          )
        }

        {
          !!question.plans[planIndex].url || (
            <EditButtons questionIndex={questionIndex} planIndex={planIndex} history={props.history}/>
          )
        }

        <Hidden smDown>
          <div style={{width: "100%", textAlign: "right"}}>
            <Button
              as="a"
              variant="contained"
              color="secondary"
              style={{ margin: "0 1rem 3rem 0" }}
              href="/creer/3-storyboard-et-plan-de-tournage"
              onClick={handleBack}
            >
              Continuer
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button
            as="a"
            variant="contained"
            color="secondary"
            style={{ margin: "3rem 0", width: "100%" }}
            href={`/creer/3-storyboard-et-plan-de-tournage`}
            onClick={handleBack}
          >
            Continuer
          </Button>
        </Hidden>
      </div>
    </div>
  );
}

EditPlan.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  updateQuestion: PropTypes.func.isRequired,
};

export default withRouter(EditPlan);
