import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "react-js-pagination";

const EventVideoTable = (props) => {
    const { videos, setVideos, edit, setEdit, editValues, setEditValues, getVideos } = props;
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);
    const [header, setHeader] = useState();
    const [data, setData] = useState();



    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (videos) {
            setCurPage(videos.current_page);
            setPerPage(videos.per_page);
            setTotal(videos.total);
        }
    }, [videos]);



    useEffect(() => {
        if (videos) {
            setHeader(getHeader());
            setData(
                getData(
                    videos,
                    setShow,
                    setMsg,
                    setVideos,
                    edit,
                    setEdit,
                    editValues,
                    setEditValues
                )
            );
        }
    }, [videos, edit]);

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
                    getVideos(setVideos, pageNumber);
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
            { text: "Sr.No.", dataField: "srno" },
            { text: "Name", dataField: "name" },
            { text: "Description", dataField: "description" },
            { text: "Video", dataField: "url" },
            { text: "Edit", dataField: "edit" },
            { text: "Status", dataField: "status" },
        ];
        return myHeader;
    }

    function getData(
        list,
        setShow,
        setMsg,
        setVideos,
        edit,
        setEdit,
        editValues,
        setEditValues
    ) {
        let myData = [];
        let i = (curPage - 1) * perPage + 1;
        if (list !== undefined && list.data.length > 0) {
            list?.data?.map((data, index) => {
                myData.push({
                    srno: i++,
                    name: data.name,
                    description: data.description,
                    url: data.url,
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
                                        setVideos
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

    async function deleteRecord(id, setShow, setMsg, videos, setVideos) {
        await API.delete("/events", { params: { id: id } })
            .then((res) => {
                if (res.data.status === "success") {
                    setVideos(videos.filter((rec) => rec.id != id));
                    setShow(true);
                    setMsg(res.data.message);
                }
            })
            .catch((error) => {
                setShow(true);
                setMsg(error.response.data.message);
            });
    }

    async function updateStatus(id, status, setShow, setMsg, videos, setVideos) {
        await API.post("/EventVideos/disable", { id: id, status: status })
            .then((res) => {
                if (res.data.status === "success") {
                    setVideos(pre => ({
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

export default EventVideoTable;
