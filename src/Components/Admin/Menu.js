import React, { useEffect, useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import MenuTable from "./MenuTable";

const myInitialValues = { title: "", parent_id: "", menu_url: "" };

function Menu() {
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [list, setList] = useState();
    const [edit, setEdit] = useState(false);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        getMenu(setList, 1);
    }, []);
    return currentUser ? (
        <div className="py-3">
            {edit ? (
                <Formik
                    initialValues={myInitialValues}
                    onSubmit={(values, actions) => {
                        editMenu(
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
                                    <center>Edit Menu Item</center>
                                </h3>
                                <div className="container-fluid">
                                    <Form>
                                        <div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Enter name of Menu Item
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <Field
                                                            name="title"
                                                            type="text"
                                                            value={editValues.title}
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                setEditValues({
                                                                    ...editValues,
                                                                    title: e.target.value,
                                                                });
                                                            }}
                                                        />
                                                        <ErrorMessage name="title">
                                                            {(msg) => (
                                                                <div className="alert alert-danger">{msg}</div>
                                                            )}
                                                        </ErrorMessage>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">Enter the Menu Url</div>
                                                    <div className="col-lg-8">
                                                        <Field
                                                            name="menu_url"
                                                            type="text"
                                                            value={editValues.menu_url}
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                setEditValues({
                                                                    ...editValues,
                                                                    menu_url: e.target.value,
                                                                });
                                                            }}
                                                        />
                                                        <ErrorMessage name="menu_url">
                                                            {(msg) => (
                                                                <div className="alert alert-danger">{msg}</div>
                                                            )}
                                                        </ErrorMessage>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">Select the Parent Menu</div>
                                                    <div className="col-lg-8">
                                                        {/* <Field
                              name="parent_id"
                              type="text"
                              value={values.parent_id}
                              className="form-control"
                            /> */}
                                                        <Field
                                                            name="parent_id"
                                                            as="select"
                                                            value={editValues.parent_id}
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                setEditValues({
                                                                    ...editValues,
                                                                    parent_id: e.target.value,
                                                                });
                                                            }}
                                                        >
                                                            <option>Select Parent Menu</option>
                                                            <option value={0}>None</option>
                                                            {list &&
                                                                list?.data?.map((item) => (
                                                                    <option value={item.id} disabled={item.id === editValues.id}>{item.title}</option>
                                                                ))}
                                                        </Field>
                                                        <ErrorMessage name="parent_id">
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
                        saveMenu(values, list, setList, setShow, setMsg);
                        // saveOfficer(values, setShow, setMsg, list, setList);
                        actions.setSubmitting(false);
                        actions.resetForm({
                            values: myInitialValues,
                        });
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
                                    <center>Add Menu Item</center>
                                </h3>
                                <div className="container-fluid">
                                    <Form>
                                        <div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">
                                                        Enter name of Menu Item
                                                    </div>
                                                    <div className="col-lg-8">
                                                        <Field
                                                            name="title"
                                                            type="text"
                                                            value={values.title}
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage name="title">
                                                            {(msg) => (
                                                                <div className="alert alert-danger">{msg}</div>
                                                            )}
                                                        </ErrorMessage>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">Enter the Menu Url</div>
                                                    <div className="col-lg-8">
                                                        <Field
                                                            name="menu_url"
                                                            type="text"
                                                            value={values.menu_url}
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage name="menu_url">
                                                            {(msg) => (
                                                                <div className="alert alert-danger">{msg}</div>
                                                            )}
                                                        </ErrorMessage>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-12 row">
                                                    <div className="col-lg-4">Select the Parent Menu</div>
                                                    <div className="col-lg-8">
                                                        {/* <Field
                              name="parent_id"
                              type="text"
                              value={values.parent_id}
                              className="form-control"
                            /> */}
                                                        <Field
                                                            name="parent_id"
                                                            as="select"
                                                            value={values.parent_id}
                                                            className="form-control"
                                                        >
                                                            <option>Select Parent Menu</option>
                                                            <option value={0}>None</option>
                                                            {list &&
                                                                list?.data?.map((item) => (
                                                                    <option value={item.id}>{item.title}</option>
                                                                ))}
                                                        </Field>
                                                        <ErrorMessage name="parent_id">
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
                <MenuTable
                    list={list}
                    setList={setList}
                    edit={edit}
                    setEdit={setEdit}
                    editValues={editValues}
                    setEditValues={setEditValues}
                    getMenu={getMenu}
                />
            </div>
        </div>
    ) : null;
    async function getMenu(setList, page) {
        await API.get("/homemenu", { params: { page } })
            .then((res) => {
                if (res.data.status === "success") {
                    setList({ data: res.data.data });
                }
            })
            .catch((error) => {
                setShow(true);
                setMsg(error.response.data.message);
            });
    }
    async function saveMenu(values, list, setList, setShow, setMsg) {
        if (values.parent_id === "" || values.parent_id === "0") {
            values.parent_id = 0;
        } else {
            values.parent_id = parseInt(values.parent_id);
        }
        await API.post("/homemenu", values)
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
                console.log(error);
                setShow(true);
                setMsg(error.response.data.message);
            });
    }
    async function editMenu(
        id,
        editedUpdate,
        setEdit,
        setEditValues,
        setShow,
        setMsg,
        list,
        setList
    ) {
        if (editedUpdate.parent_id === "" || editedUpdate.parent_id === "0") {
            editedUpdate.parent_id = 0;
        } else {
            editedUpdate.parent_id = parseInt(editedUpdate.parent_id);
        }
        await API.put("/homemenu", editedUpdate)
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

export default Menu;
