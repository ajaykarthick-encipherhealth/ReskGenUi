import React, { useState } from "react";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { Tab, Nav, Badge, Offcanvas, Button } from "react-bootstrap";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm } from "antd";
import NavBar from "../../../jsx/layouts/nav";
import axios from "../../../utility/axiosConfig";
import ENDPOINTS from "../../../utility/enpoints";

const FileView = () => {
  const sideMenu = useSelector((state) => state.sideMenu);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [selectFile, setSelectFile] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [validDiseasesList, setValidDiseasesList] = useState([]);
  const [inputValue, setInputValue] = useState({
    year: "",
  });

  const [selectDiseasesName, setSelectDiseasesName] = useState("");

  const [selectFileName, setSelectFileName] = useState("Upload File");

  const addPatientForm = () => {
    setValidated(false);
    setAddPatient(true);
  };

  const onChangeFile = (e) => {
    let value = URL.createObjectURL(e[0]);
    console.log(e[0]);
    console.log(value);
    let splitString = e[0].name.split(".");
    setSelectFileName(splitString[0]);
    setSelectFileURL(value);
    setSelectFile(e[0]);
  };

  const handleSubmit = async (event) => {
    console.log(inputValue);
    const form = event.currentTarget;
    console.log(form);
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoading(true);
      event.preventDefault();
      event.stopPropagation();
      const formData = new FormData();

      formData.append("dos", inputValue.year);
      formData.append("file", selectFile);
      formData.append("orgid", "677bd");
      formData.append("tenantid", "677bd");
      formData.append("userid", "677bd");
      formData.append("patinetid", "677bd");

      setSelectFile(formData);
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUpload + "upload",
        formData
      );
      if (response?.status == 200) {
        console.log(response.data);
        let result = response.data;
        let invalidDis = response.data.invalidDiseases;
        let validDis = response.data.validDiseases;

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
        comboCodeSplit(result.comboDiseaseCodes);

        setAddPatient(false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }

    setValidated(true);
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

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };
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

  const comboCodeSplit = (combo) => {
    const myArray = combo.split("\n");
    let splitCodes = [];
    let splitCodesArr = [];

    myArray.map((res) => {
      let split1 = res.split(":");
      splitCodes.push(split1);
    });

    splitCodes.map((res) => {
      if (res.length > 1) {
        if (res[0] == "AI") {
          splitCodesArr.push({
            name: res[1],
            code: res[2],
          });
        } else {
          splitCodesArr.push({
            name: res[0],
            code: res[1],
          });
        }
      }
    });

    console.log(splitCodesArr);

    setComboDiseaseCodesList(splitCodesArr);
  };

  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects task-table">
                      <div className="tbl-caption d-flex justify-content-between align-items-center">
                        <h4 className="heading mb-0">File View</h4>
                        <div>
                          <Button
                            onClick={addPatientForm}
                            className="btn btn-primary btn-sm ms-2"
                          >
                            + Add File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                              </Nav>
                              <Tab.Content>
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="validDiseases"
                                >
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
                                              (data, i) => {
                                                console.log(data, "test");
                                                return (
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
                                                        onConfirm={
                                                          confirmInvalid
                                                        }
                                                        placement="leftTop"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onOpenChange={() =>
                                                          onchangeValid(
                                                            data.name
                                                          )
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
                                                );
                                              }
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
                                <Tab.Pane
                                  id="my-posts"
                                  eventKey="comboDiseases"
                                >
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
                                                {comboDiseaseCodesList?.map(
                                                  (item) => {
                                                    return (
                                                      <tr>
                                                        <td>
                                                          <span>
                                                            {item.code}
                                                          </span>
                                                        </td>

                                                        <td>
                                                          <span>
                                                            {item.name}
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
                      <div className="card-footer d-flex justify-content-between flex-wrap">
                        <div className="due-progress">
                          <Button className="btn btn-primary btn-sm ms-2">
                            Find Score
                          </Button>
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

      <Offcanvas show={addPatient} className="offcanvas-end" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add File
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setAddPatient(false)}
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
                    File <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="file"
                    accept="application/pdf,text/plain"
                    onChange={(e) => onChangeFile(e.target.files)}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Year <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    name="year"
                    required
                    type="number"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  {isLoading ? "Loding..." : "Submit"}
                </Button>
                <Button
                  onClick={() => setAddPatient(false)}
                  className="btn btn-danger btn-sm light ms-1"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default FileView;
