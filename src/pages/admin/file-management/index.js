import React, { useState, useEffect } from "react";

import { Nav, Tab } from "react-bootstrap";
import NavBar from "../../../jsx/layouts/nav";

import FileProcessing from "./file-processing";
import DataValidation from "./data-validation";
import { useSelector } from "react-redux";

const FileManagement = () => {
  const sideMenu = useSelector((state) => state.sideMenu);
  const [activeComponent, setActiveComponent] = useState(<FileProcessing />);
  const navigetPage = (pageTitle) => {
    console.log(pageTitle);
    if (pageTitle == "File Processing") {
      setActiveComponent(<FileProcessing />);
    }
    if (pageTitle == "Data Validation") {
      setActiveComponent(<DataValidation />);
    }
  };

  useEffect(() => {}, []);

  const tabList = [
    { title: "File Processing", type: "File Processing" },
    { title: "Data Validation", type: "Data Validation" },
    { title: "Settings", type: "Settings" },
  ];

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="card height80 file-management">
                  <div className="card-body p-0">
                    <Tab.Container defaultActiveKey={"File Processing"}>
                      <div className="card-header border-0 flex-wrap">
                        <Nav as="ul" className="nav nav-pills mix-chart-tab">
                          {tabList.map((item, index) => (
                            <Nav.Item as="li" className="nav-item" key={index}>
                              <Nav.Link
                                onClick={() => navigetPage(item.type)}
                                eventKey={item.title}
                              >
                                {item.title}
                              </Nav.Link>
                            </Nav.Item>
                          ))}
                        </Nav>
                      </div>
                    </Tab.Container>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body p-0">{activeComponent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileManagement;
