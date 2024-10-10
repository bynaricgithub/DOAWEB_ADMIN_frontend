import React, { useState, useEffect } from "react";
import Content from "./Layout/Content";
import API from "./API";
import { useLocation, useNavigate } from "react-router-dom";
import AlertDismissible from "./AlertDismissible";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import useWhoAmI from "./CustomHooks/useWhoAmI";

export const ShowContext = React.createContext();
export const UserContext = React.createContext();

function App() {
    const [show, setShow] = useState(false);
    const [currentUser, setCurrentUser] = useWhoAmI();
    const [msg, setMsg] = useState();
    const [msgType, setMsgType] = useState();
    let location = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/login" || location.pathname === "/") {
            localStorage.clear();
            setCurrentUser();
        }
    });

    return (location.pathname === "/login" || location.pathname === "/") ? (
        <>
            <ShowContext.Provider value={{ setShow: setShow, setMsg: setMsg, setMsgType: setMsgType }}>
                <UserContext.Provider value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}>
                    <Routes>
                        <Route exact path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </UserContext.Provider>
            </ShowContext.Provider>

            <AlertDismissible myShow={show} mySetShow={setShow} myMsg={msg} msgType={msgType} />
        </>
    ) : (
        <div>
            <div id="wrapper">
                <ShowContext.Provider value={{ setShow: setShow, setMsg: setMsg, setMsgType: setMsgType }}>
                    <UserContext.Provider value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}>
                        <Content />
                    </UserContext.Provider>
                </ShowContext.Provider>

                <AlertDismissible myShow={show} mySetShow={setShow} myMsg={msg} msgType={msgType} />
            </div>
        </div>
    );
}

export default App;
