import API from "../API";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useWhoAmI = () => {
    const [currentUser, setCurrentUser] = useState();
    let location = useLocation();
    
    useEffect(() => {
        if (location.pathname !== '/' && location.pathname !== '/login') {
            whosMe();
        }
    }, []);

    async function whosMe() {
       const res = await API.get('whoAmI');
        let data = res.data.data;
        if (res.data.status === 'success') {
            setCurrentUser(data);
        }
    }

    return [
        currentUser,
        setCurrentUser
    ]
}

export default useWhoAmI;