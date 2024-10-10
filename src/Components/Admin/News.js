import AWS from "aws-sdk";
import React, { useEffect, useState, useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import API from "../../API";

import { ShowContext } from "../../App";
import NewsTable from "./NewsTable";

let initialValues = {
    heading: "",
    url: "",
    date: "",
    fromDate: "",
    toDate: "",
    type: "",
    status: "",

};

const News = () => {
    AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: "ap-south-1",
    });

    const s3 = new AWS.S3({
        params: { Bucket: "msbae-assets" },
    });

    const { setShow, setMsg } = useContext(ShowContext);
    const [circularData, setCircularData] = useState(null);
    const [edit, setEdit] = useState(false);
    const [editValues, setEditValues] = useState();
    const [myInitialValues, setMyInitialValues] = useState(initialValues)

    useEffect(() => {
        getCirculardata(setCircularData, 1);
    }, []);
    useEffect(() => {
        if (editValues) {
            setMyInitialValues({ ...editValues });
        }
    }, [editValues]);
    return (
        <div className="py-3">
            <Formik
                initialValues={myInitialValues}
                enableReinitialize={true}
                validateOnBlur={true}
                onSubmit={(values, actions) => {
                    submitCircular(
                        values,
                        circularData,
                        setCircularData,
                        setShow,
                        setMsg,
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
                    // fromDate: Yup.string().required("Start Date is Required"),
                    // toDate: Yup.string().required("End Date is Required"),
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
                    date: Yup.string().required("Announcement Date is Required"),
                    // category: Yup.string().required("Category is Required"),
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
                                            <h3 className="text-center">Add News And Announcement</h3>
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
                                        <div className="col-sm-2 col-md-2 col-lg-2">
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
                                        {/* <div className="col-sm-4 col-md-4 col-lg-4">
                      <label
                        htmlFor="category"
                        className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                      >
                        Category :
                      </label>
                      <div className="col-sm-4 col-md-12 col-lg-12">
                        <select
                          name="category"
                          className="form form-control"
                          value={values.category}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          <option value="">Please Select</option>
                          <option value="1">Circular/Office Order</option>
                          <option value="2">Extra Curricular Activites</option>
                          <option value="3">Trainings</option>
                          <option value="4">GR</option>
                          <option value="6">Downloads</option>

                        </select>
                        {errors.category ? (
                          <div className="alert alert-danger">
                            {errors.category}
                          </div>
                        ) : null}
                      </div>
                    </div> */}

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
                                                htmlFor="date"
                                                className="col-sm-4 col-md-12 col-lg-12 col-form-label"
                                            >
                                                Date
                                            </label>
                                            <div className="col-sm-4 col-md-12 col-lg-12">
                                                <input
                                                    type="datetime-local"
                                                    id="date"
                                                    name="date"
                                                    className="form-control"
                                                    value={values.date}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                                {errors.date ? (
                                                    <div className="alert alert-danger">
                                                        {errors.date}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                    </div>
                                    {/* <div className="form-group row">
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
                  </div> */}
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
                <NewsTable
                    circularData={circularData}
                    setCircularData={setCircularData}
                    edit={edit}
                    setEdit={setEdit}
                    editValues={editValues}
                    setEditValues={setEditValues}
                    getCirculardata={getCirculardata}
                />
            </div>
        </div>

    );
    async function submitCircular(
        values,
        circularData,
        setCircularData,
        setShow,
        setMsg,
        setEdit,
        setEditValues

    ) {
        console.log(values);

        var flag = 0;
        var fileUrl = "";
        if (values.file) {
            //-------------------Send file then store values-----------------------
            const params = {
                Bucket: "msbae-assets",
                Key: `news/${values.file_binary.name}`,
                Body: values.file_binary,
                ACL: "public-read",
                ContentType: values.file_binary.type,
            };

            // Upload the file to S3 using a Promise
            try {
                const data = await s3.upload(params).promise(); // Using promise()
                fileUrl = data.Location;
                console.log("File uploaded successfully:", data.Location);
                flag = 1;
            } catch (err) {
                console.error("Error uploading file:", err);
                flag = 0;
            }
        } else {
            //---------------------------Store values directly---------------------
            flag = 1;
        }

        if (flag) {
            let fd = new FormData();
            fd.append("heading", values.heading);
            fd.append("type", values.type);
            fd.append("fromDate", values.fromDate);
            fd.append("toDate", values.toDate);
            fd.append("date", values.date);
            fd.append("status", values.category);
            if (values.file) {
                fd.append("file", fileUrl);
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
                await API.post("/news/edit", fd, config)
                    .then((res) => {
                        if (res.data.status === "success") {
                            setCircularData((pre) => ({
                                ...pre,
                                data: pre.data.map((rec) => {
                                    if (rec.id !== values.id) {
                                        return rec;
                                    } else {
                                        return { ...rec, ...res.data.data };
                                    }
                                }),
                            }));

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
                await API.post("/news", fd, config)
                    .then((res) => {
                        if (res.data.status === "success") {
                            setCircularData((pre) => ({
                                ...pre,
                                data: [...pre.data, res.data.data]
                            }));
                            setShow(true);
                            setMsg(res.data.message);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }


        }
    }
};


function getCirculardata(setCircularData, page) {
    API.get("/news", { params: { page } })
        .then((res) => {
            if (res.data.status === "success") {
                setCircularData(res.data.data);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}


export default News;
