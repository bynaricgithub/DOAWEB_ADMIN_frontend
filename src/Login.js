import React, { useState, useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ShowContext, UserContext } from "./App";
import API from "./API";
import { useNavigate } from 'react-router-dom';
import ClientCaptcha from "react-client-captcha";
import { Markup } from 'interweave';

const Login = () => {
  const { setShow, setMsg } = useContext(ShowContext);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [eyeType, setEyeType] = useState(true);
  const [loggedUser, setLoggedUser] = useState();
  const [myRecaptcha, setMyRecaptcha] = useState();
  const [myMsg, setMyMsg] = useState();

  let navigate = useNavigate();
  let myValues = { username: "msbte_admin", password: "1", captcha: 'xyz' };

  return (
    <>
      <Formik
        initialValues={myValues}
        onSubmit={async (values, actions) => {
          if (values.captcha !== undefined && values.captcha !== '' && values.captcha !== null) {
            // if (myRecaptcha === values.captcha) {

            await validateAdmin(values, setMyMsg, setCurrentUser, navigate);

            actions.setSubmitting(false);
            // actions.resetForm({
            //   values: {
            //     username: '', password: '', captcha: ''
            //   },
            // });
            // }
            // else {
            //   setMyMsg('Invalid Captcha Entered...');
            // }
          }
          else {
            setMyMsg('Please Use Captcha For Login...');
          }
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("*Username Required"),
          password: Yup.string().required("*Password is Required"),
          captcha: Yup.string().required("*Captcha is Required"),

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
          } = props;
          return (
            <div className="loginBackground">
              <div className="accountbg">
                <div className="content-center">
                  <div className="content-desc-center">
                    <div className="container">
                      <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-8">
                          <div className="card loginCard">
                            <div className="card-body loginCard2">
                              <h3 className="text-center mt-0 m-b-15">
                                <a href="index.html" className="logo logo-admin">
                                </a>
                              </h3>
                              <h4 className="text-muted text-center font-18 loginHead">
                                <b>Log In</b>
                              </h4>
                              <div className="p-2">
                                <form
                                  className="form-horizontal m-t-20"
                                  onSubmit={handleSubmit}
                                >
                                  <div className="form-group row ">
                                    <div className="col-12 col-md-12 col-sm-12">
                                      <input
                                        name="username"
                                        id="username"
                                        className="form-control loginInputField"
                                        type="text"
                                        placeholder="Username"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.username && touched.username && (
                                        <div className="alert alert-danger inputLogin">
                                          {errors.username}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="form-group row mt-3">
                                    <div className="col-lg-11 col-md-11 col-sm-11">
                                      <input
                                        name="password"
                                        id="password"
                                        className="form-control loginInputField passeyefield"
                                        type="password"
                                        placeholder="Password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      /> {errors.password && touched.password && (
                                        <div className="alert alert-danger inputLogin">
                                          {errors.password}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-1 col-md-1 col-sm-1 passeye">
                                      <a href={() => { void (0); }} onClick={async () => {
                                        if (eyeType) {
                                          document.getElementById("eye").classList.remove('fa-eye');
                                          setEyeType(!eyeType);
                                          document.getElementById("password").type = "text";
                                          document.getElementById("eye").classList.add('fa-eye-slash');
                                        }
                                        else {
                                          document.getElementById("eye").classList.remove('fa-eye-slash');
                                          setEyeType(!eyeType);
                                          document.getElementById("password").type = "password";
                                          document.getElementById("eye").classList.add('fa-eye');
                                        }
                                      }}>
                                        <div id="eye" toggle="#password" className="fa fa-fw fa-eye field-icon toggle-password"></div>
                                      </a>

                                    </div>
                                  </div>

                                  <div className="form-group col-lg-12 col-md-12 col-sm-12 row captcharowstyle">
                                    <div className="col-lg-7 col-md-7 col-sm-12">
                                      <input className="form-control" id="captcha" name="captcha"
                                        type="text"
                                        value={values.captcha}
                                        placeholder="Captcha Code"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.captcha && touched.captcha && (
                                        <div className="alert alert-danger inputLogin">
                                          {errors.captcha}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-5 col-md-5 col-sm-12">
                                      <ClientCaptcha captchaCode={code => setMyRecaptcha(code)} chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789" fontColor="blue" backgroundColor="pink" fontSize={24} />
                                    </div>
                                  </div>

                                  <div className="form-group text-center row m-t-20">
                                    <div className="col-12 col-xs-12">
                                      <button
                                        className="btn loginButton btn-block waves-effect waves-light"
                                        type="submit"
                                      >
                                        Log In
                                      </button>
                                    </div>
                                  </div>

                                  <br />
                                  {myMsg !== undefined && (
                                    <div className="col-lg-12 alert alert-danger animate__animated animate__bounceIn animate_slow"><Markup content={myMsg} /></div>
                                  )}
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </>
  );
};

async function validateAdmin(values, setMyMsg, setCurrentUser, navigate) {
  await API.post('login', { "username": values.username, "password": values.password })
    .then(res => {
      if (res.data.status === 'success') {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        setCurrentUser(res.data.data);
        navigate('/home');
      }
      else {
        setMyMsg(res.response.data.message);
      }
    })
    .catch(function (error) {
      console.log("Login Error: ", error);
      setMyMsg(error.response.data.message);
    });
}

export default Login;
