import React from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

export default function AddApplication() {
  const [values, setValues] = useState({
    title: "",
    questionId: "",
    clientId: "",
    categoryId: "",
    questions: [],
  });
  const [questionId, setQuestions] = useState([]);
  const [categoryId, setCategories] = useState([]);
  const [clientId, setClients] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const validate = () => {
    let temp = {};
    temp.title = values.title ? "" : "This field is required.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  }

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.categories)
      .fetch()
      .then((res) => {
        // console.log(res.data);
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
    createAPIEndpoint(ENDPOINTS.clients)
      .fetch()
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => console.log(err));
    createAPIEndpoint(ENDPOINTS.questions)
      .fetch()
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (id) {
        createAPIEndpoint(ENDPOINTS.applications)
          .put(id, {
            ...values,
            questions: values.questions.map((q, index) => ({
              ...q,
              order: index,
            })),
          })
          .then((res) => {
            navigate("/builder/applications");
          })
          .catch((err) => console.log(err));
      } else {
        createAPIEndpoint(ENDPOINTS.applications)
          .post({
            ...values,
            questions: values.questions.map((q, index) => ({
              ...q,
              order: index,
            })),
          })
          .then((res) => {
            navigate("/builder/applications");
          })
          .catch((err) => console.log(err));
      }
    }
  };

  // const handleSubmit = (e) => {
  //   console.log(values);
  //   e.preventDefault();
  //   if (validate()) {
  //     if (id) {
  //       createAPIEndpoint(ENDPOINTS.applications)
  //         .put(id, values)
  //         .then((res) => {
  //           navigate("/builder/applications");
  //         })
  //         .catch((err) => console.log(err));
  //     } else {
  //       createAPIEndpoint(ENDPOINTS.applications)
  //         .post(values)
  //         .then((res) => {
  //           navigate("/builder/applications");
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //   }
  // };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     if (id) {
  //       createAPIEndpoint(ENDPOINTS.applications)
  //         .put(id, {
  //           ...values,
  //           questions: values.questions.map((q) => q.questions_content.id),
  //         })
  //         .then((res) => {
  //           navigate("/builder/applications");
  //         })
  //         .catch((err) => console.log(err));
  //     } else {
  //       createAPIEndpoint(ENDPOINTS.applications)

  //         .post({
  //           ...values,
  //           questions: values.questions.map((q) => q.questions_content.id),
  //         })
  //         .then((res) => {
  //           navigate("/builder/applications");
  //         })
  //         .catch((err) => console.log(err));
  //     }
  //   }
  // };
  const handleAddClick = () => {
    setValues({
      ...values,
      questions: [
        ...values.questions,
        {
          value: selectedQuestion.id,
          questions_content: selectedQuestion,
        },
      ],
    });
  };

  useEffect(() => {
    if (id) {
      createAPIEndpoint(ENDPOINTS.applications)
        .fetchById(id)
        .then((res) => {
          setValues(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {id ? "Edit Application" : "Add Application"}
        </Typography>
        <br></br>
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="title"
                label="Title"
                value={values.title}
                onChange={(e) =>
                  setValues({
                    ...values,
                    title: e.target.value,
                  })
                }
                {...(errors.title && {
                  error: true,
                  helperText: errors.title,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select a category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.categoryId}
                  label="Select a category"
                  onChange={(e) =>
                    setValues({
                      ...values,
                      categoryId: e.target.value,
                    })
                  }
                >
                  {categoryId.map((item) => (
                    // console.log(item),
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select a client
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.clientId}
                  label="Select a client"
                  onChange={(e) =>
                    setValues({
                      ...values,
                      clientId: e.target.value,
                    })
                  }
                >
                  {clientId.map((item) => (
                    // console.log(item),
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className="select_question">
              <FormControl fullWidth>
                <InputLabel id="question-select-label">Select a Question</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.questionId}
                  label="Select a question"
                  onChange={(e) => {
                    setValues({
                      ...values,
                      questionId: e.target.value,
                    });
                    setSelectedQuestion(
                      questionId.find((item) => item.id === e.target.value)
                    );
                  }}
                >
                  {questionId.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.body} - {item.questionType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleAddClick}>
                Add
              </Button>
            </Grid>
            <Grid item xs={12}>
              {values.questions.map((question, index) => (
                <div className="added_question" key={index}>
                  <div className="a_q_title">
                    {question.questions_content.body}
                    <button onClick={(e) => {
                      e.preventDefault();
                      // Remove the question from the array
                      setValues({
                        ...values,
                        questions: values.questions.filter((q) => q !== question),
                      });
                    }}>
                      Delete
                    </button>
                    <button onClick={(e) => {
                      e.preventDefault();
                      if (index > 0) {
                        const newQuestions = [...values.questions];
                        newQuestions.splice(index - 1, 0, newQuestions.splice(index, 1)[0]);
                        setValues({
                          ...values,
                          questions: newQuestions,
                        });
                      }
                    }}>
                      Up
                    </button>
                    <button onClick={(e) => {
                      e.preventDefault();
                      if (index < values.questions.length - 1) {
                        const newQuestions = [...values.questions];
                        newQuestions.splice(index + 1, 0, newQuestions.splice(index, 1)[0]);
                        setValues({
                          ...values,
                          questions: newQuestions,
                        });
                      }
                    }}>
                      Down
                    </button>
                  </div>
                  <div className="que_cho">
                    {(question.questions_content.questionType === 'CheckBox' || question.questions_content.questionType === 'Radio') && (
                      <div>
                        {question.questions_content.choices.map((choice, i) => (
                          <label key={i}>
                            < input
                              type={question.questions_content.questionType}
                              value={choice.value}
                              onChange={(event) => {
                                setValues({
                                  ...values,
                                  questions: values.questions.map((q) => {
                                    if (q === question) {
                                      return {
                                        ...q,
                                        questions_content: {
                                          ...q.questions_content,
                                          choices: q.questions_content.choices.map((c) => {
                                            if (c === choice) {
                                              return {
                                                ...c,
                                                value: event.target.value,
                                              };
                                            } else {
                                              return c;
                                            }
                                          }),
                                        },
                                      };
                                    } else {
                                      return q;
                                    }
                                  }),
                                });
                              }}
                            />
                            {choice.value}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Grid>
          </Grid>
          <br></br>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: "10px" }}
              >
                {id ? "Update" : "Save"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card >
  );
}
