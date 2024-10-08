import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "react-js-pagination";

const PhotoList = ({
    photos,
    setPhotos,
    edit,
    setEdit,
    editValues,
    setEditValues,
}) => {
    const { currentUser } = useContext(UserContext);
    const { setShow, setMsg } = useContext(ShowContext);


    const [curPage, setCurPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (photos) {
            setCurPage(photos.current_page);
            setPerPage(photos.per_page);
            setTotal(photos.total);
        }
    }, [photos]);


    useEffect(() => {
        getPhotos(setPhotos, 1);
    }, []);

    const header = getHeader();
    const data = getData(
        photos,
        setShow,
        setMsg,
        setPhotos,
        edit,
        setEdit,
        editValues,
        setEditValues
    );

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
                    getPhotos(setPhotos, pageNumber);
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
            { text: "Name of Dignitary", dataField: "name" },
            { text: "Post of Dignitary", dataField: "post" },
            { text: "Image", dataField: "img" },
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
        setPhotos,
        edit,
        setEdit,
        editValues,
        setEditValues
    ) {
        let myData = [];
        let i = (curPage - 1) * perPage + 1;
        if (list !== undefined) {
            list?.data?.map((data, index) => {
                myData.push({
                    srno: i++,
                    name: data.name,
                    post: data.post,
                    img: <img src={data.img_path} height={50} width={50}></img>,
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
                                        setPhotos
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
                    //       deleteRecord(data.id, setShow, setMsg, setPhotos, list);
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

    async function deleteRecord(id, setShow, setMsg, setPhotos, list) {
        await API.delete("/photo/" + id)
            .then((res) => {
                if (res.data.status === "success") {
                    setPhotos(list.filter((rec) => rec.id != id));
                }
            })
            .catch((error) => {
                setShow(true);
                setMsg(error.response.data.message);
            });
    }

    async function getPhotos(setPhotos, page) {
        await API.get("/photo", { params: { page } })
            .then((res) => {
                if (res.data.status === "success") {
                    setPhotos(res.data.data);
                    // setPhotos(
                    //   res.data.data.map((rec) => {
                    //     return { ...rec, status: rec.id % 2 ? true : false };
                    //   })
                    // );
                }
            })
            .catch((error) => {
                setShow(true);
                setMsg(error.response.data.message);
            });
    }

    async function updateStatus(id, status, setShow, setMsg, list, setPhotos) {
        // setPhotos(
        //   list.map((rec) => {
        //     if (rec.id != id) {
        //       return rec;
        //     } else {
        //       return { ...rec, status: !rec.status };
        //     }
        //   })
        // );
        // setShow(true);
        // setMsg("Updated");
        await API.post("/photo/disable", { id: id, status: status })
            .then((res) => {
                if (res.data.status === "success") {
                    // setLatestUpdates(latestUpdates.filter((rec) => rec.id != id));
                    setPhotos(pre => ({
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

export default PhotoList;
