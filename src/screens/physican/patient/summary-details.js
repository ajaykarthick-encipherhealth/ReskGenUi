import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { IMAGES, SVGICON } from "../../../jsx/constant/theme";
import { Avatar, Space,DatePicker } from "antd";
import "./summary.css";

const SummaryDetails = () => {
  const [activeButton, setActiveButton] = useState("HCC Codes");

  const options = [
    { value: "1", label: "Novant Health" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
  const options2 = [
    { value: "1", label: "Home Health" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
  const options3 = [
    { value: "1", label: "Show Original" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
const onChange=(date, dateString) => {
	console.log(date, dateString);
  };
  return (
    <>
      <div className="container-fluid">
        <div>
          <h2>Summary Details</h2>
        </div>
        <div className="row">
          <div className="col-xl-6 col-sm-12">
            <div className="card summary">
              <div className="card-body">
                <p>Profile</p>

                <div className=" row">
                  <div className="col-xl-4 col-sm-12">
                    <div>
                      <div className="avatarContainer">
                        <Avatar>U</Avatar>{" "}
                      </div>
                      <div className="nameContainer"> name</div>
                      <div className="dotContainer">
                        {" "}
                        <span className="dot"></span>
                        <span className="">Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-8 col-sm-12">
                    <div className="row grid">
                      <div className="col-xl-6 col-sm-12">
                        <div className="iconDiv">
                          <i>{SVGICON.AgeIcon}</i> <span>Age</span>
                          <h6 className="ageDtails">45</h6>
                        </div>
                      </div>
                      <div className="col-xl-6 col-sm-12">
                        <div className="iconDiv">
                          <i>{SVGICON.GenerIcon}</i>
                          <span>Gender</span>
                          <h6 className="ageDtails">Male</h6>
                        </div>
                      </div>
                    </div>
                    <div className="row grid">
                      <div className="col-xl-6 col-sm-12">
                        <div className="iconDiv">
                          <i>{SVGICON.DateCreated}</i> <span>Date Created</span>
                          <h6 className="ageDtails">12/12/23</h6>
                        </div>
                      </div>
                      <div className="col-xl-6 col-sm-12">
                        <div className="iconDiv">
                          {" "}
                          <i>{SVGICON.DurationStatus}</i>
                          <span>Duration Status</span>
                          <h6 className="ageDtails">10 days / 15 days</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-sm-12">
            <div className="card summary">
              <div className="card-body">
                <div className="row">
                  <div className="box">
                    <span
                      className={`btnbox ${
                        activeButton === "HCC Codes" ? "activeButtonStyle" : ""
                      }`}
                      onClick={() => setActiveButton("HCC Codes")}
                    >
                      HCC Codes
                    </span>
                    <span
                      className={`btnbox ${
                        activeButton === "M.E.A.T Criteria"
                          ? "activeButtonStyle"
                          : ""
                      }`}
                      onClick={() => setActiveButton("M.E.A.T Criteria")}
                    >
                      M.E.A.T Criteria
                    </span>
                  </div>
                  {activeButton === "HCC Codes" && (
                    <div className="tablecontainer">
                      <table
                        id="empoloyeestbl2"
                        className="dataTable no-footer mb-2 mb-sm-0 tableSyle"
                        style={{
                          width: "90%",
                          margin: "auto",
                          marginTop: "10px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th>Codes</th>

                            <th> Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.map((item) => {
                            return (
                              <tr>
                                <td>
                                  <span>{item.code}</span>
                                </td>

                                <td>
                                  <span>{item.name}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeButton === "M.E.A.T Criteria" && (
                    <div className="tablecontainer">
                      <table
                        id="empoloyeestbl2"
                        className="dataTable no-footer mb-2 mb-sm-0 tableSyle"
                        style={{
                          width: "90%",
                          margin: "auto",
                          marginTop: "10px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th>Codes</th>

                            <th> Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.map((item) => {
                            return (
                              <tr>
                                <td>
                                  <span>{item.code}</span>
                                </td>

                                <td>
                                  <span>{item.name}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        
		  <div style={{display:"flex",gap:"10px"}}>
            {cardDatas?.map((item) => {
              return (
                <div className="col-xl-2.5 "  key={item.id}>
                  <div className="card summary">
                    <div className="card-body">
                      <span className="cardd-header">
                        <div><h5>{item.title}</h5></div>
						<div><DatePicker onChange={onChange}  className="picker"/></div>
                      </span>
                      <p>{item.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
		 
        </div>
      </div>
    </>
  );
};

const cardDatas = [
  {
    title: "Demographics",
    datepicker: "yes",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Demographics",
    datepicker: "yes",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Demographics",
    datepicker: "yes",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Demographics",
    datepicker: "yes",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];
const tableData = [
  {
    code: "N18.6 & Z99.2",
    name: "ESRD on PD",
  },
  {
    code: "110",
    name: "HTN",
  },
  {
    code: "E10.9",
    name: "Type 1 DM on CGM",
  },
  {
    code: "M14.6 & G62.9",
    name: "Charcot joint and polyneruopathy",
  },
  {
    code: "RO2 & M86.9",
    name: "Recent dry gangree with osteomyelitis",
  },
];

export default SummaryDetails;
