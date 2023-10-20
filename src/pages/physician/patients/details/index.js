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
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
import Select from 'react-select';
import { Avatar } from "antd";



export default function PatientDetails() {
  const sideMenu = useSelector(state => state.sideMenu);
  const storePatientDetails = useSelector(state => state.patientDetails.patientDetails);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isLoading, setIsLoading] = useState(false);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] = useState([]);

  const [validDiseasesList, setValidDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectCode, setSelectCode] = useState('');
  const [dosYear, setDosYear] = useState('');


  useEffect(() => {
    console.log(storePatientDetails)
    getPatientDetails();

  }, []);

  const getPatientDetails = async () => {
    const formData = new FormData();
    formData.append("patientid", "12345");
    formData.append("orgid", "5678");
    var data = {};
    data.patientid = '12345';
    data.orgid = '5678';
    const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/compute/get?patientid=ambal&orgid=ambal");
    // const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${storePatientDetails.patientId}&orgid=${storePatientDetails.patientId}`);

    console.log(response.data);
    if (response.data) {
      const records = response.data;
      console.log(response.data);
      var result = response.data;
      var validDis = '';
      var invalidDis = '';
      var comboDis = '';
      var meatCri = '';
      var dosYearArr = [];


      for (var key in response.data.validDisease) {
        dosYearArr.push({ value: key, label: key })
        validDis = response.data.validDisease[key];
      }
      for (var key in response.data.invalidDisease) {
        invalidDis = response.data.invalidDisease[key];
      }
      for (var key in response.data.comboDisease) {
        comboDis = response.data.comboDisease[key];
      }
      for (var key in response.data.meatCriteria) {
        meatCri = response.data.meatCriteria[key];
      }

      var invalidDiseasesArray = [];
      var validDiseasesArray = [];

      for (var key in invalidDis) {
        invalidDiseasesArray.push({ name: invalidDis[key] });
      }
      for (var key in validDis) {
        validDiseasesArray.push({ name: validDis[key] });
      }

      console.log(meatCri)

      setValidDiseasesList(validDiseasesArray);
      setInvalidDiseasesList(invalidDiseasesArray);
      setComboDiseaseCodesList(comboDis);
      setMeatCriteriaList(meatCri);
      setDosYear(dosYearArr);
      setIsLoading(true);

    }
  }

  const options = [
    { value: '1', label: 'Novant Health' },
    { value: '2', label: 'Enabled' },
    { value: '3', label: 'Disabled' },
  ];
  const options2 = [
    { value: '1', label: 'Home Health' },
    { value: '2', label: 'Enabled' },
    { value: '3', label: 'Disabled' },
  ];
  const options3 = [
    { value: '1', label: 'Show Original' },
    { value: '2', label: 'Enabled' },
    { value: '3', label: 'Disabled' },
  ];




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

  const confirmCombo = () =>
    new Promise((resolve) => {
      comboMoveConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmComboInvalid = () =>
    new Promise((resolve) => {
      comboMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmComboValid = () =>
    new Promise((resolve) => {
      comboMoveValidConfirm();
      setTimeout(() => resolve(null), 1000);
    });


  const confirmInvalidMeat = () =>
    new Promise((resolve) => {
      meatMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmValidMeat = () =>
    new Promise((resolve) => {
      meatMoveValidConfirm();
      setTimeout(() => resolve(null), 1000);
    });



  const confirmMeat = () =>
    new Promise((resolve) => {
      meatMoveConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const onchangeValid = (data) => {
    setSelectDiseasesName(data);
  };

  const onchangeCombo = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };
  const onchangeMeat = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
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

  const comboMoveInvalidConfirm = () => {
    const result = comboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = comboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setComboDiseaseCodesList(result);
    var namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    var newArray = [];
    newArray = [...invalidComboDiseaseCodesList, ...result2];
    setInvalidComboDiseaseCodesList(newArray);
  };


  const comboMoveValidConfirm = () => {
    const result = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setInvalidComboDiseaseCodesList(result);
    const result2 = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    var newArray = [];
    newArray = [...comboDiseaseCodesList, ...result2];
    setComboDiseaseCodesList(newArray);
  };



  const meatMoveInvalidConfirm = () => {
    const result = meatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = meatCriteriaList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setMeatCriteriaList(result);
    var newArray = [];
    newArray = [...invalidMeatCriteriaList, ...result2];
    setInvalidMeatCriteriaList(newArray);
  };


  const meatMoveValidConfirm = () => {
    const result = invalidMeatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setInvalidMeatCriteriaList(result);
    const result2 = invalidMeatCriteriaList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    var newArray = [];
    newArray = [...meatCriteriaList, ...result2];
    setMeatCriteriaList(newArray);
  };



  const meatMoveConfirm = () => {
    const result = meatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setMeatCriteriaList(result);
    var namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    var newArray = [];
    newArray = [...invalidDiseasesList, ...namePush];
    setInvalidMeatCriteriaList(newArray);
    console.log(invalidDiseasesList)
    console.log(result)
  };


  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="row">
                  <div className='col-xl-8 col-sm-12'>
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className='col-xl-3 col-sm-12'>
                            <i>{SVGICON.DatebirthIcon}</i> <label>Name</label>
                            <h6 className='ageDtails'>ARUN KUMAR</h6>
                          </div>
                          <div className='col-xl-2 col-sm-12'>
                            <i>{SVGICON.AgeIcon}</i> <label>Age</label>
                            <h6 className='ageDtails'>45</h6>
                          </div>
                          <div className='col-xl-3 col-sm-12'>
                            <i>{SVGICON.GenerIcon}</i><label>Gender</label>
                            <h6 className='ageDtails'>Male</h6>
                          </div>
                          <div className='col-xl-4 col-sm-12'>
                            <i>{SVGICON.DatebirthIcon}</i> <label>Date of birth</label>
                            <h6 className='ageDtails'>21/09/2025</h6>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4 col-sm-12'>
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className='col-xl-12 col-sm-12'>
                            <label className="form-label">Date of Service</label>
                            {isLoading ?
                              <Select options={dosYear} className="custom-react-select"
                                defaultValue={dosYear[0]}
                                isSearchable={false}
                              /> : null}
                          </div>
                          {/* <div className='col-xl-4 col-sm-12'>
                                        <label className="form-label">Encounter Type</label>
                                        <Select options={options2} className="custom-react-select"
                                            defaultValue={options2[0]}
                                            isSearchable={false}
                                        />
                                    </div>
                                    <div className='col-xl-4 col-sm-12'>
                                        <label className="form-label">Document Preference</label>
                                        <Select options={options3} className="custom-react-select"
                                            defaultValue={options3[0]}
                                            isSearchable={false}
                                        />
                                    </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-xl-6">
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
              </div> */}
                  <div className="col-xl-12">
                    <div className="card">
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
                                <Nav.Item as="li" className="nav-item">
                                  <Nav.Link to="#my-posts" eventKey="meatCriteria">
                                    Meat Criteria
                                  </Nav.Link>
                                </Nav.Item>
                                {/* <Nav.Item as="li" className="nav-item">
                                  <Nav.Link to="#my-posts" eventKey="RafScore">
                                  Raf Score
                                  </Nav.Link>
                                </Nav.Item> */}
                              </Nav>
                              <Tab.Content>
                                <Tab.Pane id="my-posts" eventKey="validDiseases">
                                  <div className="my-post-content pt-3">
                                    <div className="widget-media   ps--active-y">
                                      <div className="row">
                                        <div className="col-xl-6">
                                          <ul className="timeline">
                                            <span
                                              className={`dang d-block mb-2 text-warning valid-text`}
                                            >
                                              {" "}
                                              HCC{" "}
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
                                                    <h5 className="mb-1">
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
                                                    <div className="icon-box  bg-danger-light me-1">
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
                                              NON-HCC{" "}
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
                                                    <h5 className="mb-1">
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
                                                    <div className="icon-box  bg-danger-light me-1">
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
                                    <div className="widget-media   ps--active-y">
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
                                    <div className="card combo-head-card">
                                      <div className="row">
                                        <div className="col-xl-3">
                                          <label>Diagnosis Code Combo</label>
                                        </div>
                                        <div className="col-xl-3">
                                          <label>AddOnCode</label>
                                        </div>
                                        <div className="col-xl-5">
                                          <label>Disease Name</label>
                                        </div>
                                        <div className="col-xl-1">
                                          <label></label>
                                        </div>
                                      </div>
                                    </div>
                                    {comboDiseaseCodesList?.map((item) => {
                                      return (
                                        <div className="card combo-card">

                                          <div className="row">
                                            <div className="col-xl-3">
                                              <span>{item.diagnosisCodeCombo}</span>
                                            </div>
                                            <div className="col-xl-3">
                                              <span>{item.addOnCode}</span>
                                            </div>
                                            <div className="col-xl-5">
                                              <span>{item.diseaseName}</span>
                                            </div>
                                            <div className="col-xl-1 comboclose">

                                              <Popconfirm
                                                title="You want move to InValid?"
                                                description={item.diseaseName}
                                                onConfirm={confirmComboInvalid}
                                                placement="leftTop"
                                                okText="Yes"
                                                cancelText="No"
                                                onOpenChange={() =>
                                                  onchangeCombo(item.diseaseName, item.addOnCode)
                                                }
                                              >
                                                <div className="icon-box  bg-danger-light me-1">
                                                  <FontAwesomeIcon
                                                    icon={faClose}
                                                    style={{ color: "red" }}
                                                  />
                                                </div>
                                              </Popconfirm>
                                            </div>
                                          </div>

                                        </div>
                                      );
                                    })}
                                    {invalidComboDiseaseCodesList.length != 0 ?
                                      <>
                                        <div className="invalid-combo">
                                          <span>Invalid Combo Diseases </span>
                                        </div>

                                        {invalidComboDiseaseCodesList?.map((item) => {
                                          return (
                                            <div className="card combo-card">
                                              <div className="row">
                                                <div className="col-xl-3">
                                                  <span>{item.diagnosisCodeCombo}</span>
                                                </div>
                                                <div className="col-xl-3">
                                                  <span>{item.addOnCode}</span>
                                                </div>
                                                <div className="col-xl-5">
                                                  <span>{item.diseaseName}</span>
                                                </div>
                                                <div className="col-xl-1 comboclose">

                                                  <Popconfirm
                                                    title="You want move to InValid?"
                                                    description={item.diseaseName}
                                                    onConfirm={confirmComboValid}
                                                    placement="leftTop"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onOpenChange={() =>
                                                      onchangeCombo(item.diseaseName, item.addOnCode)
                                                    }
                                                  >
                                                    <div className="icon-box  bg-danger-light me-1">
                                                      <FontAwesomeIcon
                                                        icon={faCheck}
                                                        style={{ color: "orange" }}
                                                      />
                                                    </div>
                                                  </Popconfirm>
                                                </div>
                                              </div>

                                            </div>
                                          );
                                        })}
                                      </> : null}
                                  </div>
                                </Tab.Pane>
                                <Tab.Pane id="my-posts" eventKey="meatCriteria">
                                  <div className="my-post-content pt-3">

                                    <div className="card meat-head-card">
                                      <div className="row">
                                        <div className="col-xl-1">
                                          <label>Codes</label>
                                        </div>
                                        <div className="col-xl-2">
                                          <label>Disease Name</label>
                                        </div>
                                        <div className="col-xl-2">
                                          <label>Evaluation</label>
                                        </div>
                                        <div className="col-xl-2">
                                          <label>Monitor</label>
                                        </div>
                                        <div className="col-xl-2">
                                          <label>Assessment</label>
                                        </div>
                                        <div className="col-xl-2">
                                          <label>Treatment</label>
                                        </div>
                                        <div className="col-xl-1">
                                          <label></label>
                                        </div>
                                      </div>

                                    </div>
                                    {meatCriteriaList?.map((item) => {
                                      return (
                                        <div className="card meat-card">

                                          <div className="row">
                                            <div className="col-xl-1">
                                              <span>{item.diagnosisCode}</span>
                                            </div>
                                            <div className="col-xl-2">
                                              <span>{item.diseaseName}</span>
                                            </div>
                                            <div className="col-xl-2 d-grid">
                                              <span>{item.evaluate}</span>
                                              <Badge className="badge-meat" bg="success badge-circle mt-2">{item.evaluateCapturedFromHeader}</Badge>
                                            </div>
                                            <div className="col-xl-2 d-grid">
                                              <span>{item.monitor}</span>
                                              <Badge className="badge-meat" bg="success badge-circle mt-2">{item.monitorCapturedFromHeader}</Badge>
                                            </div>
                                            <div className="col-xl-2 d-grid">
                                              <span>{item.assessment}</span>
                                              <Badge className="badge-meat" bg="success badge-circle mt-2">{item.assessmentCapturedFromHeader}</Badge>
                                            </div>
                                            <div className="col-xl-2 d-grid">
                                              <span>{item.treatment}</span>
                                              <Badge className="badge-meat" bg="success badge-circle mt-2">{item.treatmentCapturedFromHeader}</Badge>
                                            </div>
                                            <div className="col-xl-1 meatclose">
                                              {/* {item.isMeatCriteriaPresent === true ?
                                             <span  className="badge badge-rounded badge-warning badge-meat">
                                             True
                                           </span>:
                                            <Badge  bg="success badge-circle mt-2">{item.isMeatCriteriaPresent}</Badge>} */}
                                              <Popconfirm
                                                title="You want move to InValid?"
                                                description={item.diseaseName}
                                                onConfirm={confirmInvalidMeat}
                                                placement="leftTop"
                                                okText="Yes"
                                                cancelText="No"
                                                onOpenChange={() =>
                                                  onchangeMeat(item.diseaseName, item.diagnosisCode)
                                                }
                                              >
                                                <div className="icon-box  bg-danger-light me-1">
                                                  <FontAwesomeIcon
                                                    icon={faClose}
                                                    style={{ color: "red" }}
                                                  />
                                                </div>
                                              </Popconfirm>
                                            </div>
                                          </div>

                                        </div>
                                      );
                                    })}
                                    {invalidMeatCriteriaList.length != 0 ?
                                      <>
                                        <div className="invalid-combo">
                                          <span>Invalid MeatCriteria</span>
                                        </div>

                                        {invalidMeatCriteriaList?.map((item) => {
                                          return (
                                            <div className="card meat-card">

                                              <div className="row">
                                                <div className="col-xl-1">
                                                  <span>{item.diagnosisCode}</span>
                                                </div>
                                                <div className="col-xl-2">
                                                  <span>{item.diseaseName}</span>
                                                </div>
                                                <div className="col-xl-2 d-grid">
                                                  <span>{item.evaluate}</span>
                                                  <Badge className="badge-meat" bg="success badge-circle mt-2">{item.evaluateCapturedFromHeader}</Badge>
                                                </div>
                                                <div className="col-xl-2 d-grid">
                                                  <span>{item.monitor}</span>
                                                  <Badge className="badge-meat" bg="success badge-circle mt-2">{item.monitorCapturedFromHeader}</Badge>
                                                </div>
                                                <div className="col-xl-2 d-grid">
                                                  <span>{item.assessment}</span>
                                                  <Badge className="badge-meat" bg="success badge-circle mt-2">{item.assessmentCapturedFromHeader}</Badge>
                                                </div>
                                                <div className="col-xl-2 d-grid">
                                                  <span>{item.treatment}</span>
                                                  <Badge className="badge-meat" bg="success badge-circle mt-2">{item.treatmentCapturedFromHeader}</Badge>
                                                </div>
                                                <div className="col-xl-1 meatclose">


                                                  <Popconfirm
                                                    title="You want move to InValid?"
                                                    description={item.diseaseName}
                                                    onConfirm={confirmValidMeat}
                                                    placement="leftTop"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onOpenChange={() =>
                                                      onchangeMeat(item.diseaseName, item.diagnosisCode)
                                                    }
                                                  >
                                                    <div className="icon-box  bg-danger-light me-1">
                                                      <FontAwesomeIcon
                                                        icon={faCheck}
                                                        style={{ color: "orange" }}
                                                      />
                                                    </div>
                                                  </Popconfirm>
                                                </div>
                                              </div>

                                            </div>
                                          );
                                        })}
                                      </> : null}
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

