import AWS from "aws-sdk";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import API from "../../API";
import { ShowContext, UserContext } from "../../App";
import PhotoList from "./PhotoList";

const myInitialValues = { name: "", post: "", file: "" };
function UploadPhoto() {
    AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: "ap-south-1",
    });

    const s3 = new AWS.S3({
        params: { Bucket: "msbae-assets" },
    });

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
                        editLatestUpdate(
                            editValues.id,
                            editValues,
                            setEdit,
                            setEditValues,
                            setShow,
                            setMsg,
                            photos,
                            setPhotos,
                            values
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
                                            <div className="col-lg-12 d-flex justify-content-center pb-3">
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
                                                            setEdit(false);
                                                        }}
                                                        disabled={isSubmitting}
                                                        className="btn btn-primary mx-2"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
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

    async function saveDignitaries(values, setShow, setMsg, photos, setPhotos) {
        var flag = 0;
        var fileUrl = "";
        if (values.file) {
            //-------------------Send file then store values-----------------------
            const params = {
                Bucket: "msbae-assets",
                Key: `dignitaries/${values.file.name}`,
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
            fd.append("name", values.name);
            fd.append("post", values.post);
            fd.append("file", fileUrl);

            await API.post("/photo", fd)
                .then((res) => {
                    if (res.data.status === "success") {
                        setShow(true);
                        setMsg(res.data.message);
                    }
                })
                .catch((error) => {
                    setShow(true);
                    setMsg(error.response.data.message);
                });
        }
    }

    async function editLatestUpdate(
        id,
        editedUpdate,
        setEdit,
        setEditValues,
        setShow,
        setMsg,
        photos,
        setPhotos,
        values
    ) {
        var flag = 0;
        var fileUrl = "";
        if (values.file) {
            //-------------------Send file then store values-----------------------
            const params = {
                Bucket: "msbae-assets",
                Key: `dignitaries/${values.file.name}`,
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
            fd.append("name", editedUpdate.name);
            fd.append("post", editedUpdate.post);
            if (editedUpdate.file) {
                fd.append("file", fileUrl);
            }
            fd.append("id", editedUpdate.id);

            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
            };

            await API.post("/photo/update", fd, config)
                .then((res) => {
                    if (res.data.status === "success") {
                        setPhotos((pre) => ({
                            ...pre,
                            data: photos.data.map((rec) => {
                                if (rec.id !== id) {
                                    return rec;
                                } else {
                                    return { ...rec, ...res.data.data };
                                }
                            }),
                        }));
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
    }
}

export default UploadPhoto;
