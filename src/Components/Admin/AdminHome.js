import React, {useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../App';

const AdminHome = (props) => {
    const { currentUser } = useContext(UserContext);
    const { state } = useLocation();
    return (
        currentUser ?
        <div>
            <div className="col-lg-12 col-md-12 col-sm-12 card">
            <h5><center>Dashboard</center></h5>
                    <div className="container-fluid" >
                        
                    </div>
            </div>
        </div>
        :null
    );
};

export default AdminHome;