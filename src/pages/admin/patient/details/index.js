import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import NavBar from "../../../../jsx/layouts/nav";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm } from "antd";

export default function PatientDetails() {
  const sideMenu = useSelector(state => state.sideMenu);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isLoading, setIsLoading] = useState(false);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [validDiseasesList, setValidDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  useEffect(() => {

  }, []);


 

  const confirmvalid = () =>
    new Promise((resolve) => {
      validMoveConfirm();
      setTimeout(() => resolve(null), 1000);
    });
  const confirmInvalid = () =>
    new Promise((resolve) => {
      invalidMoveConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const onchangeValid = (data) => {
    setSelectDiseasesName(data);
  };
  const validMoveConfirm = () => {
    const result = validDiseasesList.filter(
      (res) => res.name != selectDiseasesName
    );
    setValidDiseasesList(result);
    var namePush = [];
    namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...invalidDiseasesList, ...namePush];
    setInvalidDiseasesList(newArray);
  };
  const invalidMoveConfirm = () => {
    const result = invalidDiseasesList.filter(
      (res) => res.name != selectDiseasesName
    );
    setInvalidDiseasesList(result);
    var namePush = [];
    namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...validDiseasesList, ...namePush];
    setValidDiseasesList(newArray);
  };

  const comboCodeSplit = (combo) => {
    console.log(combo)
    const myArray = combo.split("\n");
    console.log(myArray)
    var splitCodes = [];
    var splitCodesArr = [];

    myArray.map((res)=>{   
      var split1 = res.split(":");
      // console.log(split1)
      splitCodes.push(split1);
      
  });  
  
  splitCodes.map((res)=>{   
    console.log(res)
    // res.map((res2)=>{   
      // console.log(res2);
      if(res.length > 1){
      if(res[0] == 'AI'){
      splitCodesArr.push({
        name:res[1],
        code:res[2]
      })
    }else{
      splitCodesArr.push({
        name:res[0],
        code:res[1]
      })
    }
  }

    
});  

console.log(splitCodesArr);


    setComboDiseaseCodesList(splitCodesArr)
  };

  return (
    <>
    <div className={`show ${ sideMenu ? "menu-toggle" : ""}`}> 
       <NavBar />
          <div class="content-body">
      <div className="container-fluid">
        <div className="row">         
          <div className="col-xl-12">
            <div className="row">
              <div className="col-xl-6">
                <div className="card">
                  <div className="card-body p-0">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                      <div
                        style={{
                          height: "600px",
                          maxWidth: "1300px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        {" "}
                        <Viewer
                          fileUrl={selectFileURL}
                          plugins={[defaultLayoutPluginInstance]}
                        />
                      </div>
                    </Worker>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="card height450">
                  <div className="card-body">
                    <div className="profile-tab">
                      <div className="custom-tab-1">
                        <Tab.Container defaultActiveKey="validDiseases">
                          <Nav as="ul" className="nav nav-tabs">
                            <Nav.Item as="li" className="nav-item">
                              <Nav.Link to="#my-posts" eventKey="validDiseases">
                                Diseases
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                              <Nav.Link to="#my-posts" eventKey="comboDiseases">
                                Combo Diseases
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content>
                            <Tab.Pane id="my-posts" eventKey="validDiseases">
                              <div className="my-post-content pt-3">
                                <div className="widget-media hegiht300  ps--active-y">
                                  <div className="row">
                                    <div className="col-xl-6">
                                      <ul className="timeline">
                                        <span
                                          className={`dang d-block mb-2 text-warning valid-text`}
                                        >
                                          {" "}
                                          Valid{" "}
                                          <Badge
                                            as="a"
                                            href=""
                                            bg="secondary badge-circle"
                                          >
                                            {validDiseasesList.length}
                                          </Badge>
                                        </span>
                                        {validDiseasesList.map((data, i) => (
                                          <li>
                                            <div className="timeline-panel valid-disease">
                                              <div className="media-body">
                                                <h5 className="mb-1 text-white">
                                                  {data.name}
                                                </h5>
                                              </div>
                                              <Popconfirm
                                                title="You want move to invalid?"
                                                description={data.name}
                                                onConfirm={confirmvalid}
                                                placement="leftTop"
                                                okText="Yes"
                                                cancelText="No"
                                                onOpenChange={() =>
                                                  onchangeValid(data.name)
                                                }
                                              >
                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                  <FontAwesomeIcon
                                                    icon={faClose}
                                                    style={{ color: "red" }}
                                                  />
                                                </div>
                                              </Popconfirm>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="col-xl-6">
                                      <ul className="timeline">
                                        <span
                                          className={`dang d-block mb-2  invalid-text`}
                                        >
                                          {" "}
                                          Invalid{" "}
                                          <Badge
                                            as="a"
                                            href=""
                                            bg="badge-circle invalid-bange"
                                          >
                                            {invalidDiseasesList.length}
                                          </Badge>
                                        </span>
                                        {invalidDiseasesList.map((data, i) => (
                                          <li>
                                            <div className="timeline-panel invalid-disease">
                                              <div className="media-body">
                                                <h5 className="mb-1 text-white">
                                                  {data.name}
                                                </h5>
                                              </div>
                                              <Popconfirm
                                                title="You want move to valid?"
                                                description={data.name}
                                                onConfirm={confirmInvalid}
                                                placement="leftTop"
                                                okText="Yes"
                                                cancelText="No"
                                                onOpenChange={() =>
                                                  onchangeValid(data.name)
                                                }
                                              >
                                                <div className="icon-box icon-box-sm bg-danger-light me-1">
                                                  <FontAwesomeIcon
                                                    icon={faCheck}
                                                    style={{ color: "red" }}
                                                  />
                                                </div>
                                              </Popconfirm>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Tab.Pane>
                            <Tab.Pane id="my-posts" eventKey="invalidDiseases">
                              <div className="my-post-content pt-3">
                                <div className="widget-media  hegiht300 ps--active-y">
                                  <ul className="timeline">
                                    {invalidDiseasesList.map((data, i) => (
                                      <li>
                                        <div className="timeline-panel">
                                          <div className="media-body">
                                            <h5 className="mb-1">
                                              {data.name}
                                            </h5>
                                          </div>
                                          <div className="icon-box icon-box-sm bg-danger-light me-1">
                                            <FontAwesomeIcon
                                              icon={faCheck}
                                              style={{ color: "orange" }}
                                            />
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </Tab.Pane>
                            <Tab.Pane id="my-posts" eventKey="comboDiseases">
                              <div className="my-post-content pt-3">
                                <div className="widget-media  hegiht300 ps--active-y">
                                  <ul className="timeline">
                                    <li>
                                     
                                          <div className="tablecontainer">
                                    <table
                                      id="empoloyeestbl2"
                                      className="dataTable no-footer mb-2 mb-sm-0 tableSyle fileView-table"
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
                                        {comboDiseaseCodesList?.map((item) => {
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
											
                                         
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </Tab.Container>
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
      </div>
    </>
  );
};

