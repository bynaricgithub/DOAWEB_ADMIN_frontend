import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "react-js-pagination";

const categoryList = [
    { id: 1, label: "Circular/Office Order" },
    { id: 2, label: "Seminar/Conference/Workshop" },
    { id: 3, label: "Trainings" },
    { id: 4, label: "Government Resolutions" },
    { id: 5, label: "Important Act" },
    { id: 6, label: "Downloads" },
];

function CircularTable({
    circularData,
    setCircularData,
    edit,
    setEdit,
    editValues,
    setEditValues,
    getCirculardata
}) {
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [header, setHeader] = useState();
    const [data, setData] = useState();


    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (circularData) {
            setCurPage(circularData.current_page);
            setPerPage(circularData.per_page);
            setTotal(circularData.total);
        }
    }, [circularData]);


    useEffect(() => {
        if (circularData) {
            setHeader(getHeader());
            setData(
                getData(
                    circularData,
                    setShow,
                    setMsg,
                    setCircularData,
                    edit,
                    setEdit,
                    editValues,
                    setEditValues,
                    getCategory
                )
            );
        }
    }, [circularData, edit]);

    const getCategory = (catId) => {
        const category = categoryList.find(c => c.id == catId);
        return category ? category.label : ""
    }


    return (
        <>
            {currentUser && data ? (<>
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <BootstrapTable
                        keyField="srno"
                        data={data}
                        columns={header}
                        headerClasses="allTable_header text-center"
                    />
                </div>
                <div className="mt-3">
                    <Pagination
                        totalItemsCount={total}
                        activePage={curPage}
                        itemsCountPerPage={perPage}
                        onChange={(pageNumber) => {
                            setCurPage(pageNumber);
                            getCirculardata(setCircularData, pageNumber);
                        }}
                        itemClass="page-item"
                        linkClass="page-link"
                        firstPageText="First"
                        lastPageText="Last"
                    />
                </div>
            </>
            ) : null}
        </>
    );

    function getHeader() {
        let myHeader = [
            { text: "Sr.\nNo.", dataField: "srno" },
            { text: "Date", dataField: "date" },
            {
                text: "Heading", dataField: "heading"
                // , formatter: (col, row) => { return <span style={{ display: 'block', width: "300px", overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap' }}>{col}</span> }
            },
            {
                text: "URL", dataField: "url", formatter: (col, row) => { return <span style={{ display: 'block', width: "300px", overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap' }}>{col}</span> }
            },
            { text: "Category", dataField: "category", formatter: (col, row) => { return <span style={{ display: 'block', width: "180px", overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap' }}>{col}</span> } },
            { text: "Start\nDate", dataField: "start_date" },
            { text: "End\nDate", dataField: "end_date" },
            { text: "Edit", dataField: "edit" },
            { text: "Status", dataField: "status" },
            // { text: 'Delete', dataField: 'delete' },
        ];
        return myHeader;
    }

    function getData(
        list,
        setShow,
        setMsg,
        setCircularData,
        edit,
        setEdit,
        editValues,
        setEditValues,
        getCategory
    ) {
        let myData = [];
        let i = (curPage - 1) * perPage + 1;
        if (list !== undefined && list?.data?.length > 0) {
            list?.data?.map((data, index) => {
                let date = Date.now();
                let start = new Date(data.fromDate);
                let end = new Date(data.toDate);
                myData.push({
                    srno: i++,
                    date: data.date,
                    heading: data.heading,
                    url: data.url,
                    category: getCategory(data.category),
                    start_date: data.fromDate,
                    end_date: data.toDate,
                    edit: (
                        <button
                            key={"btn_" + index}
                            className="btn btn-warning"
                            onClick={() => {
                                setEdit(true);
                                setEditValues(data);
                            }}
                            disabled={edit}
                        >
                            Edit
                        </button>
                    ),
                    status: (
                        <label className="switch" key={"label_" + index}>
                            <input
                                key={"input_" + index}
                                type="checkbox"
                                checked={data.status}
                                disabled={date < start || date > end}
                                onChange={() => {
                                    updateStatus(
                                        data.id,
                                        data.status ? 0 : 1,
                                        setShow,
                                        setMsg,
                                        list,
                                        setCircularData
                                    );
                                }}
                            />
                            <span key={"slider_" + index} className="slider round"></span>
                        </label>
                    ),
                    // delete: <button className="btn btn-danger" onClick={() => { deleteRecord(data.id, setShow, setMsg, list, setCircularData); }}>Delete</button>,
                });
            });
        }
        return myData;
    }

    async function deleteRecord(
        id,
        setShow,
        setMsg,
        circularData,
        setCircularData
    ) {
        await API.delete("/circulars", { params: { id: id } })
            .then((res) => {
                if (res.data.status === "success") {
                    setCircularData(circularData.filter((rec) => rec.id != id));
                    setShow(true);
                    setMsg(res.data.message);
                }
            })
            .catch((error) => {
                setShow(true);
                setMsg(error.response.data.message);
            });
    }

    async function updateStatus(
        id,
        status,
        setShow,
        setMsg,
        circularData,
        setCircularData
    ) {
        // setCircularData(
        //   circularData.map((rec) => {
        //     if (rec.id != id) {
        //       return rec;
        //     } else {
        //       return { ...rec, status: !rec.status };
        //     }
        //   })
        // );
        // setShow(true);
        // setMsg("Updated");
        await API.post("/circulars/disable", { id: id, status: status })
            .then((res) => {
                if (res.data.status === "success") {
                    // setLatestUpdates(latestUpdates.filter((rec) => rec.id != id));
                    setCircularData(pre => ({
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
}

export default CircularTable;
