import React,{useContext} from "react";
import { hideShow } from "../utils/Helper";
import { UserContext } from '../App';
import API from "../API";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { currentUser } = useContext(UserContext);
  let navigate = useNavigate();
  return (
    <div>
      <div className="topbar">
        <div className="topbar-left	d-none d-lg-block">
          <div className="text-center">
            <a href="#" className="logo">
              <img className="logo_msbte" src="assets/images/Msbte.png" height={60} alt="Msbte_logo" />
            </a>
          </div>
        </div>
        <nav className="navbar-custom">
          <ul className="list-inline menu-left mb-0">
            <li className="list-inline-item">
              <button
                type="button"
                className="button-menu-mobile open-left waves-effect"
                onClick={() => {
                  hideShow();
                }}
              >
                <i className="ion-navicon" />
              </button>
            </li>
           
            {currentUser ?
            <li className="list-inline-item dropdown notification-list" style={{"float":"right"}}>
              <a style={{color:"white"}}>{currentUser.role}</a>
              <a
                className="nav-link dropdown-toggle arrow-none waves-effect nav-user"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
               
                <FontAwesomeIcon className="rounded-circle" style={{'color':'white'}} icon={faUser} />
              </a>
              <div className="dropdown-menu dropdown-menu-right dropdown-menu-animated profile-dropdown ">
                <a className="dropdown-item" href="#" onClick={() => {logout(currentUser,navigate);}}>
                  <i className="mdi mdi-logout m-r-5 text-muted" /> Logout
                </a>
              </div>
            </li>
            :null}
          </ul>
          <div className="clearfix" />
        </nav>
      </div>
    </div>
  );
};

async function logout(currentUser,navigate)
{
  await API.post('logout')
  .then(res => 
  {
    if (res.data.status === 'success') 
    {
        localStorage.clear();
        navigate('/login');
    }
  })
  .catch(function (error) 
  {
    localStorage.clear();
    navigate('/login');
  });
}



export default Header;
