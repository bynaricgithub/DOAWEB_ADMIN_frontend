import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import PhotoList from "./PhotoList";

const myInitialValues = { name: "", post: "", file: "" };
function UploadPhoto() {
  const ref = React.useRef();
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [photos, setPhotos] = useState();
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState({});

  return currentUser ? (
    <div className="py-3">
      {edit ? (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            // saveDignitaries(values, setShow, setMsg, photos, setPhotos);
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
            // console.log(editValues);
            // setEdit(false);
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
                  <center>Edit Dignitaries Photos</center>
                </h3>
                <div className="container-fluid">
                  {/* <div className="card"> */}
                  {/* <div className="card-header">Fill Form</div> */}
                  <Form>
                    <div>
                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            Enter name of Dignitary
                          </div>
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
                                <div className="alert alert-danger">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            Enter Post of Dignitary
                          </div>
                          <div className="col-lg-8">
                            <Field
                              name="post"
                              type="text"
                              value={editValues.post}
                              className="form-control"
                              onChange={(e) => {
                                setEditValues({
                                  ...editValues,
                                  post: e.target.value,
                                });
                              }}
                            />
                            <ErrorMessage name="post">
                              {(msg) => (
                                <div className="alert alert-danger">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            Upload Passport Size Photo
                          </div>
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
                {/* </div> */}
              </div>
              <br />
            </>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            saveDignitaries(values, setShow, setMsg, photos, setPhotos);
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
                  <center>Add Dignitaries Photos</center>
                </h3>
                <div className="container-fluid">
                  {/* <div className="card"> */}
                  {/* <div className="card-header">Fill Form</div> */}
                  <Form>
                    <div>
                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            Enter name of Dignitary
                          </div>
                          <div className="col-lg-8">
                            <Field
                              name="name"
                              type="text"
                              value={values.name}
                              className="form-control"
                            />
                            <ErrorMessage name="name">
                              {(msg) => (
                                <div className="alert alert-danger">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            Enter Post of Dignitary
                          </div>
                          <div className="col-lg-8">
                            <Field
                              name="post"
                              type="text"
                              value={values.post}
                              className="form-control"
                            />
                            <ErrorMessage name="post">
                              {(msg) => (
                                <div className="alert alert-danger">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">
                            Upload Passport Size Photo
                          </div>
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
                {/* </div> */}
              </div>
              <br />
            </>
          )}
        </Formik>
      )}
      <div className="card card-body">
        <PhotoList
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

async function saveDignitaries(values, setShow, setMsg, photos, setPhotos) {
  let fd = new FormData();
  fd.append("name", values.name);
  fd.append("post", values.post);
  fd.append("file", values.file);
  console.log(values);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  await API.post("/photo", fd, config)
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
  fd.append("name", editedUpdate.name);
  fd.append("post", editedUpdate.post);
  if (editedUpdate.file) {
    fd.append("file", editedUpdate.file);
  }
  fd.append("id", editedUpdate.id);
  console.log(editedUpdate);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  await API.post("/photo/update", fd, config)
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

export default UploadPhoto;
