import React, { useState, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import NavBar from "../../../../jsx/layouts/nav";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm } from "antd";

export default function PatientDetails() {
  const sideMenu = useSelector((state) => state.sideMenu);
  const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [validDiseasesList, setValidDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  useEffect(() => {
    getPatientDetails();
  }, []);

  const getPatientDetails = async () => {
    const formData = new FormData();
    formData.append("patientid", "12345");
    formData.append("orgid", "5678");
    let data = {};
    data.patientid = "12345";
    data.orgid = "5678";
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        "dbservice/patient/compute/get?patientid=12345&orgid=5678"
    );
    if (response.data) {
      let validDis = "";
      let invalidDis = "";
      let comboDis = "";
      let meatCri = "";

      for (var key in response.data.validDisease) {
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

      let invalidDiseasesArray = [];
      let validDiseasesArray = [];

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
    }
  };

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
    let namePush = [];
    namePush.push({ name: selectDiseasesName });
    let newArray = [];
    newArray = [...invalidDiseasesList, ...namePush];
    setInvalidDiseasesList(newArray);
  };
  const invalidMoveConfirm = () => {
    const result = invalidDiseasesList.filter(
      (res) => res.name != selectDiseasesName
    );
    setInvalidDiseasesList(result);
    let namePush = [];
    namePush.push({ name: selectDiseasesName });
    let newArray = [];
    newArray = [...validDiseasesList, ...namePush];
    setValidDiseasesList(newArray);
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
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="profile-tab">
                          <div className="custom-tab-1">
                            <Tab.Container defaultActiveKey="validDiseases">
                              <Nav as="ul" className="nav nav-tabs">
                                <Nav.Item as="li" className="nav-item">
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="validDiseases"
                                  >
                                    Diseases
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li" className="nav-item">
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="comboDiseases"
                                  >
                                    Combo Diseases
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li" className="nav-item">
                                  <Nav.Link
                                    to="#my-posts"
                                    eventKey="meatCriteria"
                                  >
                                    Meat Criteria
                                  </Nav.Link>
                                </Nav.Item>
                              </Nav>
                              <Tab.Content>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="validDiseases"
                                >
                                  <div className="my-post-content pt-3">
                                    <div className="widget-media   ps--active-y">
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
                                            {validDiseasesList.map(
                                              (data, i) => (
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
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        />
                                                      </div>
                                                    </Popconfirm>
                                                  </div>
                                                </li>
                                              )
                                            )}
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
                                            {invalidDiseasesList.map(
                                              (data, i) => (
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
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        />
                                                      </div>
                                                    </Popconfirm>
                                                  </div>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Tab.Pane>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="invalidDiseases"
                                >
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
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="comboDiseases"
                                >
                                  <div className="my-post-content pt-3">
                                    <div className="widget-media  ps--active-y">
                                      <ul className="timeline">
                                        <li>
                                          <div className="tablecontainer">
                                            <table
                                              id="empoloyeestbl2"
                                              className="dataTable no-footer mb-2 mb-sm-0 tableSyle fileView-table"
                                              style={{
                                                width: "100%",

                                                margin: "auto",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <thead>
                                                <tr>
                                                  <th>Diagnosis Code Combo</th>
                                                  <th>Codes</th>
                                                  <th>DiseaseName</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {comboDiseaseCodesList?.map(
                                                  (item) => {
                                                    return (
                                                      <tr>
                                                        <td>
                                                          <span>
                                                            {
                                                              item.diagnosisCodeCombo
                                                            }
                                                          </span>
                                                        </td>
                                                        <td>
                                                          <span>
                                                            {item.addOnCode}
                                                          </span>
                                                        </td>

                                                        <td>
                                                          <span>
                                                            {item.diseaseName}
                                                          </span>
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )}
                                              </tbody>
                                            </table>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </Tab.Pane>
                                <Tab.Pane id="my-posts" eventKey="meatCriteria">
                                  <div className="my-post-content pt-3">
                                    <div className="widget-media  ps--active-y">
                                      <ul className="timeline">
                                        <li>
                                          <div className="tablecontainer">
                                            <table
                                              id="empoloyeestbl2"
                                              className="dataTable no-footer mb-2 mb-sm-0 tableSyle fileView-table"
                                              style={{
                                                width: "100%",

                                                margin: "auto",
                                                marginTop: "10px",
                                              }}
                                            >
                                              <thead>
                                                <tr>
                                                  <th>Codes</th>
                                                  <th>Name</th>
                                                  <th>assessment</th>
                                                  <th>evaluation</th>
                                                  <th>monitor</th>
                                                  <th>treatment</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {meatCriteriaList?.map(
                                                  (item) => {
                                                    return (
                                                      <tr>
                                                        <td>
                                                          <span>
                                                            {item.diseaseCode}
                                                          </span>
                                                        </td>
                                                        <td>
                                                          <span>
                                                            {item.diseaseName}
                                                          </span>
                                                        </td>
                                                        <td>
                                                          <span>
                                                            {item.assessment}
                                                          </span>
                                                        </td>
                                                        <td>
                                                          <span>
                                                            {item.evaluation}
                                                          </span>
                                                        </td>
                                                        <td>
                                                          <span>
                                                            {item.monitor}
                                                          </span>
                                                        </td>
                                                        <td>
                                                          <span>
                                                            {item.treatment}
                                                          </span>
                                                        </td>
                                                      </tr>
                                                    );
                                                  }
                                                )}
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
}
