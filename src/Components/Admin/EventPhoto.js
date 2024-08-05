import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import EventPhotoTable from "./EventPhotoTable";

const myInitialValues = { name: "", description: "", file: "" };
function EventPhoto() {
  const ref = React.useRef();
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [photos, setPhotos] = useState();
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    getPhotos(setPhotos, setShow, setMsg);
  }, []);

  return currentUser ? (
    <div className="py-3">
      {edit ? (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            // saveEventPhoto(values, setShow, setMsg, photos, setPhotos);
            editLatestUpdate(
              editValues.id,
              editValues,
              setEdit,
              setEditValues,
              setShow,
              setMsg,
              photos,
              setPhotos
            );
            actions.setSubmitting(false);
            actions.resetForm({
              values: myInitialValues,
            });
            ref.current.value = "";
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
                  <center>Edit Event Photos</center>
                </h3>
                <div className="container-fluid">
                  <div>
                    {/* <div className="card-header">
                                            Fill Form
                                        </div> */}
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
                            <div className="col-lg-4">Upload Photo</div>
                            <div className="col-lg-8">
                              <input
                                id="file"
                                name="file"
                                type="file"
                                ref={ref}
                                className="form-control"
                                onChange={(event) => {
                                  setFieldValue(
                                    "file",
                                    event.currentTarget.files[0]
                                  );
                                  setEditValues({
                                    ...editValues,
                                    file: event.currentTarget.files[0],
                                  });
                                }}
                                onBlur={handleBlur}
                              />
                              {errors.file ? (
                                <div className="alert alert-info">
                                  {errors.file}
                                </div>
                              ) : null}
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
            saveEventPhoto(values, setShow, setMsg, photos, setPhotos);
            actions.setSubmitting(false);
            actions.resetForm({
              values: myInitialValues,
            });
            ref.current.value = "";
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
                  <center>Add Event Photos</center>
                </h3>
                <div className="container-fluid">
                  <div>
                    {/* <div className="card-header">
                                            Fill Form
                                        </div> */}
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
                            <div className="col-lg-4">Upload Photo</div>
                            <div className="col-lg-8">
                              <input
                                id="file"
                                name="file"
                                type="file"
                                ref={ref}
                                className="form-control"
                                onChange={(event) => {
                                  setFieldValue(
                                    "file",
                                    event.currentTarget.files[0]
                                  );
                                }}
                                onBlur={handleBlur}
                              />
                              {errors.file ? (
                                <div className="alert alert-info">
                                  {errors.file}
                                </div>
                              ) : null}
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
        <EventPhotoTable
          photos={photos}
          setPhotos={setPhotos}
          edit={edit}
          setEdit={setEdit}
          editValues={editValues}
          setEditValues={setEditValues}
        />
      </div>
    </div>
  ) : null;
}

async function saveEventPhoto(values, setShow, setMsg, photos, setPhotos) {
  let fd = new FormData();
  fd.append("name", values.name);
  fd.append("description", values.description);
  fd.append("file", values.file);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  await API.post("/events", fd, config)
    .then((res) => {
      if (res.data.status === "success") {
        setPhotos([...photos, res.data.data]);
        setShow(true);
        setMsg(res.data.message);
      }
    })
    .catch((error) => {
      setShow(true);
      setMsg(error.response.data.message);
    });
}

async function getPhotos(setPhotos, setShow, setMsg) {
  await API.get("/events")
    .then((res) => {
      if (res.data.status === "success") {
        setPhotos(res.data.data);
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
  photos,
  setPhotos
) {
  // setPhotos(
  //   photos.map((rec) => {
  //     if (rec.id != id) {
  //       return rec;
  //     } else {
  //       return { ...rec, ...editedUpdate };
  //     }
  //   })
  // );
  // setEdit(false);
  // // setShow(true);
  // setEditValues(myInitialValues);
  // setMsg("SUCCESS");
  let fd = new FormData();
  fd.append("id", editedUpdate.id)
  fd.append("name", editedUpdate.name);
  fd.append("description", editedUpdate.description);
  if (editedUpdate.file) {
    fd.append("file", editedUpdate.file);
  }

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  await API.post("/events/update", fd, config)
    .then((res) => {
      if (res.data.status === "success") {
        // setPhotos([...photos, res.data.data]);
        setPhotos(
          photos.map((rec) => {
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

export default EventPhoto;
