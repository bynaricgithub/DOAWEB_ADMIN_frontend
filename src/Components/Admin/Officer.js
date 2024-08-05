import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import OfficersList from "./OfficersList";

const myInitialValues = { name: "", post: "", file: "", phone: "", email: "" };

function Officers() {
  const ref = React.useRef();
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState({});

  return currentUser ? (
    <div className="py-3">
      {edit ? (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            editOfficer(
              editValues.id,
              editValues,
              setEdit,
              setEditValues,
              setShow,
              setMsg,
              list,
              setList
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
              <div className="col-lg-12 col-md-12 col-sm-12 card card-body">
                <h3>
                  <center>Add MSBTE Officers</center>
                </h3>
                <div className="container-fluid">
                  <Form>
                    <div>
                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">Enter name of Officer</div>
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
                          <div className="col-lg-4">Enter Post of Officer</div>
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
                            Enter Phone Number of Officer
                          </div>
                          <div className="col-lg-8">
                            <Field
                              name="phone"
                              type="text"
                              value={editValues.phone}
                              className="form-control"
                              onChange={(e) => {
                                setEditValues({
                                  ...editValues,
                                  phone: e.target.value,
                                });
                              }}
                            />
                            <ErrorMessage name="phone">
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
                            Enter Email-Id of Officer
                          </div>
                          <div className="col-lg-8">
                            <Field
                              name="email"
                              type="email"
                              value={editValues.email}
                              className="form-control"
                              onChange={(e) => {
                                setEditValues({
                                  ...editValues,
                                  email: e.target.value,
                                });
                              }}
                            />
                            <ErrorMessage name="email">
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
                            Submit
                          </button>
                        </center>
                      </div>
                    </div>
                  </Form>
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
            saveOfficer(values, setShow, setMsg, list, setList);
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
              <div className="col-lg-12 col-md-12 col-sm-12 card card-body">
                <h3>
                  <center>Add MSBTE Officers</center>
                </h3>
                <div className="container-fluid">
                  <Form>
                    <div>
                      <div className="form-group">
                        <div className="col-lg-12 row">
                          <div className="col-lg-4">Enter name of Officer</div>
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
                          <div className="col-lg-4">Enter Post of Officer</div>
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
                            Enter Phone Number of Officer
                          </div>
                          <div className="col-lg-8">
                            <Field
                              name="phone"
                              type="text"
                              value={values.phone}
                              className="form-control"
                            />
                            <ErrorMessage name="phone">
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
                            Enter Email-Id of Officer
                          </div>
                          <div className="col-lg-8">
                            <Field
                              name="email"
                              type="email"
                              value={values.email}
                              className="form-control"
                            />
                            <ErrorMessage name="email">
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
              </div>
              <br />
            </>
          )}
        </Formik>
      )}
      <div className="card card-body">
        <OfficersList
          list={list}
          setList={setList}
          edit={edit}
          setEdit={setEdit}
          editValues={editValues}
          setEditValues={setEditValues}
        />
      </div>
    </div>
  ) : null;
}

async function saveOfficer(values, setShow, setMsg, list, setList) {
  let fd = new FormData();
  fd.append("name", values.name);
  fd.append("post", values.post);
  fd.append("file", values.file);
  fd.append("phone", values.phone);
  fd.append("email", values.email);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  await API.post("/Officers", fd, config)
    .then((res) => {
      if (res.data.status === "success") {
        setList([...list, res.data.data]);
        setShow(true);
        setMsg(res.data.message);
      }
    })
    .catch((error) => {
      setShow(true);
      setMsg(error.response.data.message);
    });
}

async function editOfficer(
  id,
  editedUpdate,
  setEdit,
  setEditValues,
  setShow,
  setMsg,
  list,
  setList
) {
  let fd = new FormData();
  fd.append("name", editedUpdate.name);
  fd.append("post", editedUpdate.post);
  if (editedUpdate.file) {
    fd.append("file", editedUpdate.file);
  }
  fd.append("phone", editedUpdate.phone);
  fd.append("email", editedUpdate.email);
  fd.append("id", editedUpdate.id);
  console.log(editedUpdate);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  await API.post("/Officers/update", fd, config)
    .then((res) => {
      if (res.data.status === "success") {
        setList(
          list.map((rec) => {
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

export default Officers;
