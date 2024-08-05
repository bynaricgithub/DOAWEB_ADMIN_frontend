import React, { useState, useContext, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import API from "../../API";
import ImportantLinksTable from "./ImportantLinksTable";
import { UserContext, ShowContext } from "../../App";

let myInitialValues = {
  heading: "",
  url: "",
  type: "",
  fromDate: "",
  toDate: "",
  file: "",
};

const ImportantLinks = () => {
  const ref = useRef();
  const [impLinks, setImpLinks] = useState();
  const { setShow, setMsg } = useContext(ShowContext);
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [file, setFile] = useState();

  useEffect(() => {
    getImpLinks(setImpLinks, setShow, setMsg);
  }, []);

  return (
    <div className="py-3 ">
      {edit ? (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            // submitImpLinks(values, impLinks, setImpLinks, setShow, setMsg);
            editLatestUpdate(
              editValues.id,
              editValues,
              setEdit,
              setEditValues,
              setShow,
              setMsg,
              impLinks,
              setImpLinks
            );
            actions.setSubmitting(false);
            actions.resetForm({
              values: myInitialValues,
            });
            ref.current.value = "";
          }}
          validationSchema={Yup.object({
            // heading: Yup.string().required("Heading is Required"),
            // url: Yup.string().required("URL is Required"),
            // type: Yup.string().required("Type is Required"),
            // fromDate: Yup.string().required("Start Date is Required"),
            // toDate: Yup.string().required("End Date is Required"),
          })}
        >
          {(props) => {
            const {
              values,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;
            return (
              <>
                <div className="card card-body mt-2">
                  <form
                    id="form-client"
                    method="post"
                    className="form-horizontal"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group row ">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <h3 className="text-center">Edit Important Links</h3>
                        <div className="col-sm-4 col-md-12 col-lg-12"></div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="heading"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          Heading :
                        </label>
                        <div className="col-sm-12 col-md-12 col-lg-12 ">
                          <input
                            type="text"
                            id="heading"
                            name="heading"
                            placeholder="Heading"
                            className="form-control"
                            value={editValues.heading}
                            onChange={(e) => {
                              handleChange(e);
                              setEditValues({
                                ...editValues,
                                heading: e.target.value,
                              });
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.heading ? (
                            <div className="alert alert-danger">
                              {errors.heading}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="url"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          URL :
                        </label>
                        <div className="col-sm-12 col-md-12 col-lg-12 ">
                          <input
                            type="text"
                            id="url"
                            name="url"
                            placeholder="URL"
                            className="form-control"
                            value={editValues.url}
                            onChange={(e) => {
                              handleChange(e);
                              setEditValues({
                                ...editValues,
                                url: e.target.value,
                              });
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.url ? (
                            <div className="alert alert-danger">
                              {errors.url}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="type"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          Type :
                        </label>
                        <div className="col-sm-4 col-md-12 col-lg-12">
                          <select
                            name="type"
                            className="form form-control"
                            value={editValues.type}
                            onChange={(e) => {
                              handleChange(e);
                              setEditValues({
                                ...editValues,
                                type: e.target.value,
                              });
                            }}
                          >
                            <option value="">Please Select</option>
                            <option value={1}>PDF</option>
                            <option value={2}>Web URL</option>
                          </select>
                          {errors.type ? (
                            <div className="alert alert-danger">
                              {errors.type}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="fromDate"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          Start Date (date and time):
                        </label>
                        <div className="col-sm-4 col-md-12 col-lg-12">
                          <input
                            type="datetime-local"
                            id="fromDate"
                            name="fromDate"
                            className="form-control"
                            value={editValues.fromDate}
                            onChange={(e) => {
                              handleChange(e);
                              setEditValues({
                                ...editValues,
                                fromDate: e.target.value,
                              });
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.fromDate ? (
                            <div className="alert alert-danger">
                              {errors.fromDate}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="toDate"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          End Date (date and time):
                        </label>
                        <div className="col-sm-4 col-md-12 col-lg-12">
                          <input
                            type="datetime-local"
                            id="toDate"
                            name="toDate"
                            className="form-control"
                            value={editValues.toDate}
                            onChange={(e) => {
                              handleChange(e);
                              setEditValues({
                                ...editValues,
                                toDate: e.target.value,
                              });
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.toDate ? (
                            <div className="alert alert-danger">
                              {errors.toDate}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 d-flex justify-content-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary "
                      >
                        Edit
                      </button>
                    </div>
                  </form>
                </div>
                <br />
              </>
            );
          }}
        </Formik>
      ) : (
        <Formik
          initialValues={myInitialValues}
          onSubmit={(values, actions) => {
            submitImpLinks(
              { ...values, file },
              impLinks,
              setImpLinks,
              setShow,
              setMsg
            );
            actions.setSubmitting(false);
            actions.resetForm({
              values: myInitialValues,
            });
            ref.current.value = "";
          }}
          validationSchema={Yup.object({
            heading: Yup.string().required("Heading is Required"),
            // url: Yup.string().required("URL is Required"),
            type: Yup.string().required("Type is Required"),
            fromDate: Yup.string().required("Start Date is Required"),
            toDate: Yup.string().required("End Date is Required"),
          })}
        >
          {(props) => {
            const {
              values,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;
            return (
              <>
                <div className="card card-body mt-2">
                  <form
                    id="form-client"
                    method="post"
                    className="form-horizontal"
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group row ">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <h3 className="text-center">Add Important Links</h3>
                        <div className="col-sm-4 col-md-12 col-lg-12"></div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="heading"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          Heading :
                        </label>
                        <div className="col-sm-12 col-md-12 col-lg-12 ">
                          <input
                            type="text"
                            id="heading"
                            name="heading"
                            placeholder="Heading"
                            className="form-control"
                            value={values.heading}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.heading ? (
                            <div className="alert alert-danger">
                              {errors.heading}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="url"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          {values.type === "1" ? "PDF :" : "URL :"}
                        </label>
                        <div className="col-sm-12 col-md-12 col-lg-12 ">
                          {values.type === "1" ? (
                            <>
                              <input
                                type="file"
                                id="file"
                                name="file"
                                placeholder="PDF"
                                ref={ref}
                                className="form-control"
                                // value={values.url}
                                onChange={(event) => {
                                  setFile(event.currentTarget.files[0]);
                                }}
                                onBlur={handleBlur}
                              />
                              {errors.file ? (
                                <div className="alert alert-danger">
                                  {errors.file}
                                </div>
                              ) : null}
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                id="url"
                                name="url"
                                placeholder="URL"
                                className="form-control"
                                value={values.url}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                              />
                              {errors.url ? (
                                <div className="alert alert-danger">
                                  {errors.url}
                                </div>
                              ) : null}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="type"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          Type :
                        </label>
                        <div className="col-sm-4 col-md-12 col-lg-12">
                          <select
                            name="type"
                            className="form form-control"
                            value={values.type}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          >
                            <option value="">Please Select</option>
                            <option value={1}>PDF</option>
                            <option value={2}>Web URL</option>
                          </select>
                          {errors.type ? (
                            <div className="alert alert-danger">
                              {errors.type}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="fromDate"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          Start Date (date and time):
                        </label>
                        <div className="col-sm-4 col-md-12 col-lg-12">
                          <input
                            type="datetime-local"
                            id="fromDate"
                            name="fromDate"
                            className="form-control"
                            value={values.fromDate}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.fromDate ? (
                            <div className="alert alert-danger">
                              {errors.fromDate}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="toDate"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          End Date (date and time):
                        </label>
                        <div className="col-sm-4 col-md-12 col-lg-12">
                          <input
                            type="datetime-local"
                            id="toDate"
                            name="toDate"
                            className="form-control"
                            value={values.toDate}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.toDate ? (
                            <div className="alert alert-danger">
                              {errors.toDate}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 d-flex justify-content-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary "
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
                <br />
              </>
            );
          }}
        </Formik>
      )}
      <div className="card card-body">
        <ImportantLinksTable
          impLinks={impLinks}
          setImpLinks={setImpLinks}
          edit={edit}
          setEdit={setEdit}
          editValues={editValues}
          setEditValues={setEditValues}
        />
      </div>
    </div>
  );
};

async function submitImpLinks(values, impLinks, setImpLinks, setShow, setMsg) {
  let fd = new FormData();
  fd.append("heading", values.heading);
  fd.append("type", values.type);
  fd.append("fromDate", values.fromDate);
  fd.append("toDate", values.toDate);
  if (values.file) {
    fd.append("file", values.file);
  }
  if (values.url) {
    fd.append("url", values.url);
  }
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  await API.post("impLinks", fd, config)
    .then((res) => {
      if (res.data.status === "success") {
        console.log(res.data.status);
        setImpLinks([...impLinks, res.data.data]);
        setShow(true);
        setMsg(res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setShow(true);
      setMsg(error.response.data.message);
    });
}
async function getImpLinks(setImpLinks, setShow, setMsg) {
  await API.get("/impLinks")
    .then((res) => {
      if (res.data.status === "success") {
        setImpLinks(res.data.data);
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
  impLinks,
  setImpLinks
) {
  await API.put("impLinks", editedUpdate)
    .then((res) => {
      if (res.data.status === "success") {
        console.log(res.data.status);
        // setImpLinks([...impLinks, res.data.data]);
        setImpLinks(
          impLinks.map((rec) => {
            if (rec.id != id) {
              return rec;
            } else {
              return { ...rec, ...res.data.data };
            }
          })
        );
        setEdit(false);
        setEditValues(myInitialValues);
        setShow(true);
        setMsg(res.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      setShow(true);
      setMsg(error.response.data.message);
    });
}
export default ImportantLinks;
