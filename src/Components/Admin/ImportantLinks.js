import AWS from "aws-sdk";
import { Formik } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import API from "../../API";
import { ShowContext } from "../../App";
import ImportantLinksTable from "./ImportantLinksTable";

let InitialValues = {
    heading: "",
    url: "",
    type: "",
    fromDate: "",
    toDate: "",
    file: "",
};

const ImportantLinks = () => {
    AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: "ap-south-1",
    });

    const s3 = new AWS.S3({
        params: { Bucket: "msbae-assets" },
    });

    const ref = useRef();
    const [impLinks, setImpLinks] = useState();
    const { setShow, setMsg } = useContext(ShowContext);
    const [edit, setEdit] = useState(false);
    const [editValues, setEditValues] = useState({});
    const [file, setFile] = useState();
    const [myInitialValues, setMyInitialValues] = useState(InitialValues);

    useEffect(() => {
        getImpLinks(setImpLinks, 1);
    }, []);

    useEffect(() => {
        if (editValues) {
            setMyInitialValues({ ...editValues });
        }
    }, [editValues]);

    return (
        <div className="py-3 ">
            {edit ? (
                <Formik
                    initialValues={myInitialValues}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    onSubmit={(values, actions) => {
                        editLatestUpdate(
                            editValues.id,
                            editValues,
                            { ...values, file }
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
                                                    {editValues.type == 1 ? "PDF :" : "URL :"}
                                                </label>
                                                <div className="col-sm-12 col-md-12 col-lg-12 ">
                                                    {editValues.type == 1 ? (
                                                        <>
                                                            <input
                                                                type="file"
                                                                id="file"
                                                                name="file"
                                                                placeholder="PDF"
                                                                ref={ref}
                                                                className="form-control"
                                                                // value={editValues.url}
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
                                                                value={editValues.url}
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
                                                className="btn btn-primary mx-2"
                                            >
                                                {editValues ? "Edit" : "Submit"}
                                            </button>
                                            {editValues && (
                                                <button
                                                    onClick={(e) => {
                                                        setMyInitialValues(InitialValues)
                                                        setEditValues();
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
                    getImpLinks={getImpLinks}
                />
            </div>
        </div>
    );

    async function submitImpLinks(
        values,
        impLinks,
        setImpLinks,
        setShow,
        setMsg
    ) {
        var flag = 0;
        var fileUrl = "";
        if (values.file) {
            //-------------------Send file then store values-----------------------
            const params = {
                Bucket: "msbae-assets",
                Key: `ImpDocs/${values.file.name}`,
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

            await API.post("impLinks", fd)
                .then((res) => {
                    if (res.data.status === "success") {
                        setImpLinks((pre) => ({
                            ...pre,
                            data: [...pre.data, res.data.data]
                        }));
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
    }
    async function getImpLinks(setImpLinks, page) {
        await API.get("/impLinks", { params: { page } })
            .then((res) => {
                if (res.data.status === "success") {
                    setImpLinks(res.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function editLatestUpdate(
        id,
        editedUpdate,
        values
    ) {
        console.log({ editedUpdate, values });
        var flag = 0;
        var fileUrl = "";
        if (values.file) {
            //-------------------Send file then store values-----------------------
            const params = {
                Bucket: "msbae-assets",
                Key: `ImpDocs/${values.file.name}`,
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
            fd.append("id", editedUpdate.id);
            fd.append("heading", editedUpdate.heading);
            fd.append("type", editedUpdate.type);
            fd.append("fromDate", editedUpdate.fromDate);
            fd.append("toDate", editedUpdate.toDate);
            if (values.file) {
                fd.append("file", fileUrl);
                fd.append("url", fileUrl);
            }
            if (values.url) {
                fd.append("url", values.url);
            }
            await API.put("impLinks", fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    if (res.data.status === "success") {
                        console.log(res.data.status);
                        setImpLinks((pre) => ({
                            ...pre,
                            data: pre.data.map((rec) => {
                                if (rec.id !== id) {
                                    return rec;
                                } else {
                                    return { ...rec, ...res.data.data };
                                }
                            }),
                        }));
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
    }
};

export default ImportantLinks;
