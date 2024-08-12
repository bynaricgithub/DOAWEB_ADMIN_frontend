import axios from 'axios';
import { en, de } from './utils/Helper';
const serverPath = process.env.REACT_APP_SERVER_PROJPATH;

let API = axios.create({
  baseURL: serverPath,
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "frame-ancestors 'none';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Server': '',
    //extra options
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer-when-downgrade',
  }
});

API.interceptors.request.use(
  function (config) {
    // if (config.params) {
    //   //get api
    //   const keyArr = Object.keys(config.params);//array of keys
    //   keyArr.forEach(key => {
    //     config.params[key] = encodeURIComponent(en(config.params[key]));
    //   });

    // }
    // if (config.data) {
    //   //post api
    //   const keyArr = Object.keys(config.data);//array of keys
    //   keyArr.forEach(key => {
    //     config.data[key] = encodeURIComponent(en(config.data[key]));
        
    //   });
    // }
    if (window.location.pathname !== "/" || window.location.pathname !== "/login") {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
   // response.data = JSON.parse(de(response.data));
    return response;
  },
  (error) => {
   // error.response = JSON.parse(de(error.response.data));
    const status = error.response;
    let errRes = { ...error };
    if (status !== undefined && status.status === 401) {
      window.location.href = "/login";
    } else if (status !== undefined && status.status === 429) {
      errRes = {
        'response': {
          data: {
            message: "Server is Busy. Please wait for some seconds. Your Response will not be saved till this message keeps appearing."
          }
        }
      }

    } else if (status === undefined || !status) {
      errRes = {
        'response': {
          data: {
            message: "There is some problem with server response.Your Response will not be saved till this message keeps appearing."
          }
        }
      }
    }
    if (!error.response) {
      errRes = {
        'response': {
          data: {
            message: "Your Connection to server is lost. Please Check your internet Connection."
          }
        }
      }
    }
    return Promise.reject(errRes);
  }
);

export default API;