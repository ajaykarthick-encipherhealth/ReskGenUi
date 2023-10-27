import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import NavBar from "../../../../jsx/layouts/nav";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import LoadingSpinner from "../../../../jsx/components/spinner/spinner";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck, faAdd } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, Divider, Popover, } from "antd";
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
import Select from 'react-select';
import { Modal } from "antd";
import { Button } from 'react-bootstrap';
import { Space, Spin } from 'antd';
// import { searchPlugin ,NextIcon, PreviousIcon, RenderSearchProps,} from '@react-pdf-viewer/search';
import { Icon, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';
import { NextIcon, PreviousIcon, RenderSearchProps, searchPlugin } from '@react-pdf-viewer/search';
import Form from 'react-bootstrap/Form';
import { Offcanvas } from "react-bootstrap";







export default function PatientDetails() {

  let searchKeywords = [];

  // const searchPluginInstance = searchPlugin({
  //   // keyword: [
  //   //   'document',
  //   //   {
  //         keyword: 'Impression',
  //         matchCase: true,
  //     // },
  // // ],
  // })



  const searchPluginInstance = searchPlugin({
    // keyword: 'Plan / Discussion',
    matchCase: true,
    wholeWords: true
  });
  const { highlight, Search } = searchPluginInstance;
  const { ShowSearchPopoverButton } = searchPluginInstance;
  const [searchPluginInstanceLocal, setSearchPluginInstanceLocal] = useState(searchPluginInstance);

  const sideMenu = useSelector(state => state.sideMenu);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenValid, setIsModalOpenValid] = useState(false);
  const storePatientDetails = useSelector(state => state.patientDetails.patientDetails);
  const storeDetails = useSelector(state => state);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] = useState([]);

  const [validDiseasesList, setValidDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectCode, setSelectCode] = useState('');
  const [dosYear, setDosYear] = useState('');
  const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState('');
  const [localOrgId, setLocalOrgId] = useState('');
  const [localTenantId, setLocalTenantId] = useState('');
  const [selectMeatFileId, setSelectMeatFileId] = useState('');
  const [selectMeatName, setSelectMeatName] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rafScore, setRAFScore] = useState([]);
  const [patientDetails, setPatientDetails] = useState([]);
  const [rafHccList, setRafScoreHccList] = useState([]);
  //   highlight([
  //     'document',
  //     {
  //         keyword: 'PDF',
  //         matchCase: true,
  //     },
  // ]);

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
    // setTimeout(() => {
    //   highlight({
    //     keyword: selectDiseasesName,
    //     matchCase: true,
    //   });
    // }, 6000);

  }

  const changeSearch = () => {
    //   searchPlugin({
    //     keyword: 'BMP',
    //     matchCase: true,
    // });
    setDocumentLoaded(true);
    setTimeout(() => {
      highlight({
        keyword: 'BMP',
        matchCase: true,
      });
    }, 1000);

  }







  useEffect(() => {

    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    console.log(RenderSearchProps)
    setLocalOrgId(orgId);
    getPatientDetails(orgId, tenId);
    setLocalTenantId(tenId)

    //   if (isDocumentLoaded) {
    //     enableShortcuts({
    //         keyword: 'Coverage for Jeffrey She',
    //         matchCase: true,
    //     });
    // }
  }, [isDocumentLoaded]);

  const getPatientDetails = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    // const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/compute/get?patientid=ambal&orgid=ambal");
    const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
    if (response.data) {
      var result = response.data;
      setPatientDetails(result);
      console.log(result)
      var validDis = '';
      var invalidDis = '';
      var comboDis = '';
      var meatCri = '';
      var dosYearArr = [];
      var rafScore = '';
      getPatientPdfFile(result.fileId, tenId)
      setSelectMeatFileId(response.data.fileId)
      setPatientDocumentResult(result);

      for (var key in response.data.validDisease) {
        dosYearArr.push({ value: key, label: key });
      }

      console.log(dosYearArr)
      const highestDOS = Math.max(...dosYearArr.map(res => res.value));
      console.log(highestDOS);

      const highestDosValue =  dosYearArr.filter((i) => parseInt(i.value) === highestDOS);
      console.log(highestDosValue)
      setDosYearDefalutSelect(highestDosValue)
      


      if (result.rafScore != null) {
        rafScore = result.rafScore[highestDOS]
      }

      validDis = result.validDisease[highestDOS];

      invalidDis = result.invalidDisease[highestDOS];
      comboDis = result.comboDisease[highestDOS];
      meatCri = result.meatCriteria[highestDOS];

      var invalidDiseasesArray = [];
      var validDiseasesArray = [];

     for (var key in invalidDis) {
        invalidDiseasesArray.push({ name: invalidDis[key] });
      }
      for (var key in validDis) {
        validDiseasesArray.push({ name: validDis[key] });
      }



      // for (var key in result.validDisease) {
      //   validDis = result.validDisease[key];
      //   if (result.rafScore != null) {
      //     rafScore = result.rafScore[key]
      //   }
      // }
      // for (var key in result.invalidDisease) {
      //   invalidDis = result.invalidDisease[key];
      // }
      // for (var key in result.comboDisease) {
      //   comboDis = result.comboDisease[key];
      // }
      // for (var key in result.meatCriteria) {
      //   meatCri = result.meatCriteria[key];
      // }

      // var invalidDiseasesArray = [];
      // var validDiseasesArray = [];

      // for (var key in invalidDis) {
      //   invalidDiseasesArray.push({ name: invalidDis[key] });
      // }
      // for (var key in validDis) {
      //   validDiseasesArray.push({ name: validDis[key] });
      // }

      console.log(meatCri)

      setValidDiseasesList(validDiseasesArray);
      setInvalidDiseasesList(invalidDiseasesArray);
      setComboDiseaseCodesList(comboDis);
      setMeatCriteriaList(meatCri);
      setDosYear(dosYearArr);
      setRAFScore(rafScore)
      setIsLoading(false);
      console.log(rafScore)

      var hccListArr=[];

      rafScore.scoreOutputDTOList.map((res) => {
        res.dx_hccs.map((res2) => {
          res2.hcc_list.map((res3) => {
            console.log(res3) 
            hccListArr.push(res3)          
          })
        })
       
      })
      console.log(hccListArr)
      setRafScoreHccList(hccListArr)

    }
  }
  const getPatientPdfFile = async (fileId, tenId) => {
    const response = await axios.get(ENDPOINTS.apiEndoint + `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`);
    if (response.data) {
      var result = response.data;
      console.log(response.data)
      setSelectFileURL(response.data);
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


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalOpenValid(false)
  };
  const handleOpenModal = (value) => {
    setTimeout(() => {
      highlight({
        keyword: value,
        matchCase: true,
      });
      setSelectMeatName(value);
    }, 2000);
    setDocumentLoaded(true);
    setSelectMeatName(value + " -  " + "Loading...");
    setIsLoadingSection(true);
    setIsModalOpen(true);
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };

  const getSectionResult = async (value) => {
    var apiUrl = `dbservice/patient/compute/getsection?fileid=cbd48813-3f9c-4cc9-9882-1db87fdd1ffb&section=${value}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + apiUrl);
    console.log(response.data);
    var result = response.data;
    if (response.data) {
      setSectionList(response.data);
      setIsLoadingSection(false);
    }
  }

  const onChangeFile = (e) => {
    let value = URL.createObjectURL(e[0]);

    setSelectFileURL(value);
  };

  const addValidDiseases = () => {
    console.log("test")
    setIsModalOpenValid(true)
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {

    }
    setValidated(true)
  }


  
	const dosOnChange = async (e) => {
    var dosKeyValue =  e.value;
    var validDis = '';
    var invalidDis = '';
    var comboDis = '';
    var meatCri = '';
    var rafScore = '';

    var result =  patientDetails;

    console.log(result);

    if (result.rafScore != null) {
      rafScore = result.rafScore[dosKeyValue]
    }

    validDis = result.validDisease[dosKeyValue];

    invalidDis = result.invalidDisease[dosKeyValue];
    comboDis = result.comboDisease[dosKeyValue];
    meatCri = result.meatCriteria[dosKeyValue];

    var invalidDiseasesArray = [];
    var validDiseasesArray = [];

   for (var key in invalidDis) {
      invalidDiseasesArray.push({ name: invalidDis[key] });
    }
    for (var key in validDis) {
      validDiseasesArray.push({ name: validDis[key] });
    }

    setValidDiseasesList(validDiseasesArray);
    setInvalidDiseasesList(invalidDiseasesArray);
    setComboDiseaseCodesList(comboDis);
    setMeatCriteriaList(meatCri);
    setRAFScore(rafScore)
    setIsLoading(false);

	}




  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          {isLoading ? <LoadingSpinner /> :
            <div className="container-fluid">
              <div className="row patient-file-container">
                <div className="col-xl-12">
                  <div className="row">
                    <div className='col-xl-8 col-sm-12'>
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className='col-xl-3 col-sm-12'>
                              <i>{SVGICON.DatebirthIcon}</i> <label>Name</label>
                              <h6 className='ageDtails'>{patientDocumentResult.patientName}</h6>
                            </div>
                            <div className='col-xl-2 col-sm-12'>
                              <i>{SVGICON.AgeIcon}</i> <label>Age</label>
                              <h6 className='ageDtails'>{patientDocumentResult.age}</h6>
                            </div>
                            <div className='col-xl-3 col-sm-12'>
                              <i>{SVGICON.GenerIcon}</i><label>Gender</label>
                              <h6 className='ageDtails'>{patientDocumentResult.gender}</h6>
                            </div>
                            <div className='col-xl-4 col-sm-12'>
                              <i>{SVGICON.DatebirthIcon}</i> <label>Date of birth</label>
                              <h6 className='ageDtails'>{patientDocumentResult.dob}</h6>
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
                              {!isLoading ?
                                <Select onChange={(e) => dosOnChange(e)} options={dosYear} className="custom-react-select"
                                  defaultValue={dosYearDefalutSelect}
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
                    {/* <div className="col-xl-5">
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
                              <Tab.Container defaultActiveKey="file">
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="file">
                                      File
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="validDiseases">
                                      Diseases
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="comboDiseases">
                                      Combination Codes
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="meatCriteria">
                                      MEAT Criteria
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="RafScore">
                                      RAF Score
                                    </Nav.Link>
                                  </Nav.Item>
                                  {/* <Nav.Item as="li" className="nav-item">
                                  <Nav.Link to="#my-posts" eventKey="file">
                                    File
                                  </Nav.Link>
                                </Nav.Item> */}
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane id="my-posts" eventKey="validDiseases">
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          {/* <div className="col-xl-7">
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
                                          <div className="col-xl-6">
                                            <ul className="timeline">
                                              <div className="valid-text d-flex justify-content-sm-between">
                                                <span
                                                  className={`dang d-block text-warning`}
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
                                                <div className="d-flex justify-content-center">
                                                  <button onClick={() => addValidDiseases()} className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn">
                                                    <FontAwesomeIcon icon={faAdd} fontSize={11} />
                                                  </button>
                                                </div>
                                              </div>

                                              {validDiseasesList.map((data, i) => (
                                                <li>
                                                  <div className="timeline-panel valid-disease">
                                                    <div className="media-body">
                                                      <span className="mb-1 disease-name" >
                                                        {data.name}
                                                      </span>
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

                                              <div className="invalid-text d-flex justify-content-sm-between">
                                                <span
                                                  className={`dang d-block`}
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
                                                <div className="d-flex justify-content-center">
                                                  <button onClick={() => addValidDiseases()} className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn">
                                                    <FontAwesomeIcon icon={faAdd} fontSize={11} />
                                                  </button>
                                                </div>
                                              </div>


                                              {/* <span
                                              className={`dang d-block`}
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
                                            </span> */}
                                              {invalidDiseasesList.map((data, i) => (
                                                <li>
                                                  <div className="timeline-panel invalid-disease">
                                                    <div className="media-body">
                                                      <span className="mb-1 disease-name">
                                                        {data.name}
                                                      </span>
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
                                                          style={{ color: "orange" }}
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
                                            <div className="d-flex justify-content-center">
                                              <button onClick={() => addValidDiseases()} className="btn bg-white hegiht10 btn-primary shadow  sharp me-1 action-btn">
                                                <FontAwesomeIcon icon={faAdd} fontSize={11} color="blue" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {comboDiseaseCodesList?.map((item) => {
                                        return (
                                          <div className="card combo-card">

                                            <div className="row">
                                              <div className="col-xl-3">
                                                <span className="font-bold">{item.diagnosisCodeCombo}</span>
                                              </div>
                                              <div className="col-xl-3">
                                                <span className="font-bold">{item.addOnCode}</span>
                                              </div>
                                              <div className="col-xl-5">
                                                <span>{item.diseaseName}</span>
                                              </div>
                                              <div className="col-xl-1 comboclose">

                                                <Popconfirm
                                                  title="You want move to Invalid?"
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
                                                    <span className="font-bold">{item.diagnosisCodeCombo}</span>
                                                  </div>
                                                  <div className="col-xl-3">
                                                    <span className="font-bold">{item.addOnCode}</span>
                                                  </div>
                                                  <div className="col-xl-5">
                                                    <span>{item.diseaseName}</span>
                                                  </div>
                                                  <div className="col-xl-1 comboclose">

                                                    <Popconfirm
                                                      title="You want move to Valid?"
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
                                            <label>Monitor</label>
                                          </div>
                                          <div className="col-xl-2">
                                            <label>Evaluation</label>
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
                                          <div className={item.isMeatCriteriaPresent === true
                                            ? "card meat-card" : "card meat-card-false"}>

                                            <div className="row">
                                              <div className="col-xl-1">
                                                <span className="font-bold">{item.diagnosisCode}</span>
                                              </div>
                                              <div className="col-xl-2">
                                                <Popover placement="topLeft" title="Disease Name" content={item.diseaseName}>
                                                  <span className="meat-name-details">{item.diseaseName}</span>
                                                </Popover>
                                              </div>
                                              <div className="col-xl-2 d-grid">
                                                <Popover placement="topLeft" title="Monitor" content={item.monitor}>
                                                  <span className="meat-name-details">{item.monitor}</span>
                                                </Popover>
                                                <Badge className="badge-meat cr-pointer" bg={(item.monitorCapturedFromHeader === "HPI" || item.monitorCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.monitorCapturedFromHeader === "Impression" || item.monitorCapturedFromHeader === "Assessments") ? "secondary badge-circle mt-2" : (item.monitorCapturedFromHeader === "Recommendations" || item.monitorCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : item.monitorCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.monitorCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.monitorCapturedFromHeader === "N/A" ? "bg-five badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.monitorCapturedFromHeader)}>{item.monitorCapturedFromHeader}</Badge>
                                              </div>
                                              <div className="col-xl-2 d-grid">
                                                <Popover placement="topLeft" title="Evaluation" content={item.evaluate}>
                                                  <span className="meat-name-details">{item.evaluate}</span>
                                                </Popover>
                                                <Badge className="badge-meat cr-pointer" bg={(item.evaluateCapturedFromHeader === "HPI" || item.evaluateCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.evaluateCapturedFromHeader === "Impression" || item.evaluateCapturedFromHeader === "Assessments") ? "secondary badge-circle mt-2" : (item.evaluateCapturedFromHeader === "Recommendations" || item.evaluateCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : item.evaluateCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.evaluateCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.evaluateCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.evaluateCapturedFromHeader)}>{item.evaluateCapturedFromHeader}</Badge>
                                              </div>
                                              <div className="col-xl-2 d-grid">
                                                <Popover placement="topLeft" title="Assessment" content={item.assessment}>
                                                  <span className="meat-name-details">{item.assessment}</span>
                                                </Popover>
                                                <Badge className="badge-meat cr-pointer" bg={(item.assessmentCapturedFromHeader === "HPI" || item.assessmentCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.assessmentCapturedFromHeader === "Impression" || item.assessmentCapturedFromHeader === "Assessments") ? "secondary badge-circle mt-2" : (item.assessmentCapturedFromHeader === "Recommendations" || item.assessmentCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : item.assessmentCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.assessmentCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.assessmentCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.assessmentCapturedFromHeader)}>{item.assessmentCapturedFromHeader}</Badge>
                                              </div>
                                              <div className="col-xl-2 d-grid">
                                                <Popover placement="topLeft" title="Treatment" content={item.treatment}>
                                                  <span className="meat-name-details">{item.treatment}</span>
                                                </Popover>

                                                <Badge className="badge-meat cr-pointer" bg={(item.treatmentCapturedFromHeader === "HPI" || item.treatmentCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.treatmentCapturedFromHeader === "Impression" || item.treatmentCapturedFromHeader === "Assessments") ? "secondary badge-circle mt-2" : (item.treatmentCapturedFromHeader === "Recommendations" || item.treatmentCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : item.treatmentCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.treatmentCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.treatmentCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.treatmentCapturedFromHeader)} >{item.treatmentCapturedFromHeader}</Badge>
                                              </div>
                                              <div className="col-xl-1 meatclose">
                                                {/* {item.isMeatCriteriaPresent === true ?
                                             <span  className="badge badge-rounded badge-warning badge-meat">
                                             True
                                           </span>:
                                            <Badge  bg="success badge-circle mt-2">{item.isMeatCriteriaPresent}</Badge>} */}
                                                <Popconfirm
                                                  title="You want move to Invalid?"
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
                                                    <span className="font-bold">{item.diagnosisCode}</span>
                                                  </div>
                                                  <div className="col-xl-2">
                                                    <Popover placement="topLeft" title="Disease Name" content={item.diseaseName}>
                                                      <span className="meat-name-details">{item.diseaseName}</span>
                                                    </Popover>
                                                  </div>
                                                  <div className="col-xl-2 d-grid">
                                                    <Popover placement="topLeft" title="Monitor" content={item.monitor}>
                                                      <span className="meat-name-details">{item.monitor}</span>
                                                    </Popover>
                                                    <Badge className="badge-meat cr-pointer" bg={item.monitorCapturedFromHeader === "HPI" ? "third badge-circle mt-2" : item.monitorCapturedFromHeader === "Impression" ? "secondary badge-circle mt-2" : item.monitorCapturedFromHeader === "Recommendations" ? "bgshodowcolor badge-circle mt-2" : item.monitorCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.monitorCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.monitorCapturedFromHeader === "N/A" ? "bg-five badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.monitorCapturedFromHeader)}>{item.monitorCapturedFromHeader}</Badge>
                                                  </div>
                                                  <div className="col-xl-2 d-grid">
                                                    <Popover placement="topLeft" title="Evaluation" content={item.evaluate}>
                                                      <span className="meat-name-details">{item.evaluate}</span>
                                                    </Popover>
                                                    <Badge className="badge-meat cr-pointer" bg={item.evaluateCapturedFromHeader === "HPI" ? "third badge-circle mt-2" : item.evaluateCapturedFromHeader === "Impression" ? "secondary badge-circle mt-2" : item.evaluateCapturedFromHeader === "Recommendations" ? "bgshodowcolor badge-circle mt-2" : item.evaluateCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.evaluateCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.evaluateCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.evaluateCapturedFromHeader)}>{item.evaluateCapturedFromHeader}</Badge>
                                                  </div>
                                                  <div className="col-xl-2 d-grid">
                                                    <Popover placement="topLeft" title="Assessment" content={item.assessment}>
                                                      <span className="meat-name-details">{item.assessment}</span>
                                                    </Popover>
                                                    <Badge className="badge-meat cr-pointer" bg={item.assessmentCapturedFromHeader === "HPI" ? "third badge-circle mt-2" : item.assessmentCapturedFromHeader === "Impression" ? "secondary badge-circle mt-2" : item.assessmentCapturedFromHeader === "Recommendations" ? "bgshodowcolor badge-circle mt-2" : item.assessmentCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.assessmentCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.assessmentCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.assessmentCapturedFromHeader)}>{item.assessmentCapturedFromHeader}</Badge>
                                                  </div>
                                                  <div className="col-xl-2 d-grid">
                                                    <Popover placement="topLeft" title="Treatment" content={item.treatment}>
                                                      <span className="meat-name-details">{item.treatment}</span>
                                                    </Popover>

                                                    <Badge className="badge-meat cr-pointer" bg={item.treatmentCapturedFromHeader === "HPI" ? "third badge-circle mt-2" : item.treatmentCapturedFromHeader === "Impression" ? "secondary badge-circle mt-2" : item.treatmentCapturedFromHeader === "Recommendations" ? "bgshodowcolor badge-circle mt-2" : item.treatmentCapturedFromHeader === "Plan / Discussion" ? "bg-four badge-circle mt-2" : item.treatmentCapturedFromHeader === "Patient Instructions" ? "bg-five badge-circle mt-2" : item.treatmentCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.treatmentCapturedFromHeader)} >{item.treatmentCapturedFromHeader}</Badge>
                                                  </div>
                                                  <div className="col-xl-1 meatclose">


                                                    <Popconfirm
                                                      title="You want move to Valid?"
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
                                  <Tab.Pane id="my-posts" eventKey="RafScore">
                                    <div className="my-post-content pt-3">


                                      <div className="row">
                                        <div className="col-xl-3">
                                          {/* <div className="card raf-file-head">

                                          <div className="row">
                                            <div className="col-xl-12 mb-3 text-center">
                                              <Button
                                                className="btn btn-primary btn-sm me-1"
                                              >
                                                Uplaod File
                                              </Button>

                                            </div>
                                            <div className="col-xl-12 mb-3">
                                              <Form.Control
                                                required
                                                type="file"
                                                accept="application/pdf,text/plain"

                                              />
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                              <Form.Control
                                                required
                                                type="date"

                                              />
                                            </div>
                                          </div>

                                        </div> */}

                                        </div>
                                        {rafScore != "" ?
                                          <div className="col-xl-12">
                                            {rafScore.scoreOutputDTOList.map((rafScoreMapResult) => {
                                              return (
                                                <div className="row raf-main-card">
                                                  {/* <div className="raf-name-head">
                                                    <h5 className="raf-model-version">{rafScoreMapResult.hcc_model.model} - {rafScoreMapResult.hcc_model.version}</h5>
                                                  </div> */}

                                                  <div className="col-xl-6">
                                                    <div className="card">
                                                      <div className="raf-card">

                                                        <div className="row raf-head text-center">
                                                          <div className="col-xl-12">
                                                            <label className="text-white">Summary</label>
                                                          </div>
                                                        </div>
                                                        <div className="row raf-details">
                                                          <div className="col-xl-6">
                                                            <span>{rafScoreMapResult.hcc_model.model}</span>
                                                          </div>
                                                          <div className="col-xl-6">
                                                            <span>{rafScoreMapResult.hcc_model.version}</span>
                                                          </div>
                                                        </div>

                                                      </div>
                                                    </div>

                                                  </div>
                                                  <div className="col-xl-6">
                                                    <div className="card">
                                                      <div className="raf-card">
                                                        <div className="row raf-head">
                                                          <div className="col-xl-6">
                                                            <label className="text-white">DX Code</label>
                                                          </div>
                                                          <div className="col-xl-6">
                                                            <label className="text-white">DX Description</label>
                                                          </div>

                                                        </div>

                                                        {rafScoreMapResult.dx_hccs.map((item) => {
                                                          return (
                                                            <div className="row raf-details">
                                                              <div className="col-xl-6">
                                                                <span>{item.dx_name}</span>
                                                              </div>
                                                              <div className="col-xl-6">
                                                                <span>{item.dx_desc}</span>
                                                              </div>
                                                            </div>
                                                          );
                                                        })}


                                                      </div>
                                                    </div>

                                                  </div>
                                                  <div className="col-xl-6">
                                                    <div className="card">
                                                      <div className="raf-card">
                                                        <div className="row raf-head">
                                                          <div className="col-xl-6">
                                                            <label className="text-white">HCC</label>
                                                          </div>
                                                          <div className="col-xl-6">
                                                            <label className="text-white">HCC Description</label>
                                                          </div>

                                                        </div>
                                                        {rafScoreMapResult.dx_hccs.map((res) => {
                                                          return (
                                                           
                                                                res.hcc_list.map((res1) => {
                                                                  return (
                                                        <div className="row raf-details">
                                                          <div className="col-xl-6">
                                                            <span>{res1.hcc_name}</span>
                                                          </div>
                                                          <div className="col-xl-6">
                                                            <span>{res1.hcc_desc}</span>
                                                          </div>
                                                        </div>
                                                       
                                                        );
                                                      })
                                                          );
                                                        })}

                                                      </div>
                                                    </div>

                                                  </div>
                                                  <div className="col-xl-6">
                                                    <div className="card">
                                                      <div className="raf-card">
                                                        <div className="row raf-head">
                                                          <div className="col-xl-4">
                                                            <label className="text-white">Trumped By</label>
                                                          </div>
                                                          <div className="col-xl-4">
                                                            <label className="text-white">RAF</label>
                                                          </div>
                                                          <div className="col-xl-4">
                                                            <label className="text-white">Monthly Premium</label>
                                                          </div>

                                                        </div>
                                                        {rafScoreMapResult.dx_hccs.map((res) => {
                                                          return (
                                                           
                                                                res.hcc_list.map((res1) => {
                                                                  return (
                                                        <div className="row  raf-details">
                                                          <div className="col-xl-4">
                                                            <span>-</span>
                                                          </div>
                                                          <div className="col-xl-4">
                                                            <span>{res1.hcc_raf}</span>
                                                          </div>
                                                          <div className="col-xl-4">
                                                            <span>${res1.premium}</span>
                                                          </div>
                                                        </div>
                                                         );
                                                        })
                                                            );
                                                          })}
                                                      </div>
                                                    </div>

                                                  </div>
                                                </div>


                                              );
                                            })}

                                            <div className="row raf-main-card">
                                              <div className="raf-name-head">
                                                <h5 className="raf-model-version">SCORE DETAILS</h5>
                                              </div>

                                              <div className="col-xl-12">
                                                <div className="card">
                                                  <div className="raf-card">
                                                    <div className="row raf-head">
                                                      <div className="col-xl-2">
                                                        <label className="text-white">v24Score</label>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <label className="text-white">v24Score70Percent</label>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <label className="text-white">v28Score</label>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <label className="text-white">v28Score30Percent</label>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <label className="text-white">Score</label>
                                                      </div>

                                                    </div>
                                                    <div className="row  raf-details">
                                                      <div className="col-xl-2">
                                                        <span>{rafScore.v24Score}</span>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <span>{rafScore.v24Score70Percent}</span>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <span>{rafScore.v28Score}</span>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <span>{rafScore.v28Score30Percent}</span>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <span>{rafScore.score}</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>

                                              </div>
                                            </div>
                                          </div>
                                          : null}
                                      </div>
                                      {/* <div className="">

                                      <div className="compete-card">
                                        <Button
                                          className="btn btn-primary btn-sm me-1"
                                        >
                                          Compete
                                        </Button>
                                      </div>


                                    </div> */}
                                    </div>

                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="file">
                                    <div className="my-post-content pt-3">
                                      <div className="card">
                                        {/* <div><input
                                          required
                                          type="file"
                                          accept="application/pdf,text/plain"
                                          onChange={(e) => onChangeFile(e.target.files)}
                                        />

                                        </div> */}
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
                                                onDocumentLoad={handleDocumentLoad}
                                              />
                                            </div>
                                          </Worker>
                                        </div>
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
                {isModalOpen && (
                  <Modal
                    title={selectMeatName}
                    // title="Pdf Test"
                    centered
                    open={isModalOpen}
                    // style={{ top: 5 }}
                    onOk={handleCloseModal}
                    onCancel={handleCloseModal}
                    width={1000}
                    height={400}
                  >
                    <div className="section-container">
                      {/* <button onClick={changeSearch}>Check
        
        </button> */}
                      {/* {isLoadingSection ?
                      <Spin className='ml-2 ms-1 section-spin' size="medium" />
                      : <>
                        {sectionList?.map((item) => {
                          return (

                            <div className="card meat-card">
                              <span className="combodiseaseText">{item}</span>
                            </div>


                          );
                        })}
                      </>} */}
                      {/* <div
        className="rpv-core__viewer"
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginBottom:"50px"
        }}
    >
        <div
            style={{
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                padding: '4px',
            }}
        >
            <ShowSearchPopoverButton />
        </div>
        </div> */}
                      <div
                        className="rpv-core__viewer"
                        style={{
                          border: '1px solid rgba(0, 0, 0, 0.3)',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          margin: "0 82px 10px 73px"
                        }}
                      >

                        <div
                          style={{
                            alignItems: 'center',
                            backgroundColor: '#eeeeee',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            padding: '4px',
                          }}
                        >
                          <Search>
                            {(renderSearchProps) => {
                              const [readyToSearch, setReadyToSearch] = useState(false);
                              return (
                                <>
                                  <div
                                    style={{
                                      border: '1px solid rgba(0, 0, 0, 0.3)',
                                      display: 'flex',
                                      padding: '0 2px',
                                    }}
                                  >
                                    <input
                                      style={{
                                        border: 'none',
                                        padding: '8px',
                                        width: '200px',
                                      }}
                                      placeholder="Enter to search"
                                      type="text"
                                      value={renderSearchProps.keyword}
                                      onChange={(e) => {
                                        setReadyToSearch(false);
                                        renderSearchProps.setKeyword(e.target.value);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13 && renderSearchProps.keyword) {
                                          setReadyToSearch(true);
                                          renderSearchProps.search();
                                        }
                                      }}
                                    />
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <button
                                          style={{
                                            background: '#fff',
                                            border: 'none',
                                            borderBottom: `2px solid ${renderSearchProps.matchCase ? 'blue' : 'transparent'
                                              }`,
                                            height: '100%',
                                            padding: '0 2px',
                                          }}
                                          onClick={() =>
                                            renderSearchProps.changeMatchCase(!renderSearchProps.matchCase)
                                          }
                                        >
                                          <Icon>
                                            <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                            <path d="M4.383 14.725L13.59 14.725" />
                                            <path d="M0.5 21.725L3.52 21.725" />
                                            <path d="M14.479 21.725L17.5 21.725" />
                                            <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                            <path d="M16.92 16.725L20.794 16.725" />
                                            <path d="M21.516 21.725L23.5 21.725" />
                                          </Icon>
                                        </button>
                                      }
                                      content={() => 'Match case'}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <button
                                          style={{
                                            background: '#fff',
                                            border: 'none',
                                            borderBottom: `2px solid ${renderSearchProps.wholeWords ? 'blue' : 'transparent'
                                              }`,
                                            height: '100%',
                                            padding: '0 2px',
                                          }}
                                          onClick={() =>
                                            renderSearchProps.changeWholeWords(!renderSearchProps.wholeWords)
                                          }
                                        >
                                          <Icon>
                                            <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                            <path d="M3.5 9.498L3.5 14.498" />
                                          </Icon>
                                        </button>
                                      }
                                      content={() => 'Match whole word'}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                  {readyToSearch &&
                                    renderSearchProps.keyword &&
                                    renderSearchProps.numberOfMatches === 0 && (
                                      <div style={{ padding: '0 8px' }}>Not found</div>
                                    )}
                                  {readyToSearch &&
                                    renderSearchProps.keyword &&
                                    renderSearchProps.numberOfMatches > 0 && (
                                      <div style={{ padding: '0 8px' }}>
                                        {renderSearchProps.currentMatch} of {renderSearchProps.numberOfMatches}
                                      </div>
                                    )}
                                  <div style={{ padding: '0 2px' }}>
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <MinimalButton onClick={renderSearchProps.jumpToPreviousMatch}>
                                          <PreviousIcon />
                                        </MinimalButton>
                                      }
                                      content={() => 'Previous match'}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                  <div style={{ padding: '0 2px' }}>
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <MinimalButton onClick={renderSearchProps.jumpToNextMatch}>
                                          <NextIcon />
                                        </MinimalButton>
                                      }
                                      content={() => 'Next match'}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                </>
                              );
                            }}
                          </Search>
                        </div>
                      </div>
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                        <div
                          style={{
                            height: "400px",
                            maxWidth: "1300px",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        >
                          {" "}
                          <Viewer
                            fileUrl={selectFileURL}
                            plugins={[searchPluginInstance]}
                            onDocumentLoad={handleDocumentLoad}
                          />
                        </div>
                      </Worker>

                    </div>
                  </Modal>
                )}
                {/* {isModalOpenValid && (
                  <Modal
                    title="Add Valid Code"
                    centered
                    open={isModalOpenValid}
                    onOk={handleCloseModal}
                    onCancel={handleCloseModal}
                    footer={null}
                  >
                    <div className="offcanvas-body">

                      <div className="container-fluid">
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Code <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <Form.Control
                                name="code"
                                required
                                type="text"
                              />
                            </div>
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Description <span className="text-danger">*</span>{" "}
                              </Form.Label>

                              <textarea
                                className="form-control"
                                id="val-suggestions"
                                name="val-suggestions"
                                rows="5"
                              ></textarea>
                            </div>
                          </div>

                          <div>
                            <Button type="submit" className="btn btn-primary btn-sm me-1">
                              {isLoading ? "Loding..." : "Submit"}
                            </Button>
                            <Button
                              onClick={() => handleCloseModal()}
                              className="btn btn-danger btn-sm light ms-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </Form>
                      </div>


                    </div>
                  </Modal>
                )} */}
                <Offcanvas onHide={handleCloseModal} show={isModalOpenValid} className="offcanvas-end" placement="end">
                  <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">
                      Add Valid Code
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => handleCloseModal()}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div className="offcanvas-body">
                    <div className="container-fluid">
                      <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Code <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="patientId"
                              required
                              type="text"
                            />
                          </div>
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Description <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <textarea
                              className="form-control"
                              id="val-suggestions"
                              name="val-suggestions"
                              rows="5"
                              required
                            ></textarea>
                          </div>
                        </div>

                        <div>
                          <Button type="submit" className="btn btn-primary btn-sm me-1">
                            Submit
                          </Button>
                          <Button
                            onClick={() => handleCloseModal()}
                            className="btn btn-danger btn-sm light ms-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </Offcanvas>

              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
};

