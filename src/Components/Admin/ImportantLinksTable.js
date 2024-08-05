import React, { useState, useEffect, useContext } from "react";
import { UserContext, ShowContext } from "../../App";
import API from "../../API";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "react-js-pagination";

function ImportantLinksTable(props) {
  const { impLinks, setImpLinks, edit, setEdit, editValues, setEditValues } =
    props;
  const { currentUser } = useContext(UserContext);
  const { setShow, setMsg } = useContext(ShowContext);
  const [header, setHeader] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (impLinks) {
      console.log("impLinks : ", impLinks);
      setHeader(getHeader());
      setData(
        getData(
          impLinks,
          setShow,
          setMsg,
          setImpLinks,
          edit,
          setEdit,
          editValues,
          setEditValues
        )
      );
    }
  }, [impLinks]);
  return currentUser && data ? (
    <div style={{ marginTop: "20px", marginBottom: "20px", overflowX: "scroll" }}>
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
    { text: "Sr.No.", dataField: "srno" },
    { text: "Heading", dataField: "heading" },
    { text: "Url", dataField: "url" },
    { text: "Type", dataField: "type" },
    { text: "Start Date", dataField: "fromDate" },
    { text: "End Date", dataField: "toDate" },
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
  setImpLinks,
  edit,
  setEdit,
  editValues,
  setEditValues
) {
  let myData = [];
  let i = 1;
  if (list !== undefined && list.length > 0) {
    list.map((data, index) => {
      let date = Date.now();
      let start = new Date(data.fromDate);
      let end = new Date(data.toDate);
      myData.push({
        srno: <center>{i++}</center>,
        heading: data.heading,
        url: data.url,
        type: data.type ? (data.type == 1 ? "PDF" : "Web URL") : "",
        fromDate: data.fromDate,
        toDate: data.toDate,
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
              disabled={date < start || date > end}
              onChange={() => {
                updateStatus(
                  data.id,
                  data.status ? 0 : 1,
                  setShow,
                  setMsg,
                  list,
                  setImpLinks
                );
              }}
            />
            <span class="slider round"></span>
          </label>
        ),
        // delete: <button className="btn btn-danger" onClick={() => { deleteRecord(data.id, setShow, setMsg, list, setImpLinks); }}>Delete</button>,
      });
    });
  }
  return myData;
}

async function deleteRecord(id, setShow, setMsg, impLinks, setImpLinks) {
  await API.delete("/impLinks", { params: { id: id } })
    .then((res) => {
      if (res.data.status === "success") {
        setImpLinks(impLinks.filter((rec) => rec.id != id));
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
  impLinks,
  setImpLinks
) {
  // setImpLinks(
  //   impLinks.map((rec) => {
  //     if (rec.id != id) {
  //       return rec;
  //     } else {
  //       return { ...rec, status: !rec.status };
  //     }
  //   })
  // );
  // setShow(true);
  // setMsg("Updated");
  await API.post("/impLinks/disable", { id: id, status: status })
    .then((res) => {
      if (res.data.status === "success") {
        // setLatestUpdates(latestUpdates.filter((rec) => rec.id != id));
        setImpLinks(
          impLinks.map((rec) => {
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

export default ImportantLinksTable;
