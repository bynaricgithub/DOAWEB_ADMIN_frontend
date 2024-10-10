import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from 'react-bootstrap-table2-paginator';

function MenuTable({
  list,
  setList,
  edit,
  setEdit,
  editValues,
  setEditValues,
  getMenu,
}) {
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [header, setHeader] = useState();
  const [data, setData] = useState();




  useEffect(() => {
    if (list) {
      setHeader(getHeader());
      setData(
        getData(
          list,
          setShow,
          setMsg,
          setList,
          edit,
          setEdit,
          editValues,
          setEditValues
        )
      );
    }
  }, [list, edit]);
  return currentUser && data ? (<>
    <div
      style={{ marginTop: "20px", marginBottom: "20px", overflowX: "scroll" }}
    >
      <BootstrapTable
        keyField="srno"
        data={data}
        columns={header}
        headerClasses="allTable_header text-center"
        pagination={paginationFactory()}
      />
    </div>
  </>
  ) : null;

  function getHeader() {
    let myHeader = [
      { text: "Sr.No.", dataField: "srno" },
      { text: "Title", dataField: "title" },
      { text: "Url", dataField: "url" },
      { text: "Parent", dataField: "parent" },
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
    let i = 1;
    if (list !== undefined && list?.data?.length > 0) {
      let menuItems = {};

      list?.data?.map((data, index) => {
        myData.push({
          srno: i++,
          title: data.title,
          url: data.menu_url,
          parent: data.parent?.title || "",
          edit: (
            <center>
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
            </center>
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

  async function updateStatus(id, status, setShow, setMsg, list, setList) {
    await API.post("/homemenu/disable", { id: id, status: status })
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

export default MenuTable;
