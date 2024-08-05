import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import BootstrapTable from "react-bootstrap-table-next";

function OfficersList({
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
    getOfficers(setList, setShow, setMsg);
  }, []);

  const header = getHeader();
  const data = getData(
    list,
    setShow,
    setMsg,
    setList,
    edit,
    setEdit,
    editValues,
    setEditValues
  );

  return currentUser && data ? (
    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
      <BootstrapTable
        keyField="srno"
        data={data}
        columns={header}
        headerClasses="allTable_header text-center"
      />
    </div>
  ) : null;
}

function getHeader() {
  let myHeader = [
    { text: "Sr No", dataField: "srno" },
    { text: "Name of Officer", dataField: "name" },
    { text: "Post of Officer", dataField: "post" },
    { text: "Phone Number", dataField: "phone" },
    { text: "Email-Id", dataField: "email" },
    { text: "Image", dataField: "img" },
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
  if (list !== undefined) {
    list.map((data, index) => {
      myData.push({
        srno: <center>{i++}</center>,
        name: data.name,
        post: data.post,
        phone: data.phone,
        email: data.email,
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

async function getOfficers(setList, setShow, setMsg) {
  await API.get("/Officers")
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
  await API.post("/Officers/disable", { id: id, status: status })
    .then((res) => {
      if (res.data.status === "success") {
        setList(
          list.map((rec) => {
            if (rec.id != id) {
              return rec;
            } else {
              return { ...rec, status: !rec.status };
            }
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

export default OfficersList;
