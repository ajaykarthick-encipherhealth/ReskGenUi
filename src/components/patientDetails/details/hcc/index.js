import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import { connect } from "react-redux";
import visitStyles from "../../../../styles/visitdata.module.css";
import TableStyle from "../../../table/table.module.css";
import VisitData from "./visitData";
import Combo from "./combo";
import Meat from "./meat";
import RafScore from "./raf";
import MeatQuery from "./meatQuery";
import File from "./file";
import {
  Button,
  Dropdown,
  Popover,
  Select,
  Menu,
  Tooltip,
  Badge,
  Tag,
  Divider,
  Modal,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faCircleXmark,
  faClose,
  faLeftRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../hcc/styles.module.css";
import moment from "moment";
import { actions as detailsActions } from "../../../../stores/patient/details";
import warning from "../../../../images/svg/warning.svg";
import Image from "next/image";
import YearAndDosStatus from "../components/yearAndDosStatus";
import { getStatusIcon, selectTab } from "../../../reuseableFunctions";
import { getStorage } from "../../../../utils/storages";
import { SwapOutlined } from "@ant-design/icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
const { Option } = Select;

const Hcc = ({
  year,
  setIsLoading,
  patientDetailsResult,
  getpatientDetailsData,
  patientDosResult,
  getSelectedDos,
  getSelectedDosPageNumber,
  getCurrentDiseaseType,
  isDosSelected,
  selectDosValue,
  setSelectDosValue,
  getLabPDFFile,
  getPatientHccFile,
  storeFileDetails,
}) => {
  const [activeTabHead, setActiveTabHead] = useState(1);
  const [flagTagActive, setFlagTagActive] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [activeMeatTitle, setActiveMeatTitle] = useState(null);
  const [activeComboTree, setActiveComboTree] = useState(null);
  const [pageNumberOptions, setPageNumberOptions] = useState([]);
  const [search, setSearch] = useState();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [dosSummariesList, setDosSummariesList] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [actions, setActions] = useState({
    showDisease: false,
    reEvaluate: false,
    showActionsPop: false,
  });
  const [selectedReEvaluateItems, setSelectedReEvaluateItems] = useState([]);

  useEffect(() => {
    if (patientDosResult?.data?.response) {
      // setSelectDosValue("");
      var dosList = [];
      patientDosResult?.data?.response?.map((res, index) => {
        if (res) {
          var dosLable = (
            <>
              <div className="d-flex justify-content-between gap-1 align-items-center ">
                <div className="d-flex gap-1">
                  <span>
                    {res?.stateIndicators?.includes("CHART") && (
                      <span
                        className="p-1 rounded-1"
                        style={{
                          background: "#87d068",
                          color: "#fff",
                          fontSize: "10px",
                        }}
                      >
                        C
                      </span>
                    )}
                    {res?.stateIndicators?.includes("LAB") && (
                      <span
                        className="p-1 rounded-2 mx-1 me-2"
                        style={{
                          background: "#108ee9",
                          color: "#fff",
                          fontSize: "10px",
                        }}
                      >
                        L
                      </span>
                    )}
                    {res?.stateIndicators?.includes("RADIOLOGY") && (
                      <span
                        className="p-1 rounded-2 mx-1"
                        style={{
                          background: "#f50",
                          color: "#fff",
                          fontSize: "10px",
                        }}
                      >
                        R
                      </span>
                    )}
                  </span>

                  <span className={styles.dosLable}>
                    {moment(res.dateOfService).format("MM-DD-YYYY")}
                  </span>
                </div>
                {getStatusIcon(res.processedStatus)}
              </div>
            </>
          );
          dosList.push({
            value: res.dateOfService,
            label: dosLable,
            details: res,
          });
        }
      });
      setDosSummariesList(dosList);
      if (patientDetailsResult?.data?.response?.dateOfService) {
        // setSelectDosValue(patientDetailsResult?.data?.response?.dateOfService);
        if (isDosSelected) {
          const patientId = getStorage("patientId");
          const role = getStorage("userRole");
          getpatientDetailsData(
            patientId,
            null,
            moment(isDosSelected).format("YYYY-MM-DD"),
            "",
            role
          );
        }
      }
    }
  }, [patientDosResult?.data?.response]);

  useEffect(() => {
    setTimeout(() => {
      setActiveMeatTitle(null);
    }, 10000);
  }, [activeMeatTitle]);

  const handleOptions = (value) => {
    // if (value) {
    setIsLoading(true);
    setSelectDosValue(value);
    const filteredDos = pageNumberOptions?.filter(
      (data) => data?.dos === value
    );
    const filteredDos1 = dosSummariesList?.find(
      (data) => data?.value === value
    );
    storeFileDetails(filteredDos1?.details?.fileId || null);
    setSelectedFile(filteredDos1?.details?.fileId || "");
    if (filteredDos1?.details?.stateIndicators?.includes("LAB")) {
      // getLabPDFFile({ fileId: filteredDos1.details?.fileId });
    } else if (filteredDos1?.details?.stateIndicators?.includes("RADIOLOGY")) {
      // getLabPDFFile({ fileId: filteredDos1.details?.fileId });
    } else {
      // if (!filteredDos1?.details?.fileId) {
      //   getLabPDFFile({
      //     fileId:
      //       patientDetailsResult?.data?.response?.fileDetailDTO?.azureBlobPath,
      //   });
      //   getPatientHccFile(
      //     patientDetailsResult?.data?.response?.fileDetailDTO?.azureBlobPath
      //   );
      // } else {
      //   getLabPDFFile({ fileId: filteredDos1?.details?.fileId });
      // }

      getSelectedDosPageNumber(
        filteredDos?.length > 0 ? filteredDos[0]?.startPageNumber : null
      );
    }

    if (value) {
      getSelectedDos(value);
    } else {
      getSelectedDos("");
    }
    const patientId = getStorage("patientId");
    const role = getStorage("userRole");

    if (value) {
      getpatientDetailsData(
        patientId,
        null,
        moment(value).format("YYYY-MM-DD"),
        "",
        role
      );
    } else {
      getpatientDetailsData(
        patientId,
        patientDetailsResult?.data?.response?.processedYear,
        null,
        "",
        role
      );
    }

    // setActions({
    //   showDisease: !value && false,
    //   reEvaluate: !value && false,
    //   showActionsPop: !value && false,
    // });
  };
  const handleChangePageNumber = async (value) => {
    // setPopoverVisible(false);
    setSearch({
      value: "",
      page: value,
    });
    getSelectedDosPageNumber(value);
  };

  const PopContent = (
    <div className={styles.innerPop}>
      <div
        style={{
          marginBottom: "25px",
          position: "relative",
          bottom: "24px",
        }}
      >
        <FontAwesomeIcon
          icon={faClose}
          style={{
            size: 5,
            color: "#fff",
          }}
          className={styles.close_icon}
          onClick={() => setPopoverVisible(false)}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          background: "#04306f",
          color: "white",
          height: "30px",
          borderRadius: "5px",
          alignItems: "center",
        }}
      >
        <div>Date</div>
        <div style={{ paddingLeft: "60px" }}>Page Number</div>
      </div>
      <div className={styles.displayDiv}>
        {pageNumberOptions
          ? pageNumberOptions?.map((data) => (
              <div className={styles.hoverDiv} style={{ marginBottom: "5px" }}>
                <div
                  className={` ${styles.selectDetailsContainer}`}
                  style={{
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    margin: "0",
                  }}
                >
                  <div className="col-xl-6 ">
                    <span className={styles.selectHead}>
                      {moment(data.dos).format("MM-DD-YYYY")}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      className={`col-xl-4 p-2 cr-pointer ${styles.hoverPageNum}`}
                      style={{
                        textAlign: "center",
                        margin: "10px",
                      }}
                      onClick={() =>
                        handleChangePageNumber(data.startPageNumber)
                      }
                    >
                      <span>{data?.startPageNumber}</span>
                    </div>
                    <div
                      className="col-xl-1 text-center"
                      style={{ padding: "10px" }}
                    >
                      <SwapOutlined />
                    </div>

                    <div
                      className={`col-xl-4 p-2 cr-pointer ${styles.hoverPageNum}`}
                      style={{
                        textAlign: "center",
                        margin: "10px",
                      }}
                      onClick={() => handleChangePageNumber(data.endPagNumber)}
                    >
                      <span>{data?.endPagNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );

  const hideDiseasePopContent = (
    <>
      <div className="row">
        <div className="col-xl-6 my-2">Re-Evaluate</div>
        <div
          className="col-xl-6 d-flex justify-content-end align-items-center cursor-pointer"
          onClick={() =>
            setActions({
              showDisease: actions?.showDisease,
              reEvaluate: true,
              showActionsPop: false,
            })
          }
        >
          <FontAwesomeIcon icon={faAngleRight} style={{ color: "#04306f" }} />
        </div>
        <Divider className="p-0 m-0" />
        <div className="col-xl-6 my-2">Disease</div>
        <div
          className="col-xl-6 d-flex justify-content-end align-items-center cursor-pointer"
          onClick={() => {
            // selectDosValue &&
            setActions({
              showDisease: !actions?.showDisease,
              reEvaluate: actions?.reEvaluate,
              showActionsPop: actions?.showActionsPop,
            });
          }}
        >
          <span
            className="px-2"
            style={{
              width: "50px",
              color: actions?.showDisease ? "#04306f" : "#d9d9d9",
            }}
          >
            {actions?.showDisease ? "Hide" : "Show"}
          </span>
          <div style={{ width: "15px" }}>
            <FontAwesomeIcon
              icon={actions?.showDisease ? faEye : faEyeSlash}
              style={{ color: actions?.showDisease ? "#04306f" : "#d9d9d9" }}
            />
          </div>
        </div>
      </div>
      {/* <div className="d-flex justify-content-end align-items-center cursor-pointer">
        {" "}
        <button
          className={`${visitStyles.actionBtn} px-2 py-1 rounded-md mt-4`}
          onClick={() => {
            setActions({
              showActionsPop: false,
              showDisease: actions?.showDisease,
              reEvaluate: false,
            });
          }}
        >
          Cancel
        </button>
      </div> */}
    </>
  );

  return (
    <div className={visitStyles.visitdata_tab_body}>
      <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
        <div className="custom-tab-1 ">
          <Tab.Container activeKey={activeTabHead}>
            <div className="row">
              <div className="col-12">
                <Nav as="ul" className="nav nav-tabs">
                  <div className={`d-flex justify-content-between flex-wrap `}>
                    {/* <div className="d-flex"> */}
                    <Nav.Item as="li" className="nav-item ">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={1}
                        className={visitStyles.navColor}
                        onClick={() => {
                          selectTab(
                            1,
                            setFlagTagActive,
                            setActiveTabHead,
                            setActiveComboTree,
                            setPopoverVisible
                          );
                          getCurrentDiseaseType(true);
                        }}
                      >
                        File
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={2}
                        className={` text-truncate ${visitStyles.navColor}`}
                        activeClassName={visitStyles.activeLink}
                        onClick={() =>
                          selectTab(
                            2,
                            setFlagTagActive,
                            setActiveTabHead,
                            setActiveComboTree,
                            setPopoverVisible
                          )
                        }
                      >
                        Visit Data
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={3}
                        className={` text-truncate ${visitStyles.navColor}`}
                        onClick={() =>
                          selectTab(
                            3,
                            setFlagTagActive,
                            setActiveTabHead,
                            setActiveComboTree,
                            setPopoverVisible
                          )
                        }
                      >
                        Combination Codes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={4}
                        className={` text-truncate ${visitStyles.navColor}`}
                        onClick={() =>
                          selectTab(
                            4,
                            setFlagTagActive,
                            setActiveTabHead,
                            setActiveComboTree,
                            setPopoverVisible
                          )
                        }
                      >
                        MEAT Criteria
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={5}
                        className={` text-truncate ${visitStyles.navColor}`}
                        onClick={() =>
                          selectTab(
                            5,
                            setFlagTagActive,
                            setActiveTabHead,
                            setActiveComboTree,
                            setPopoverVisible,
                            setActiveMeatTitle
                          )
                        }
                      >
                        RAF Score
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={6}
                        className={` text-truncate ${visitStyles.navColor}`}
                        onClick={() =>
                          selectTab(
                            6,
                            setFlagTagActive,
                            setActiveTabHead,
                            setActiveComboTree,
                            setPopoverVisible
                          )
                        }
                      >
                        Query
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <div className="d-flex gap-3 mx-2">
                        <Select
                          placeholder="Select DOS"
                          onChange={handleOptions}
                          className="dosSelect"
                          allowClear={true}
                          value={selectDosValue ? selectDosValue : null}
                        >
                          {dosSummariesList?.map((data) => (
                            <Option key={data?.value} value={data?.value}>
                              {data.label}
                            </Option>
                          ))}
                        </Select>
                        {getStorage("userRole") != "admin" &&
                          selectDosValue && (
                            <YearAndDosStatus
                              setIsLoading={setIsLoading}
                              isDosStatus={true}
                            />
                          )}
                        {activeTabHead == 1 && (
                          <Popover
                            open={popoverVisible}
                            content={PopContent}
                            placement="bottom"
                            trigger={"click"}
                            overlayStyle={{ zIndex: 1000 }}
                            onOpenChange={() => setPopoverVisible(false)}
                          >
                            <div
                              className={`${styles.actionDosPageBtn} px-3  py-1 rounded-md`}
                              onClick={() => {
                                setPopoverVisible(true);
                              }}
                              // style={{ marginLeft: "10px" }}
                            >
                              Select Dos Page Number
                            </div>
                          </Popover>
                        )}
                        {flagTagActive ? (
                          <div>
                            <div>
                              <Popover
                                content={
                                  <>
                                    <div className={visitStyles.flags}>
                                      <div className={visitStyles.flags}>
                                        <span
                                          className={visitStyles.hccFlag}
                                        ></span>
                                        <span className={visitStyles.flagCodes}>
                                          HCC
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags}>
                                        <span
                                          className={visitStyles.suggestedFlag}
                                        ></span>
                                        <span className={visitStyles.flagCodes}>
                                          SUGGESTED
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags}>
                                        <span
                                          className={visitStyles.deleteFlag}
                                        ></span>
                                        <span className={visitStyles.flagCodes}>
                                          DELETED
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags}>
                                        <span
                                          className={visitStyles.nonhccFlag}
                                        ></span>
                                        <span className={visitStyles.flagCodes}>
                                          NON HCC
                                        </span>
                                      </div>
                                      <div className={visitStyles.flags}>
                                        <span
                                          className={visitStyles.potentialFlag}
                                        ></span>
                                        <span className={visitStyles.flagCodes}>
                                          POTENTIAL DIAGNOSIS
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                }
                                trigger={["click"]}
                                placement="bottom"
                              >
                                <Image
                                  src={warning}
                                  style={{ cursor: "pointer" }}
                                />
                              </Popover>
                            </div>
                            {/* <div className={visitStyles.flags}>
                        <div className={visitStyles.flags}>
                          <span className={visitStyles.hccFlag}></span>
                          <span className={visitStyles.flagCodes}>HCC</span>
                        </div>
                        <div className={visitStyles.flags}>
                          <span className={visitStyles.suggestedFlag}></span>
                          <span className={visitStyles.flagCodes}>
                            SUGGESTED
                          </span>
                        </div>
                        <div className={visitStyles.flags}>
                          <span className={visitStyles.deleteFlag}></span>
                          <span className={visitStyles.flagCodes}>DELETED</span>
                        </div>
                        <div className={visitStyles.flags}>
                          <span className={visitStyles.nonhccFlag}></span>
                          <span className={visitStyles.flagCodes}>NON HCC</span>
                        </div>
                      </div> */}
                          </div>
                        ) : null}
                      </div>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Popover
                        open={actions.showActionsPop}
                        trigger={["click"]}
                        placement="bottom"
                        content={hideDiseasePopContent}
                        onOpenChange={() =>
                          setActions({
                            showActionsPop: !actions.showActionsPop,
                            showDisease: actions?.showDisease,
                            reEvaluate: actions?.reEvaluate,
                          })
                        }
                      >
                        <button
                          className={`${visitStyles.actionBtn} px-3  py-1 rounded-md`}
                          onClick={() =>
                            setActions({
                              showActionsPop: !actions.showActionsPop,
                              showDisease: actions?.showDisease,
                              reEvaluate: actions?.reEvaluate,
                            })
                          }
                        >
                          Action
                        </button>
                      </Popover>
                    </Nav.Item>
                  </div>
                </Nav>
              </div>
            </div>
            <Tab.Content>
              <Tab.Pane id="my-posts" eventKey={1}>
                <File
                  popoverVisible={popoverVisible}
                  setPopoverVisible={setPopoverVisible}
                  year={year}
                  setActiveTabHead={setActiveTabHead}
                  setActiveMeatTitle={setActiveMeatTitle}
                  setActiveComboTree={setActiveComboTree}
                  pageNumberOptions={pageNumberOptions}
                  setPageNumberOptions={setPageNumberOptions}
                  search={search}
                  setSearch={setSearch}
                  actions={actions}
                  selectDosValue={selectDosValue}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={2}>
                <VisitData
                  setActiveTabHead={setActiveTabHead}
                  setActiveMeatTitle={setActiveMeatTitle}
                  setActiveComboTree={setActiveComboTree}
                  year={year}
                  actions={actions}
                  selectDosValue={selectDosValue}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={3}>
                <Combo
                  setActiveTabHead={setActiveTabHead}
                  setActiveMeatTitle={setActiveMeatTitle}
                  activeComboTree={activeComboTree}
                  year={year}
                  actions={actions}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={4}>
                <Meat
                  activeMeatTitle={activeMeatTitle}
                  year={year}
                  actions={actions}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={5}>
                <RafScore />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={6}>
                <MeatQuery year={year} actions={actions} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
      <Modal
        open={actions?.reEvaluate}
        footer={false}
        onCancel={() => {
          setActions({
            showActionsPop: actions?.showActionsPop,
            showDisease: actions?.showDisease,
            reEvaluate: false,
          });
          setSelectedReEvaluateItems([]);
        }}
        width={300}
      >
        <div className="font-bold">Re-Evaluate</div>
        <Divider className="p-0 my-2" />
        <div className="row">
          <div className="col-xl-10">Combination</div>
          <div className="col-xl-2 p-0 d-flex">
            <input
              type="checkbox"
              onChange={(val) => {
                val?.target.checked
                  ? setSelectedReEvaluateItems((prev) => [
                      ...prev,
                      "Combination",
                    ])
                  : setSelectedReEvaluateItems((prev) =>
                      prev.filter((item) => item !== "Combination")
                    );
              }}
              style={{
                width: "20px",
                height: "20px",
                flexhrink: "0",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              checked={selectedReEvaluateItems.includes("Combination")}
              className={
                selectedReEvaluateItems.includes("Combination")
                  ? TableStyle.customChecked2
                  : ""
              }
            />
          </div>
          <div className="col-xl-10 mt-4">Lab & Radiology</div>
          <div className="col-xl-2 p-0 d-flex mt-4">
            <input
              type="checkbox"
              onChange={(val) => {
                val?.target.checked
                  ? setSelectedReEvaluateItems((prev) => [
                      ...prev,
                      "Lab & Radiology",
                    ])
                  : setSelectedReEvaluateItems((prev) =>
                      prev.filter((item) => item !== "Lab & Radiology")
                    );
              }}
              style={{
                width: "20px",
                height: "20px",
                flexhrink: "0",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              checked={selectedReEvaluateItems.includes("Lab & Radiology")}
              className={
                selectedReEvaluateItems.includes("Lab & Radiology")
                  ? TableStyle.customChecked2
                  : ""
              }
            />
          </div>
          <div className="text-center mt-2">
            <span>
              <button className="btns-primary btn-app-primary px-3">
                Submit
              </button>
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    patientDosResult: state?.patientDetails?.details?.dosResult,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
    getSelectedDos: detailsActions.getSelectedDos,
    getSelectedDosPageNumber: detailsActions.getSelectedDosPageNumber,
    getCurrentDiseaseType: detailsActions.getCurrentDiseaseType,
    getLabPDFFile: detailsActions.labPDFDetails,
    getPatientHccFile: detailsActions.patientHccFileAction,
    storeFileDetails: detailsActions.storeFileIdAction,
  }
);
export default enhancer(Hcc);
