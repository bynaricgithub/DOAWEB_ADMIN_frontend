import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import EventVideoTable from "./EventVideoTable";

const myInitialValues = { name: "", description: "", url: "" };
function EventVideo() {
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [videos, setVideos] = useState();
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    getVideos(setVideos, setShow, setMsg);
  }, []);

  return currentUser ? (
    <div className="py-3">
      {edit ? (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            editLatestUpdate(
              editValues.id,
              editValues,
              setEdit,
              setEditValues,
              setShow,
              setMsg,
              videos,
              setVideos
            );
            actions.setSubmitting(false);
            actions.resetForm({
              values: myInitialValues,
            });
          }}
        >
          {({
            values,
            handleChange,
            errors,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <>
              <div className="col-lg-12 col-md-12 col-sm-12 card">
                <h3>
                  <center>Edit Event Videos</center>
                </h3>
                <div className="container-fluid">
                  <div>
                    <Form>
                      <div>
                        <div className="form-group">
                          <div className="col-lg-12 row">
                            <div className="col-lg-4">Enter name</div>
                            <div className="col-lg-8">
                              <Field
                                name="name"
                                type="text"
                                value={editValues.name}
                                className="form-control"
                                onChange={(e) => {
                                  setEditValues({
                                    ...editValues,
                                    name: e.target.value,
                                  });
                                }}
                              />
                              <ErrorMessage name="name">
                                {(msg) => (
                                  <div className="alert alert-danger">
                                    {msg}
                                  </div>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-lg-12 row">
                            <div className="col-lg-4">Enter description</div>
                            <div className="col-lg-8">
                              <Field
                                name="description"
                                type="text"
                                value={editValues.description}
                                className="form-control"
                                onChange={(e) => {
                                  setEditValues({
                                    ...editValues,
                                    description: e.target.value,
                                  });
                                }}
                              />
                              <ErrorMessage name="description">
                                {(msg) => (
                                  <div className="alert alert-danger">
                                    {msg}
                                  </div>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="col-lg-12 row">
                            <div className="col-lg-4">Enter Video url</div>
                            <div className="col-lg-8">
                              <Field
                                name="url"
                                type="text"
                                value={editValues.url}
                                className="form-control"
                                onChange={(e) => {
                                  setEditValues({
                                    ...editValues,
                                    url: e.target.value,
                                  });
                                }}
                              />
                              <ErrorMessage name="url">
                                {(msg) => (
                                  <div className="alert alert-danger">
                                    {msg}
                                  </div>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <center>
                            <button
                              className="btn btn-primary"
                              disabled={isSubmitting}
                            >
                              Edit
                            </button>
                          </center>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
              <br />
            </>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            saveEventVideo(values, setShow, setMsg, videos, setVideos);
            actions.setSubmitting(false);
            actions.resetForm({
              values: myInitialValues,
            });
          }}
        >
          {({
            values,
            handleChange,
            errors,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <>
              <div className="col-lg-12 col-md-12 col-sm-12 card">
                <h3>
                  <center>Add Event Videos</center>
                </h3>
                <div className="container-fluid">
                  <div>
                    <Form>
                      <div>
                        <div className="form-group">
                          <div className="col-lg-12 row">
                            <div className="col-lg-4">Enter name</div>
                            <div className="col-lg-8">
                              <Field
                                name="name"
                                type="text"
                                value={values.name}
                                className="form-control"
                              />
                              <ErrorMessage name="name">
                                {(msg) => (
                                  <div className="alert alert-danger">
                                    {msg}
                                  </div>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-lg-12 row">
                            <div className="col-lg-4">Enter description</div>
                            <div className="col-lg-8">
                              <Field
                                name="description"
                                type="text"
                                value={values.description}
                                className="form-control"
                              />
                              <ErrorMessage name="description">
                                {(msg) => (
                                  <div className="alert alert-danger">
                                    {msg}
                                  </div>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-lg-12 row">
                            <div className="col-lg-4">Enter Video url</div>
                            <div className="col-lg-8">
                              <Field
                                name="url"
                                type="text"
                                value={values.url}
                                className="form-control"
                              />
                              <ErrorMessage name="url">
                                {(msg) => (
                                  <div className="alert alert-danger">
                                    {msg}
                                  </div>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <center>
                            <button
                              className="btn btn-primary"
                              disabled={isSubmitting}
                            >
                              Submit
                            </button>
                          </center>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
              <br />
            </>
          )}
        </Formik>
      )}
      <div className="card card-body">
        <EventVideoTable
          videos={videos}
          setVideos={setVideos}
          edit={edit}
          setEdit={setEdit}
          editValues={editValues}
          setEditValues={setEditValues}
        />
      </div>
    </div>
  ) : null;
}

async function saveEventVideo(values, setShow, setMsg, videos, setVideos) {
  await API.post("/EventVideos ", values)
    .then((res) => {
      if (res.data.status === "success") {
        setVideos([...videos, res.data.data]);
        setShow(true);
        setMsg(res.data.message);
      }
    })
    .catch((error) => {
      setShow(true);
      setMsg(error.response.data.message);
    });
}

async function getVideos(setVideos, setShow, setMsg) {
  await API.get("/EventVideos ")
    .then((res) => {
      if (res.data.status === "success") {
        setVideos(res.data.data);
      }
    })
    .catch((error) => {
      setShow(true);
      setMsg(error.response.data.message);
    });
}

async function editLatestUpdate(
  id,
  editedUpdate,
  setEdit,
  setEditValues,
  setShow,
  setMsg,
  videos,
  setVideos
) {
  await API.post("/EventVideos/update", editedUpdate)
    .then((res) => {
      if (res.data.status === "success") {
        setVideos(
          videos.map((rec) => {
            if (rec.id != id) {
              return rec;
            } else {
              return { ...rec, ...res.data.data };
            }
          })
        );
        setEditValues(myInitialValues);
        setEdit(false);
        setShow(true);
        setMsg(res.data.message);
      }
    })
    .catch((error) => {
      setShow(true);
      setMsg(error.response.data.message);
    });
}

export default EventVideo;
