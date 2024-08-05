import React, { useEffect, useState, useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import API from "../../API";
import LatestUpdateTable from "./LatestUpdateTable";
import { UserContext, ShowContext } from "../../App";

let initialValues = {
  heading: "",
  url: "",
  fromDate: "",
  toDate: "",
  type: "",
  file: ""
};

const LatestUpdate = () => {
  const { setShow, setMsg } = useContext(ShowContext);
  const [latestUpdates, setLatestUpdates] = useState(null);
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState();

  const [myInitialValues, setMyInitialValues] = useState(initialValues)

  useEffect(() => {
    getLatestUpdates(setLatestUpdates);
  }, []);
  useEffect(() => {
    if (editValues) {
      setMyInitialValues(editValues);
    }
  }, [editValues]);

  return (
    <div className="py-3">
      <Formik
        initialValues={myInitialValues}
        enableReinitialize={true}
        validateOnBlur={true}
        onSubmit={(values, actions) => {
          submitLatestUpdates(
            values,
            setShow,
            setMsg,
            latestUpdates,
            setLatestUpdates,
            setEdit,
            setEditValues
          );
          actions.setSubmitting(false);

          actions.resetForm({
            values: initialValues,
          });
        }}
        validationSchema={Yup.object({
          heading: Yup.string().required("Heading is Required"),
          type: Yup.string().required("Type is Required"),
          fromDate: Yup.string().required("Start Date is Required"),
          toDate: Yup.string().required("End Date is Required"),
          file: Yup.string()
            .ensure()
            .when(["type"], {
              is: (type) => type == 1,
              then: Yup.string().required("PDF is Required"),
            }),
          url: Yup.string()
            .ensure()
            .when(["type"], {
              is: (type) => type != 1,
              then: Yup.string().required("URL is Required"),
            }),
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
            setFieldValue
          } = props;
          return (
            <>
              <div className="card card-body">
                <form
                  id="form-client"
                  method="post"
                  className="form-horizontal"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group row ">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                      <h3 className="text-center">Add Latest Updates</h3>
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
                  </div>
                  <div className="form-group row">
                    {values.type == "1" ?
                      <div className="col-sm-6 col-md-6 col-lg-6">
                        <label
                          htmlFor="file"
                          className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                        >
                          File :
                        </label>
                        <div className="col-sm-12 col-md-12 col-lg-12 ">
                          <input
                            type="file"
                            id="file"
                            name="file"
                            placeholder="PDF"
                            className="form-control"
                            onChange={(event) => {
                              handleChange(event);
                              setFieldValue(
                                "file_binary", event.currentTarget.files[0]
                              );
                            }}
                            onBlur={handleBlur}
                          />
                          {errors.file ? (
                            <div className="alert alert-danger">
                              {errors.file}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      :

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
                        </div>
                      </div>
                    }
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
                          value={values.toDate}
                          className="form-control"
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
                      {editValues ? "Edit" : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
              <br />
            </>
          );
        }}
      </Formik>
      <div className="card card-body">
        <LatestUpdateTable
          latestUpdates={latestUpdates}
          setLatestUpdates={setLatestUpdates}
          edit={edit}
          setEdit={setEdit}
          editValues={editValues}
          setEditValues={setEditValues}
        />
      </div>
    </div>
  );
};

async function submitLatestUpdates(
  values,
  setShow,
  setMsg,
  latestUpdates,
  setLatestUpdates,
  setEdit,
  setEditValues
) {
  let fd = new FormData();
  fd.append("heading", values.heading);
  fd.append("type", values.type);
  fd.append("fromDate", values.fromDate);
  fd.append("toDate", values.toDate);
  if (values.file) {
    fd.append("file", values.file_binary);
  }
  if (values.url) {
    fd.append("url", values.url);
  }
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  if (values.id) {
    fd.append("id", values.id);

    //-----------update-------
    await API.post("/latestUpdates/edit", fd, config)
      .then((res) => {
        if (res.data.status === "success") {
          setLatestUpdates(
            latestUpdates.map((rec) => {
              if (rec.id != values.id) {
                return rec;
              } else {
                return { ...rec, ...res.data.data };
              }
            })
          );
          setEdit(false);
          setEditValues();
          setShow(true);
          setMsg(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  } else {
    //---------create---------------
    await API.post("/latestUpdates", fd, config)
      .then((res) => {
        if (res.data.status === "success") {
          console.log(res.data.status);
          setLatestUpdates([...latestUpdates, res.data.data]);
          setShow(true);
          setMsg(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

}

function getLatestUpdates(setLatestUpdates) {
  API.get("/latestUpdates")
    .then((res) => {
      if (res.data.status === "success") {
        // setLatestUpdates(
        //   res.data.data.map((rec) => {
        //     let date = Date.now();
        //     let start = new Date(rec.fromDate);
        //     let end = new Date(rec.toDate);
        //     console.log("d", rec.toDate);
        //     return { ...rec, status: date > start && date < end };
        //   })
        // );
        setLatestUpdates(res.data.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// async function editLatestUpdate(
//   id,
//   editedUpdate,
//   setEdit,
//   setEditValues,
//   setShow,
//   setMsg,
//   latestUpdates,
//   setLatestUpdates
// ) {
//   await API.put("/latestUpdates", editedUpdate)
//     .then((res) => {
//       if (res.data.status === "success") {
//         console.log(res.data.status);
//         console.log(res.data);
//         setLatestUpdates(
//           latestUpdates.map((rec) => {
//             if (rec.id != id) {
//               return rec;
//             } else {
//               return { ...rec, ...res.data.data };
//             }
//           })
//         );
//         setEdit(false);
//         setEditValues(initialValues);
//         setShow(true);
//         setMsg(res.data.message);
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

export default LatestUpdate;
