import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import GoverningCouncilList from "./GoverningCouncilList";

const myInitialValues = { name: "", post: "", description: "" };

function GoverningCouncil() {
    const ref = React.useRef();
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [list, setList] = useState();
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
                                    <center>Edit Governing Council</center>
                                </h3>
                                <div className="container-fluid">
                                    <Form>
                                        <div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">Enter name of Member</div>
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
                                                    <div className="col-lg-4">Enter Post of Member</div>
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
                                                        Enter Description of the Member
                                                    </div>
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
                                                                <div className="alert alert-danger">{msg}</div>
                                                            )}
                                                        </ErrorMessage>
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
                                                {editValues && <button
                                                    onClick={e => {
                                                        setEditValues()
                                                        setEdit(false)
                                                    }}
                                                    disabled={isSubmitting}
                                                    className="btn btn-primary mx-2"
                                                >
                                                    Cancel
                                                </button>}
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
                                    <center>Add Governing Council</center>
                                </h3>
                                <div className="container-fluid">
                                    <Form>
                                        <div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">Enter name of Member</div>
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
                                                    <div className="col-lg-4">Enter Post of Member</div>
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
                                                        Enter Description of the Member
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <Field
                                                            name="description"
                                                            type="text"
                                                            value={values.description}
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage name="description">
                                                            {(msg) => (
                                                                <div className="alert alert-danger">{msg}</div>
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
                            <br />
                        </>
                    )}
                </Formik>
            )}
            <div className="card card-body">
                <GoverningCouncilList
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
    await API.post("/councils", values)
        .then((res) => {
            if (res.data.status === "success") {
                setList(pre => ({
                    ...pre,
                    data: [...pre.data, res.data.data]
                }));
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
    await API.post("/councils/update", editedUpdate)
        .then((res) => {
            if (res.data.status === "success") {
                setList(pre => ({
                    ...pre,
                    data: pre.data.map((rec) => {
                        if (rec.id != id) {
                            return rec;
                        } else {
                            return { ...rec, ...res.data.data };
                        }
                    })
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

export default GoverningCouncil;
