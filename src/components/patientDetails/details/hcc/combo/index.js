import React, { useState, useEffect } from "react";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment from "moment";
import "react-vertical-timeline-component/style.min.css";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowsAlt,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, notification, Tag, Modal } from "antd";
import { SVGICON } from "../../../../../jsx/constant/theme";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Spinner from "../../../../../components/loadingSpinner";
import styles from "../styles.module.css";
import { manuallyAddComboCode } from "../../../../../services/PatientsListSevice";
import { getPatientDetailsResult } from "../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import CamboTree from "../org";
import PdfViewer from "../../PdfViewerComponent";
import {
  getCaptureSectionBackgroundFile,
  getEncounterDateBackground,
  getProviderNameList,
} from "../../components/function/ReusableFunctions";
import { getPatientDetails } from "../../components/function/GetData";
const addOnCodeColor = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];
const Combo = ({ activeComboTree }) => {
  const dispatch = useDispatch();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const hccFileDetails = useSelector(
    (state) => state?.ReviewerReducers?.hccFileDetails
  );

  const fileDosPageNumberList = useSelector(
    (state) => state?.ReviewerReducers.dosPageNumberList
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;
  const { setTargetPages } = searchPluginInstance;
  const [isModalOpenCaptureSection, setIsModalOpenCaptureSection] =
    useState(false);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] =
    useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [selectCode, setSelectCode] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [combiTree, setCombiTree] = useState({});
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    notes: "",
    diagnosisCode: "",
    actualDescription: "",
    capturedSections: "",
    encodedDate: "",
    flag: "",
    comments: "",
    description: "",
    queryReason: "",
    providerName: "",
    imagingTestHeader: "",
    headerName: "",
    queryComment: "",
    reason: "",
    diagnosisCodeQuery: "",
    comboCode: "",
    additionalCode: "",
  });
  const [localPatientId, setLocalPatientId] = useState("");
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [isAddComboCode, setIsAddComboCode] = useState(false);
  const [listPageNumber, setListPageNumber] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [search, setSearch] = useState(false);

  const dosSummariesList = [
    {
      dos: "2023-09-30",
      startPageNumber: 4,
      endPageNumber: 4,
    },
    {
      dos: "2023-03-29",
      startPageNumber: 5,
      endPageNumber: 10,
    },
    {
      dos: "2023-10-11",
      startPageNumber: 1,
      endPageNumber: 3,
    },
  ];

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCodeQuery") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "encodedDate") {
      setInputValueFileDate(e.target.value);
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    getPatientDetails(
      orgId,
      tenId,
      setPatientDocumentResult,
      "",
      "",
      "",
      setEncounterDateMatching,
      setCaptureSectionMatching,
      "",
      patientDetailsResult,
      dispatch,
      sectionColorList,
      "",
      setComboDiseaseCodesList
    );
  }, [patientDetailsResult]);

  useEffect(() => {
    if (hccFileDetails?.result?.response) {
      setSelectFileURL(hccFileDetails?.result?.response);
    }
  }, [hccFileDetails]);


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
  const onchangeCombo = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };

  const comboMoveInvalidConfirm = () => {
    const result = comboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = comboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setComboDiseaseCodesList(result);
    let namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    let newArray = [];
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
    let newArray = [];
    newArray = [...comboDiseaseCodesList, ...result2];
    setComboDiseaseCodesList(newArray);
  };

  const handleCloseModal = () => {
    setValidated(false);
    setIsModalOpenCaptureSection(false);
    setIsAddComboCode(false);
    setFindFileKeyword(null);
    setFileLoading(false);
  };

  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const getPatientDetailsReload = async (patientId) => {
    dispatch(getPatientDetailsResult(patientId));
  };

  function removeDuplicates(array) {
    let output = [];
    if (array) {
      for (let item of array) {
        if (!output.includes(item)) output.push(item);
      }
    }

    return output;
  }

  const addComboCode = () => {
    setIsAddComboCode(true);
  };

  const handleSubmitComboCode = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      let updateDataformat = {
        patientId: localPatientId,
        dosYear: "",
        comboCode: inputValue.comboCode,
        additionalCode: inputValue.additionalCode,
        description: inputValue.description,
      };
      let result = await manuallyAddComboCode(updateDataformat);
      if (result.status == "SUCCESS") {
        setIsAddComboCode(false);
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getPatientDetailsReload(localPatientId);
      }

      setValidated(true);
    }
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  useEffect(() => {
    if (activeComboTree) {
      comboDiseaseCodesList?.map((item) => {
        if (
          item.diagnosisCodeCombo.replace(".", "") ==
          activeComboTree.diagnosisCode.replace(".", "")
        ) {
          setOpens(true);
          setCombiTree([{ ...item, expanded: true }]);
        }
      });
    }
  }, [activeComboTree]);

  return (
    <>
      {fileLoading ? (
        <div className={styles.overlay_style}>
          <div className={styles.overlay__inner_style}>
            <div className={styles.overlay__content_style}>
              <span className={styles.spinner_style}></span>
            </div>
          </div>
        </div>
      ) : null}
      <div className={`${visitStyles.comboContainer}`}>
        <div className={`row ${visitStyles.comboContainer2}`}>
          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>VALID CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label htmlFor="combo">Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label htmlFor="additional">Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label htmlFor="description">Description</label>
                  </div>
                  <div className="col-xl-1">
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => addComboCode()}
                        className={visitStyles.combo_add_btn}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{
                            color: "#fff",
                            size: 12,
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {comboDiseaseCodesList?.length != 0 ? (
                <div className={visitStyles.container}>
                  <div className={visitStyles.hccStickey_head}>
                    {comboDiseaseCodesList?.map((item) => {
                      return (
                        <div
                          className={visitStyles.combo_details_card}
                          key={item?.id}
                        >
                          <div className="row">
                            <div className="col-xl-3 d-grid">
                              <span className="font-bold">
                                {item.diagnosisCodeCombo}
                              </span>
                            </div>
                            <div className="col-xl-3">
                              {item.addOnCodes?.map(
                                (addCombo, index) =>
                                  addCombo && (
                                    <span
                                      className="font-bold"
                                      key={addOnCodeColor[index]}
                                    >
                                      <Tag color={addOnCodeColor[index]}>
                                        {addCombo}
                                      </Tag>
                                    </span>
                                  )
                              )}
                            </div>
                            <div className="col-xl-5">
                              <span>{item.diseaseName}</span>
                            </div>
                            <div className="col-xl-1">
                              <div>
                                <Popconfirm
                                  title="You want move to Invalid?"
                                  description={item.diseaseName}
                                  onConfirm={confirmComboInvalid}
                                  placement="leftTop"
                                  okText="Yes"
                                  cancelText="No"
                                  onOpenChange={() =>
                                    onchangeCombo(
                                      item.diseaseName,
                                      item.addOnCode
                                    )
                                  }
                                >
                                  <div className={visitStyles.close_icon}>
                                    <FontAwesomeIcon
                                      icon={faArrowsAlt}
                                      style={{
                                        size: 8,
                                        color: "#a80404",
                                      }}
                                    />
                                  </div>
                                </Popconfirm>
                              </div>

                              <div
                                className={visitStyles.close_icon}
                                style={{ background: "#c7f3c6" }}
                                onClick={() => {
                                  setOpens(true);
                                  setCombiTree([{ ...item, expanded: true }]);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faSitemap}
                                  style={{
                                    size: 8,
                                    color: "#088f39",
                                  }}
                                />
                              </div>
                            </div>
                            <div className={styles.comboDetailsHeaders}>
                              <div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getProviderNameList({
                                    data: item?.providerName,
                                    captureSectionMatching:
                                      captureSectionMatching,
                                  })}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getEncounterDateBackground({
                                    value: item?.encounterDateSplit,
                                    encounterDateMatching:
                                      encounterDateMatching,
                                    fileDosPageNumberList:
                                      fileDosPageNumberList,
                                    setIsModalOpenValidCodes:
                                      setIsModalOpenCaptureSection,
                                    setSearch: setSearch,
                                    setFileModalHeader: setFileModalHeader,
                                    patientDocumentResult:
                                      patientDocumentResult,
                                    fileDosPageNumberList:
                                      fileDosPageNumberList,
                                  })}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getCaptureSectionBackgroundFile(
                                    item?.capturedSections,
                                    item?.encounterDate,
                                    item?.actualDescription,
                                    item?.diagnosisCode,
                                    item?.getPlace,
                                    captureSectionMatching,
                                    setSearch,
                                    setFileLoading,
                                    "",
                                    "",
                                    setIsModalOpenCaptureSection,
                                    setFileModalHeader,
                                    "",
                                    patientDocumentResult,
                                    fileInitialPage,
                                    setFileInitialPage,
                                    item?.hyperlinks,
                                    encounterDateMatching
                                  )}
                                  {/* {getCaptureSectionBackground(
                                    item.capturedSections,
                                    "COMBO",
                                    item.encounterDate,
                                    item.diseaseName,
                                    null,
                                    item.diagnosisCodeCombo
                                  )} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {comboDiseaseCodesList?.length == 0 ? (
                <div>
                  <span className="no-patient-data">No Combination Codes</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>DELETED COMBO CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label htmlFor="combo">Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label htmlFor="additional">Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label htmlFor="description">Description</label>
                  </div>
                </div>
              </div>
              {invalidComboDiseaseCodesList?.length != 0 ? (
                <div className={visitStyles.container}>
                  <div className={visitStyles.hccStickey_head}>
                    {invalidComboDiseaseCodesList?.map((item) => {
                      return (
                        <div className={visitStyles.combo_details_card}>
                          <div className="row">
                            <div className="col-xl-3">
                              <span className="font-bold">
                                {item.diagnosisCodeCombo}
                              </span>
                            </div>
                            <div className="col-xl-3">
                              <span className="font-bold">
                                {item.addOnCode}
                              </span>
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
                                  onchangeCombo(
                                    item.diseaseName,
                                    item.addOnCode
                                  )
                                }
                              >
                                <div className={visitStyles.tick_icon}>
                                  {SVGICON.tickIcon}
                                </div>
                              </Popconfirm>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isModalOpenCaptureSection && (
        <Modal
          title={fileModalHeader}
          centered
          open={isModalOpenCaptureSection}
          style={{ top: 1 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="95%"
          footer={false}
        >
          <div className="section-container">
            <div className="row">
              <div className="col-xl-5">
                <div
                  className={`my-post-content  ${visitStyles.comboContainer3}`}
                >
                  <div className={visitStyles.combo_head_card}>
                    <div className="row">
                      <div className="col-xl-3">
                        <label htmlFor="combo">Combo Codes</label>
                      </div>
                      <div className="col-xl-3">
                        <label htmlFor="additional">Additional Codes</label>
                      </div>
                      <div className="col-xl-5">
                        <label htmlFor="description">Description</label>
                      </div>
                      <div className="col-xl-1"></div>
                    </div>
                  </div>
                  {comboDiseaseCodesList?.length != 0 ? (
                    <div className={visitStyles.container}>
                      <div className={visitStyles.hccStickey_head}>
                        {comboDiseaseCodesList?.map((item) => {
                          return (
                            <div
                              className={visitStyles.combo_details_card}
                              key={item?.id}
                            >
                              <div className="row">
                                <div className="col-xl-3 d-grid">
                                  <span className="font-bold">
                                    {item.diagnosisCodeCombo}
                                  </span>
                                </div>
                                <div className="col-xl-3">
                                  {item.addOnCodes?.map(
                                    (addCombo, index) =>
                                      addCombo && (
                                        <span
                                          className="font-bold"
                                          key={addOnCodeColor[index]}
                                        >
                                          <Tag color={addOnCodeColor[index]}>
                                            {addCombo}
                                          </Tag>
                                        </span>
                                      )
                                  )}
                                </div>
                                <div className="col-xl-5">
                                  <span>{item.diseaseName}</span>
                                </div>
                                <div className="col-xl-1">
                                  <div>
                                    <Popconfirm
                                      title="You want move to Invalid?"
                                      description={item.diseaseName}
                                      onConfirm={confirmComboInvalid}
                                      placement="leftTop"
                                      okText="Yes"
                                      cancelText="No"
                                      onOpenChange={() =>
                                        onchangeCombo(
                                          item.diseaseName,
                                          item.addOnCode
                                        )
                                      }
                                    >
                                      <div className={visitStyles.close_icon}>
                                        <FontAwesomeIcon
                                          icon={faArrowsAlt}
                                          style={{
                                            size: 8,
                                            color: "#a80404",
                                          }}
                                        />
                                      </div>
                                    </Popconfirm>
                                  </div>

                                  <div
                                    className={visitStyles.close_icon}
                                    style={{ background: "#c7f3c6" }}
                                    onClick={() => {
                                      setOpens(true);
                                      setCombiTree([
                                        { ...item, expanded: true },
                                      ]);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faSitemap}
                                      style={{
                                        size: 8,
                                        color: "#088f39",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className={styles.comboDetailsHeaders}>
                                  <div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getProviderNameList({
                                        data: item?.providerName,
                                        captureSectionMatching:
                                          captureSectionMatching,
                                      })}
                                    </div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getEncounterDateBackground({
                                        value: item?.encounterDateSplit,
                                        encounterDateMatching:
                                          encounterDateMatching,
                                        fileDosPageNumberList:
                                          fileDosPageNumberList,
                                        setIsModalOpenValidCodes:
                                          setIsModalOpenCaptureSection,

                                        setSearch: setSearch,
                                        setFileModalHeader: setFileModalHeader,
                                        patientDocumentResult:
                                          patientDocumentResult,
                                      })}
                                    </div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getCaptureSectionBackgroundFile(
                                        item?.capturedSections,
                                        item?.encounterDate,
                                        item?.actualDescription,
                                        item?.diagnosisCode,
                                        item?.getPlace,
                                        captureSectionMatching,
                                        setSearch,
                                        setFileLoading,
                                        "",
                                        "",
                                        setIsModalOpenCaptureSection,
                                        setFileModalHeader,
                                        "",
                                        patientDocumentResult,
                                        fileInitialPage,
                                        setFileInitialPage,
                                        item?.hyperlinks,
                                        encounterDateMatching
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-xl-7">
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
                    headerContent={search?.headerContent}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
      {opens && combiTree[0]?.children?.length > 0 ? (
        <Modal
          title={fileModalHeader}
          width="90%"
          centered
          open={opens}
          onOk={() => setOpens(false)}
          onCancel={() => setOpens(false)}
          footer={null}
        >
          <CamboTree tree={combiTree} />
        </Modal>
      ) : (
        opens && showErrorMessage()
      )}
      <Offcanvas
        onHide={handleCloseModal}
        show={isAddComboCode}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add Combo Code
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
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmitComboCode}
            >
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Combo Code <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="comboCode"
                    name="comboCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>Additional Code</Form.Label>
                  <Form.Control
                    type="text"
                    id="additionalCode"
                    name="additionalCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={handleChangeSuggested}
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
    </>
  );
};

export default Combo;
