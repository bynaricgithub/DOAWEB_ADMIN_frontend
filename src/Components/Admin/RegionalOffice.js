/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import FormField from "../../utils/FormField";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from 'yup';
import BootstrapTable from "react-bootstrap-table-next";
import API from "../../API";
import { ShowContext } from "../../App";
import Pagination from "react-js-pagination";
import { uploadFileToS3 } from "../../utils/Helper";

const RegionalOffice = () => {

    const myInitialValues = {
        id: "",
        name: "",
        post: "",
        email: "",
        file: "",
        region: "",
    }

    const { setShow, setMsg } = useContext(ShowContext);

    const header = [
        { text: "Sr.No.", dataField: "srno" },
        { text: "Name", dataField: "name" },
        { text: "Post", dataField: "post" },
        { text: "Email", dataField: "email" },
        { text: "Region", dataField: "region" },
        { text: "Image", dataField: "image" },
        { text: "Edit", dataField: "edit" },
        { text: "Status", dataField: "status" },
    ];

    const regionList = [
        'Mumbai',
        'Nagpur',
        'Chatrapati Shambhaji Nagar',
    ]

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        post: Yup.string().required('Post is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        file: Yup.mixed().required('File is required'),
        region: Yup.string().required('Region is required')
    });

    const [list, setList] = useState();
    const [data, setData] = useState();

    const [editData, setEditData] = useState();

    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (list) {
            setCurPage(list.current_page);
            setPerPage(list.per_page);
            setTotal(list.total);

            getData(list.data)
        }
    }, [list]);

    useEffect(() => {
        getRegionalOffices(1)
    }, [])



    return <div className="py-3">
        <div className="card">
            <div className="card-body">
                <h3>
                    <center>Add Regional Officers</center>
                </h3>

                <Formik
                    initialValues={{
                        id: editData?.id || "",
                        name: editData?.name || "",
                        post: editData?.post || "",
                        email: editData?.email || "",
                        file: "",
                        region: editData?.region || "",
                    }}

                    enableReinitialize={true}

                    validationSchema={!editData && validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        console.log(values);
                        if (editData) {
                            updateData({
                                ...values,
                                img_path: editData.img_path,
                            }, setSubmitting, resetForm)
                        } else {
                            addData(values, setSubmitting, resetForm)
                        }
                    }}
                >
                    {({ values, handleChange, setFieldValue, isSubmitting }) => (<Form>

                        <div className="row">
                            <div className="col-sm-6">
                                <FormField
                                    values={values}
                                    name="name"
                                    heading="Name"
                                />
                            </div>
                            <div className="col-sm-6">
                                <FormField
                                    values={values}
                                    name="post"
                                    heading="Post"
                                />
                            </div>
                            <div className="col-sm-6">
                                <FormField
                                    values={values}
                                    name="email"
                                    heading="Email"
                                />
                            </div>
                            <div className="col-sm-6">
                                <FormField
                                    values={values}
                                    name="file"
                                    heading="Image File"
                                    type="file"
                                    setFieldValue={setFieldValue}
                                />
                            </div>
                            <div className="col-sm-6">
                                <FormField
                                    values={values}
                                    name="region"
                                    heading="Select Region"
                                    as='select'
                                    options={regionList?.map((item, i) => <option key={i} value={item}>{item}</option>)}
                                />
                            </div>
                        </div>

                        <div className="text-center py-3">
                            <button
                                type="submit"
                                className="btn btn-primary mx-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        &nbsp;Submitting...
                                    </>
                                ) : 'Submit'}
                            </button>
                            {editData && <button
                                type="button"
                                className="btn btn-danger mx-2"
                                onClick={e => setEditData()}
                                disabled={isSubmitting}
                            >Cancel</button>}
                        </div>

                    </Form>)}
                </Formik>
            </div>
        </div>
        <div className="card my-3">
            <div className="card-body">


                <div className="m-3">
                    {data &&
                        data?.length > 0 &&
                        <BootstrapTable
                            data={data}
                            columns={header}
                            keyField="srno"
                            headerClasses="allTable_header text-center"
                        />}
                </div>
                <div className="mt-3 d-flex justify-content-around">
                    <Pagination
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) => {
                            setCurPage(pageNumber);
                            getRegionalOffices(pageNumber)
                        }}
                        itemClass="page-item"
                        linkClass="page-link"
                        firstPageText="First"
                        lastPageText="Last"
                    />
                </div>
            </div>
        </div>
    </div>;

    function getData(params) {
        setData(params.map((item, i) => {
            return {
                ...item,
                srno: i + 1,
                image: <img src={item.img_path} height={50} width={50} alt={item.name} ></img>,
                edit: (
                    <button
                        className="btn btn-warning"
                        onClick={() => setEditData(item)}
                    >
                        Edit
                    </button>
                ),
                status: (
                    <label class="switch">
                        <input
                            type="checkbox"
                            checked={item.status}
                            onChange={() => {
                                updateStatus(
                                    item.id,
                                    item.status ? 0 : 1,
                                );
                            }}
                        />
                        <span class="slider round"></span>
                    </label>
                ),
            }
        }))
    }

    async function getRegionalOffices(page) {
        try {
            const res = await API.get("/regional-office", { params: { page } })
            setList(res.data?.data)
            // show({ message: data.message, displayClass: data.status })
        } catch (error) {
            setShow(true);
            setMsg(error.response.data.message);
        }
    }

    async function updateData(values, setSubmitting, resetForm) {
        try {
            if (values.file instanceof File) {
                values.img_path = await uploadFileToS3(values.file, "regionalOffices")
            }

            console.log(values);
            const res = await API.put("/regional-office", values)
            setList((pre) => ({
                ...pre,
                data: pre.data.map((rec) => {
                    if (rec.id != values.id) {
                        return rec;
                    } else {
                        return { ...rec, ...res.data.data };
                    }
                }),
            }));
            setEditData()
            resetForm()
            setShow(true);
            setMsg(data.message);
            setSubmitting(false)
        } catch (error) {
            setSubmitting(false)
            setShow(true);
            setMsg(error.response.data.message);
        }
    }
    async function addData(values, setSubmitting, resetForm) {
        try {
            if (values.file instanceof File) {
                values.img_path = await uploadFileToS3(values.file, "regionalOffices")
            }
            const res = await API.post("/regional-office", values)
            resetForm()
            setList(pre => ({
                ...pre,
                data: [...pre.data, res.data.data]
            }));
            setSubmitting(false)
        } catch (error) {
            resetForm()
            setSubmitting(false)
            setShow(true);
            setMsg(error.response.data.message);
        }
    }

    async function updateStatus(id, status) {
        await API.post("/regional-office/disable", { id: id, status: status })
            .then((res) => {
                if (res.data.status === "success") {
                    setList(pre => ({
                        ...pre,
                        data: pre.data.map((rec) => {
                            if (rec.id != id) {
                                return rec;
                            } else {
                                return { ...rec, status: parseInt(rec.status) ? 0 : 1 };
                            }
                        })
                    })
                    );
                    setShow(true);
                    setMsg(res.data.message);
                }
            })
            .catch((error) => {
                setShow(true);
                setMsg(error.response.data.message);
            });
    }
};

export default RegionalOffice;
