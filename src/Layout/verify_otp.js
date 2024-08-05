import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobilePhone } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import API from "../API";
import { UserContext, ShowContext } from "../App";

let myValues = { digit1: "", digit2: "", digit3: "", digit4: "" };

const VerifyOtp = (props) => {
  const { loggedUser } = props;
  const { setShow, setMsg } = useContext(ShowContext);
  const { setCurrentUser } = useContext(UserContext);
  let navigate = useNavigate();

  return (
    <>

      <div style={{ "width": "100%" }}>
        <Formik
          initialValues={myValues}
          onSubmit={async (values, actions) => {

            verifyOTP(values, loggedUser,setCurrentUser, navigate,setMsg,setShow);
          }}
          validationSchema={Yup.object().shape({
            digit1: Yup.string().required("Please Enter First Digit"),
            digit2: Yup.string().required("Please Enter Second Digit"),
            digit3: Yup.string().required("Please Enter Third Digit"),
            digit4: Yup.string().required("Please Enter Fourth Digit"),
          })}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            } = props;
            return (
              <form className="form-horizontal m-t-20" onSubmit={handleSubmit}>
                <div
                  className="container d-flex justify-content-center align-items-center col-lg-12 col-md-12 col-sm-12 "
                  style={{ marginTop: "10%" }}
                >
                  <div className="card text-center">
                    <div className="cardHeader p-5">
                      <FontAwesomeIcon
                        className="OTP_MOBILE"
                        icon={faMobilePhone}
                      />

                      <h5 className="mb-2 ">OTP VERIFICATION</h5>
                      <div className="h5Header">
                        <p>
                          <b>OTP has been send to ******{ String(loggedUser.user.mobile).slice(-4) }</b>
                        </p>
                      </div>
                    </div>
                    <div className="input-container d-flex flex-row justify-content-center mt-1 col-lg-9 col-md-9 col-sm-9">
                      <input
                        type="text"
                        className="m-1 text-center form-control rounded"
                        name="digit1"
                        maxLength="1"
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        value={values.digit1}
                      />
                      <input
                        type="text"
                        className="m-1 text-center form-control rounded"
                        name="digit2"
                        maxLength="1"
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        value={values.digit2}
                      />
                      <input
                        type="text"
                        className="m-1 text-center form-control rounded"
                        name="digit3"
                        maxLength="1"
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        value={values.digit3}
                      />
                      <input
                        type="text"
                        className="m-1 text-center form-control rounded"
                        name="digit4"
                        maxLength="1"
                        onChange={(e) => handleChange(e)}
                        onBlur={handleBlur}
                        value={values.digit4}
                      />
                    </div>

                    {errors.digit1 && touched.digit1 && (
                      <div className="alert alert-danger">{errors.digit1}</div>
                    )}

                    <div className="col-lg-6 col-md-6 col-sm-10">
                      <p className="resendOTP">
                        <b>*Resend OTP</b>
                      </p>
                    </div>

                    <div className="mt-3 mb-5">
                      <button
                        className="btn btn-success px-4 verify-btn"
                        type="submit"
                      >
                        verify
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

async function verifyOTP(values, loggedUser,setCurrentUser, navigate,setMsg,setShow) {
  const otp = values.digit1 + "" + values.digit2 + "" + values.digit3 + "" + values.digit4;
  const params = { otp: otp, mobile: loggedUser.user.mobile };
  
  await API.post("Authenticate/ckeckOTP", params)
    .then((res) => {
      if (res.data.status === "success") {
        
        localStorage.setItem("token", JSON.stringify(loggedUser.token));
        setCurrentUser(loggedUser.user)
        
        if (loggedUser.user.role === 'ADMIN') {
          navigate('/adminHome');
        } else if (loggedUser.user.role === 'PAPERSETTER') {
          navigate('/home');
        } else if (loggedUser.user.role === 'MODERATOR') {
          navigate('/dashboardHome');
        } else if (loggedUser.user.role === 'PRINTING_USER') {
          navigate('/printingHome');
        }
      } else {
        setMsg(res.data.message)
        setShow(true);
       
      }
    })
    .catch(function (error) {
      setShow(true);
      setMsg(error.response.data.message);
    });
}

export default VerifyOtp;
