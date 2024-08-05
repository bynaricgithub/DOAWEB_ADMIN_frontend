import React from "react";
import Alert from "react-bootstrap/Alert";
import { useEffect } from "react";
import { Markup } from "interweave";

function AlertDismissible(props) {
  const{msgType}=props;

  useEffect(() => {
    const interval = setTimeout(() => {
      props.mySetShow(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [props]);

  return props.myShow && props.myMsg ? (
    <><center>
    <div
      className={msgType==="success"? "alert alert-success alert-dismissible fade show text-center" : "alert alert-danger alert-dismissible fade show text-center"}
      role="alert"
      style={{marginBottom:"30%",width:"30%"}}
    >
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={()=>props.mySetShow(false)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <Markup content={props.myMsg} />
    </div></center></>
  ) : null;
}

export default AlertDismissible;
