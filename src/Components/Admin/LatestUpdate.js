import AWS from "aws-sdk";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import API from "../../API";
import { ShowContext } from "../../App";
import LatestUpdateTable from "./LatestUpdateTable";

let initialValues = {
    heading: "",
    url: "",
    fromDate: "",
    toDate: "",
    type: "",
    file: "",
};

const LatestUpdate = () => {
    AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: "ap-south-1",
    });

    const s3 = new AWS.S3({
        params: { Bucket: "msbae-assets" },
    });

    const { setShow, setMsg } = useContext(ShowContext);
    const [latestUpdates, setLatestUpdates] = useState(null);
    const [edit, setEdit] = useState(false);
    const [editValues, setEditValues] = useState();

    const [myInitialValues, setMyInitialValues] = useState(initialValues);

    useEffect(() => {
        getLatestUpdates(setLatestUpdates, 1);
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
                    file: Yup.mixed().when("type", {
                        is: (type) => type === 1 && !editValues,
                        then: Yup.mixed().required("PDF is Required"),
                    }),
                    url: Yup.string().when("type", {
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
                        setFieldValue,
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
                                        {values.type == "1" ? (
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
                                                            setFieldValue(
                                                                "file",
                                                                event.currentTarget.files[0]
                                                            ); // store the file object directly
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
                                        ) : (
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
                                        )}
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
                                            className="btn btn-primary mx-2"
                                        >
                                            {editValues ? "Edit" : "Submit"}
                                        </button>
                                        {editValues && (
                                            <button
                                                onClick={(e) => {
                                                    setEditValues();
                                                    setMyInitialValues(initialValues);
                                                    setEdit(false);
                                                }}
                                                disabled={isSubmitting}
                                                className="btn btn-primary mx-2"
                                            >
                                                Cancel
                                            </button>
                                        )}
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
                    getLatestUpdates={getLatestUpdates}
                />
            </div>
        </div>
    );

    async function submitLatestUpdates(
        values,
        setShow,
        setMsg,
        latestUpdates,
        setLatestUpdates,
        setEdit,
        setEditValues
    ) {
        var flag = 0;
        var fileUrl = "";
        if (values.file) {
            //-------------------Send file then store values-----------------------
            const params = {
                Bucket: "msbae-assets",
                Key: `latestUpdate/${values.file.name}`,
                Body: values.file,
                ACL: "public-read",
                ContentType: values.file.type,
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
            if (values.file) {
                fd.append("file", fileUrl);
            }
            if (values.url) {
                fd.append("url", values.url);
            }

            if (values.id) {
                fd.append("id", values.id);
                //-----------update-------
                await API.post("/latestUpdates/edit", fd)
                    .then((res) => {
                        if (res.data.status === "success") {
                            setLatestUpdates((pre) => ({
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
                await API.post("/latestUpdates", fd)
                    .then((res) => {
                        if (res.data.status === "success") {

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
    }

    function getLatestUpdates(setLatestUpdates, page) {
        API.get("/latestUpdates", { params: { page: page } })
            .then((res) => {
                if (res.data.status === "success") {
                    setLatestUpdates(res.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
};

export default LatestUpdate;
