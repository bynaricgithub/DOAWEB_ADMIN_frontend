import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "react-js-pagination";

function GoverningCouncilList({
    list,
    setList,
    edit,
    setEdit,
    editValues,
    setEditValues,
}) {
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);

    useEffect(() => {
        getOfficers(setList, 1);
    }, []);

    const [data, setData] = useState();
    const [header, setHeader] = useState();

    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (list) {
            setCurPage(list.current_page);
            setPerPage(list.per_page);
            setTotal(list.total);
        }

    }, [list]);


    useEffect(() => {
        setHeader(getHeader());
        setData(getData(
            list,
            setShow,
            setMsg,
            setList,
            edit,
            setEdit,
            editValues,
            setEditValues
        ));
    }, [list, edit]);


    return currentUser && data ? (<>
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
                    getOfficers(setList, pageNumber);
                }}
                itemClass="page-item"
                linkClass="page-link"
                firstPageText="First"
                lastPageText="Last"
            />
        </div>
    </>
    ) : null;
    function getHeader() {
        let myHeader = [
            { text: "Sr No", dataField: "srno" },
            { text: "Name of Officer", dataField: "name" },
            { text: "Post of Officer", dataField: "post" },
            { text: "Description", dataField: "description" },
            { text: "Edit", dataField: "edit" },
            { text: "Status", dataField: "status" },
        ];
        return myHeader;
    }

    function getData(
        list,
        setShow,
        setMsg,
        setList,
        edit,
        setEdit,
        editValues,
        setEditValues
    ) {
        let myData = [];
        let i = (curPage - 1) * perPage + 1;
        if (list) {
            list?.data?.map((data, index) => {
                myData.push({
                    srno: i++,
                    name: data.name,
                    post: data.post,
                    description: data.description,
                    edit: (
                        <button
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
                        <label class="switch">
                            <input
                                type="checkbox"
                                checked={data.status}
                                onChange={() => {
                                    updateStatus(
                                        data.id,
                                        data.status ? 0 : 1,
                                        setShow,
                                        setMsg,
                                        list,
                                        setList
                                    );
                                }}
                            />
                            <span class="slider round"></span>
                        </label>
                    ),
                });
            });
        }
        return myData;
    }

    async function getOfficers(setList, page) {
        await API.get("/councils", { params: { page } })
            .then((res) => {
                if (res.data.status === "success") {
                    setList(res.data.data);
                }
            })
            .catch((error) => {
                setShow(true);
                setMsg(error.response.data.message);
            });
    }

    async function updateStatus(id, status, setShow, setMsg, list, setList) {
        await API.post("/councils/disable", { id: id, status: status })
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
}


export default GoverningCouncilList;
