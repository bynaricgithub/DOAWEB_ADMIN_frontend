import React, { useContext, useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "react-js-pagination";
import API from "../../API";
import { ShowContext, UserContext } from "../../App";

function LatestUpdateTable({
    latestUpdates,
    setLatestUpdates,
    edit,
    setEdit,
    editValues,
    setEditValues,
    getLatestUpdates,
}) {
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [header, setHeader] = useState();
    const [data, setData] = useState();

    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (latestUpdates) {
            setCurPage(latestUpdates.current_page);
            setPerPage(latestUpdates.per_page);
            setTotal(latestUpdates.total);
        }
    }, [latestUpdates]);

    useEffect(() => {
        if (latestUpdates) {
            setHeader(getHeader());
            setData(
                getData(
                    latestUpdates,
                    setShow,
                    setMsg,
                    setLatestUpdates,
                    edit,
                    setEdit,
                    editValues,
                    setEditValues,
                    curPage,
                    perPage,
                    total
                )
            );
        }
    }, [latestUpdates, edit]);

    return (
        <>
            {currentUser && data ? (
                <>
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
                                getLatestUpdates(setLatestUpdates, pageNumber);
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

    function getData(
        list,
        setShow,
        setMsg,
        setLatestUpdates,
        edit,
        setEdit,
        editValues,
        setEditValues,
        curPage,
        perPage,
        total
    ) {
        let myData = [];
        let i = (curPage - 1) * perPage + 1;

        if (list !== undefined && list?.data?.length > 0) {
            list.data.map((data, index) => {
                let date = Date.now();
                let start = new Date(data.fromDate);
                let end = new Date(data.toDate);
                myData.push({
                    srno: i++,
                    heading: data.heading,
                    url: data.url,
                    start_date: data.fromDate,
                    end_date: data.toDate,
                    edit: (
                        <button
                            key={`btn_${index}`}
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
                        <label class="switch" key={`label_${index}`}>
                            <input
                                key={`input_${index}`}
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
                                        setLatestUpdates
                                    );
                                }}
                            />
                            <span class="slider round"></span>
                        </label>
                    ),
                    // delete: (
                    //   <button
                    //     className="btn btn-danger"
                    //     onClick={() => {
                    //       deleteRecord(data.id, setShow, setMsg, list, setLatestUpdates);
                    //     }}
                    //   >
                    //     Delete
                    //   </button>
                    // ),
                });
            });
        }
        return myData;
    }
    function getHeader() {
        let myHeader = [
            { text: "Sr.No.", dataField: "srno" },
            { text: "Heading", dataField: "heading" },
            { text: "URL", dataField: "url" },
            { text: "Start Date", dataField: "start_date" },
            { text: "End Date", dataField: "end_date" },
            { text: "Edit", dataField: "edit" },
            { text: "Status", dataField: "status" },
            // { text: "Delete", dataField: "delete" },
        ];
        return myHeader;
    }

    async function deleteRecord(
        id,
        setShow,
        setMsg,
        latestUpdates,
        setLatestUpdates
    ) {
        await API.delete("/latestUpdates", { params: { id: id } })
            .then((res) => {
                if (res.data.status === "success") {
                    setLatestUpdates(latestUpdates.filter((rec) => rec.id != id));
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
        latestUpdates,
        setLatestUpdates
    ) {
        await API.post("/latestUpdates/disable", { id: id, status: status })
            .then((res) => {
                if (res.data.status === "success") {
                    setLatestUpdates({
                        ...latestUpdates,
                        data: latestUpdates?.data?.map((rec) => {
                            if (rec.id != id) {
                                return rec;
                            } else {
                                return { ...rec, status: status };
                            }
                        }),
                    });
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

export default LatestUpdateTable;
