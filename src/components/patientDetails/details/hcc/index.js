import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useDispatch, useSelector, connect } from "react-redux";
import visitStyles from "../../../../styles/visitdata.module.css";
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
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faClose } from "@fortawesome/free-solid-svg-icons";
import styles from "../hcc/styles.module.css";
import moment from "moment";
import { actions as detailsActions } from "../../../../stores/patient/details";
import warning from "../../../../images/svg/warning.svg";
import Image from "next/image";
import YearAndDosStatus from "../components/yearAndDosStatus";
import { getStatusIcon, selectTab } from "../../../reuseableFunctions";
import { getStorage } from "../../../../utils/storages";
import { SwapOutlined } from "@ant-design/icons";
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
}) => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (patientDosResult?.data?.response) {
      // setSelectDosValue("");
      var dosList = [];
      patientDosResult?.data?.response?.map((res, index) => {
        if (res) {
          var dosLable = (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <span>
                    {res?.stateIndicators?.includes("CHART") && (
                      <span
                        className="p-1 rounded-2 mx-1"
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
          const role = getStorage("role");
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
    setIsLoading(true);
    setSelectDosValue(value);
    const filteredDos = pageNumberOptions?.filter(
      (data) => data?.dos === value
    );
    const filteredDos1 = dosSummariesList?.find(
      (data) => data?.value === value
    );
    setSelectedFile(filteredDos1?.details?.fileId || "");
    if (filteredDos1?.details?.stateIndicators?.includes("LAB")) {
      getLabPDFFile({ fileId: filteredDos1.details?.fileId });
    } else if (filteredDos1?.details?.stateIndicators?.includes("RADIOLOGY")) {
      getLabPDFFile({ fileId: filteredDos1.details?.fileId });
    } else {
      if (!filteredDos1?.details?.fileId) {
        getLabPDFFile({
          fileId:
            patientDetailsResult?.data?.response?.fileDetailDTO?.azureBlobPath,
        });
        getPatientHccFile(
          patientDetailsResult?.data?.response?.fileDetailDTO?.azureBlobPath
        );
      } else {
        getLabPDFFile({ fileId: filteredDos1?.details?.fileId });
      }

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
    const role = getStorage("role");

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
  };
  const handleChangePageNumber = async (value) => {
    // setPopoverVisible(false);
    setSearch({
      value: "",
      page: value,
    });
  };

  const PopContent = (
    <div className={styles.innerPop}>
      <div
        style={{
          marginBottom: "25px",
          position: "relative",
          bottom: "24px",
          right: "26px",
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
  useEffect(() => {
    getSelectedDos("");
  }, []);
  return (
    <div className={visitStyles.visitdata_tab_body}>
      <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
        <div className="custom-tab-1 ">
          <Tab.Container activeKey={activeTabHead}>
            <div className="row">
              <div className="col-xl-12">
                <Nav as="ul" className="nav nav-tabs">
                  <Nav.Item as="li" className="nav-item">
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
                      className={visitStyles.navColor}
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
                      className={visitStyles.navColor}
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
                      className={visitStyles.navColor}
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
                      className={visitStyles.navColor}
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
                      className={visitStyles.navColor}
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
                    <Select
                      placeholder="Select DOS"
                      onChange={handleOptions}
                      className="dosSelect"
                      allowClear
                      value={selectDosValue ? selectDosValue : null}
                    >
                      {dosSummariesList?.map((data) => (
                        <Option key={data?.value} value={data?.value}>
                          {data.label}
                        </Option>
                      ))}
                    </Select>
                  </Nav.Item>
                  <Nav.Item as="li" className="nav-item mx-2">
                    {getStorage("role") != "admin" &&
                      selectDosValue && (
                        <YearAndDosStatus setIsLoading={setIsLoading} />
                      )}
                  </Nav.Item>
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
                        className={styles.dosContainer}
                        onClick={() => {
                          setPopoverVisible(true);
                        }}
                      >
                        <span className={styles.dosPageNumber}>
                          Select Dos Page Number
                        </span>
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          style={{
                            size: 10,
                            color: "#e6e6e6",
                            marginLeft: "5px",
                          }}
                        />
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
                                  <span className={visitStyles.hccFlag}></span>
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
                              </div>
                            </>
                          }
                          trigger={["click"]}
                          placement="bottom"
                        >
                          <Image src={warning} style={{ cursor: "pointer" }} />
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
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={2}>
                <VisitData
                  setActiveTabHead={setActiveTabHead}
                  setActiveMeatTitle={setActiveMeatTitle}
                  setActiveComboTree={setActiveComboTree}
                  year={year}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={3}>
                <Combo
                  setActiveTabHead={setActiveTabHead}
                  setActiveMeatTitle={setActiveMeatTitle}
                  activeComboTree={activeComboTree}
                  year={year}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={4}>
                <Meat activeMeatTitle={activeMeatTitle} year={year} />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={5}>
                <RafScore />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={6}>
                <MeatQuery year={year} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
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
  }
);
export default enhancer(Hcc);
