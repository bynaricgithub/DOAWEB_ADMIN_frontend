import React, { useContext, useState, useEffect } from "react";
import { hideShow } from "../utils/Helper";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import "font-awesome/css/font-awesome.min.css";
import { collapseMenu } from "../utils/Helper";

const Sidebar = (props) => {
  const { currentUser } = useContext(UserContext);

  return currentUser ? (
    <div>
      <div className="left side-menu" id="sidebar">
        <button
          type="button"
          className="button-menu-mobile button-menu-mobile-topbar open-left waves-effect"
          onClick={() => {
            hideShow();
          }}
        >
          <i className="ion-close" />
        </button>
        <div className="left-side-logo d-block d-lg-none">
          <div className="text-center">
            <a href="index.html" className="logo">
              <img
                className="logo_msbte"
                src="assets/images/Msbte.png"
                height={60}
                alt="Msbte_logo"
              />
            </a>
          </div>
        </div>
        <div className="sidebar-inner slimscrollleft">
          <div id="sidebar-menu">
            <ul className="sidebar_menu">
              <li className="hover_effect">
                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/home" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Home</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/latestUpdates" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Add Latest Update</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/importantLinks" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Add IMP Links</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/photo" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Add Photos</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/eventPhoto" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Add Event Photos</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/circular" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Add Circulars</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/msbteOfficers" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Add MSBTE Officers</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/eventVideo" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Add Event Videos</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/governingCouncil" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Governing Council</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/governingBoard" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Governing Board</span>
                </NavLink>

                <NavLink
                  className="nav-link waves-effect"
                  to={{ pathname: "/menu" }}
                >
                  <img className="logos" src="assets/images/dashboard.png" />
                  <span className="p_logos"> Menu </span>
                </NavLink>
              </li>

              {/* <li className="has_sub hover_effect">
                  <a href="#" className="waves-effect" onClick={() => {
                    collapseMenu();
                  }}>
                    <img className="logos" src="assets/images/dashboard.png" />
                    <span className="p_logos"> Elements </span>{" "}
                    <span className="menu-arrow float-right">
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                  </a>
                  <ul className="list-unstyled">
                    <li className="hover_effect">
                      <NavLink className="nav-link waves-effect" to={{ pathname: "/home" }} >
                        <img className="logos" src="assets/images/dashboard.png" />
                        <span className="p_logos">Link 1</span>
                      </NavLink>
                    </li>
                    <li className="hover_effect">
                      <NavLink className="nav-link waves-effect" to={{ pathname: "/home" }} >
                        <img className="logos" src="assets/images/dashboard.png" />
                        <span className="p_logos"> Link 2</span>
                      </NavLink>
                    </li>
                  </ul>
                </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Sidebar;
