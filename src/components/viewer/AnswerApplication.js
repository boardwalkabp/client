import React from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { Card, CardContent, Grid, Button, Typography } from "@mui/material";
import $ from "jquery";

export default function AnswerApplication() {
  const [application, setApplication] = useState({});
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchApplication = async () => {
    createAPIEndpoint(ENDPOINTS.applications)
      .fetchById(id)
      .then((res) => {
        setApplication(res.data);
        const questionIds = res.data.questions.map(
          (question) => question.value
        );
        createAPIEndpoint(ENDPOINTS.questions)
          .fetch()
          .then((res) => {
            const filteredQuestions = res.data.filter((question) =>
              questionIds.includes(question.id)
            );
            setQuestions(filteredQuestions);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {application.title}
            </Typography>
          </Grid>
          {questions.map((question) => {
            let question_title = question.body;
            let question_id = question.id;
            let question_type = question.questionType;
            let question_choices = question.choices;
            let qNum = 1;

            const question_info = question_choices.map((choice, i) => {
              if (question_type == "Radio") {
                return (
                  <div key={choice.id} className="q_choices qst">
                    <div className="cho_start">
                      <input
                        disabled
                        type="radio"
                        id="radio"
                        name={question_id}
                        value={choice.value}
                      />
                      <label for="radio" name={question_id}>
                        {choice.value}
                      </label>
                    </div>
                    <div className="cho_end">
                      {/* {conditions.replace("xxx", i)} */}
                    </div>
                  </div>
                );
              } else if (question_type == "CheckBox") {
                return (
                  <div key={choice.id} className="q_choices qst">
                    <div className="cho_start">
                      <input
                        disabled
                        type="checkbox"
                        name={question_id}
                        value={choice.value}
                      />
                      <label for="checkbox" name={question_id}>
                        {choice.value}
                      </label>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={question_id} className="q_choices qst">
                    <div className="cho_start">
                      <input disabled type="text" name={question_id} value="" />
                    </div>
                  </div>
                );
              }
            });
            return (
              <Grid key={id} item xs={12}>
                <Typography variant="h6" gutterBottom>
                  <div
                    class="added_question"
                    key={question_id}
                    data-order={qNum}
                    data-question={question_id}
                  >
                    <div class="qst_order">
                      <div class="a_q_title">
                        <h4>{question_title}</h4>
                      </div>
                    </div>
                    <div class="que_cho">{question_info}</div>
                    <input
                      type="hidden"
                      name="questions[]"
                      value={question_id}
                    />
                  </div>
                </Typography>
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate(`/viewer/applications`)}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}