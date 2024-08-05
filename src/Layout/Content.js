import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "../Components/Admin/AdminHome";
import Sidebar from "./Sidebar";
import Circular from "../Components/Admin/Circular";
import UploadPhoto from "../Components/Admin/UploadPhoto";
import LatestUpdate from "../Components/Admin/LatestUpdate";
import ImportantLinks from "../Components/Admin/ImportantLinks";
import EventPhoto from "../Components/Admin/EventPhoto";
import Officers from "../Components/Admin/Officer";
import EventVideo from "../Components/Admin/EventVideo";
import GoverningCouncil from "../Components/Admin/GoverningCouncil";
import GoverningBoard from "../Components/Admin/GoverningBoard";
import Menu from "../Components/Admin/Menu";

const Content = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  });
  return currentUser ? (
    <>
      <div>
        <Sidebar />
        <div className="content-page">
          <div className="content">
            <Header />
            <div className="page-content-wrapper ">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/circular" element={<Circular />} />
                <Route path="/latestUpdates" element={<LatestUpdate />} />
                <Route path="/importantLinks" element={<ImportantLinks />} />
                <Route path="/msbteOfficers" element={<Officers />} />
                <Route
                  path="/governingCouncil"
                  element={<GoverningCouncil />}
                />
                <Route path="/governingBoard" element={<GoverningBoard />} />

                <Route path="/photo" element={<UploadPhoto />} />

                <Route path="/photo" element={<UploadPhoto />} />
                <Route path="/eventPhoto" element={<EventPhoto />} />
                <Route path="/eventVideo" element={<EventVideo />} />

                <Route path="/menu" element={<Menu />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  ) : null;
};

export default Content;
