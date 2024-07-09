import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { connect } from "react-redux";
import visitStyles from "../../../../styles/visitdata.module.css";
import VisitData from "./visitData";
import File from "./file";
import Combo from "./combo";
import Meat from "./meat";
import SpinnerDots from "../../../../components/spinner";
import { actions as detailsActions } from "../../../../stores/patient/details";
import { getStatusIcon } from "../../../reuseableFunctions";
import moment from "moment";
import { Popover, Select } from "antd";
import styles from "../hcc/styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faClose } from "@fortawesome/free-solid-svg-icons";
import { SwapOutlined } from "@ant-design/icons";

const { Option } = Select;

const Radiology = ({
  getRadiologyDetails,
  getRadiologyFileDetails,
  radiologyDetailsResult,
  processedYearResult,
  patientDosResult
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabHead, setActiveTabHead] = useState(1);
  const [activeMeatTitle, setActiveMeatTitle] = useState(null);
  const [dosSummariesList, setDosSummariesList] = useState([]);
  const [selectDosValue, setSelectDosValue] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [dosYear, setDosYear] = useState([]);
  const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState("");
  const [selectedDosValue, setSelectedDosValue] = useState("");
console.log(patientDosResult?.data?.response, "testing");
  const selectTab = (num) => {
    setActiveTabHead(num);
    if (num == 4) {
      setActiveMeatTitle(null);
    }
  };

  const handleOptions = (value) => {
    setIsLoading(true);
    setSelectDosValue(value);
    const patientId = localStorage.getItem("patientId");
    const role = localStorage.getItem("role");
    if (value) {
      getRadiologyDetails(
        patientId,
        null,
        moment(value).format("YYYY-MM-DD"),
        ""
      );
    } else {
      getRadiologyDetails(
        patientId,
        radiologyDetailsResult?.data?.response?.processedYear,
        null,
        ""
      );
    }
  };

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    // getRadiologyDetails(patientId)
  }, []);

  const getAllProcessYearSelect = async (result) => {
    var dosYearArr = [];
    result?.data?.response?.map((res) => {
      dosYearArr.push({ value: res, label: res });
    });
    // setDosYearDefalutSelect(dosYearArr[0]);
    setSelectedDosValue(dosYearArr[0].value);
    setDosYear(dosYearArr);
  };

  useEffect(() => {
    getAllProcessYearSelect(processedYearResult);
  }, [processedYearResult]);

  useEffect(() => {
    if (radiologyDetailsResult?.data?.response) {
      if (radiologyDetailsResult?.data?.response?.radiologyFileDetail) {
        getRadiologyFileDetails(
          radiologyDetailsResult?.data?.response?.radiologyFileDetail[0]
            .azureBlobPath
        );
        setIsLoading(true);
      }
    }
  }, [radiologyDetailsResult?.data?.response]);

  useEffect(() => {
    setTimeout(() => {
      setActiveMeatTitle(null);
    }, 10000);
  }, [activeMeatTitle]);

  // const exmpleData = [
  //   {
  //     dos: "2023-10-25",
  //     startPageNumber: 1,
  //     endPagNumber: 3,
  //     dosWiseFlag: null,
  //     suspectTypes: null,
  //     processStage: null,
  //     radiologyTestName: "CT-Scan",
  //   },
  //   {
  //     dos: "2023-04-06",
  //     startPageNumber: 4,
  //     endPagNumber: 10,
  //     dosWiseFlag: null,
  //     suspectTypes: null,
  //     processStage: null,
  //     radiologyTestName: "Ultra sound",
  //   },
  //   {
  //     dos: "2023-01-17",
  //     startPageNumber: 11,
  //     endPagNumber: 14,
  //     dosWiseFlag: null,
  //     suspectTypes: null,
  //     processStage: null,
  //     radiologyTestName: "ECHO",
  //   },
  //   {
  //     dos: "2023-01-20",
  //     startPageNumber: 15,
  //     endPagNumber: 18,
  //     dosWiseFlag: null,
  //     suspectTypes: null,
  //     processStage: null,
  //     radiologyTestName: "MRI",
  //   },
  // ];

  useEffect(() => {
    // if (patientDosResult?.data?.response) {
    setSelectDosValue();
    var dosList = [];

    // patientDosResult?.data?.response?.map((res, index) => {
      patientDosResult?.data?.response?.map((res, index) => {
      if (res) {
        var dosLable = (
          <>
            <div className="d-flex justify-content-between">
              <span className={styles.dosLable}>
                {moment(res.dos).format("MM-DD-YYYY")} - {res.radiologyTestName}
              </span>
              {getStatusIcon(res.processStage)}
            </div>
          </>
        );
        dosList.push({ value: res.dos, label: dosLable });
      }
    });
    setDosSummariesList(dosList);
    // if (patientDetailsResult?.data?.response?.dateOfService) {
    //   setSelectDosValue(patientDetailsResult?.data?.response?.dateOfService);
    // }
    // }
  }, []);

  const handleChangePageNumber = async (value) => {
    setPopoverVisible(false);
    // setSearch({
    //   value: "",
    //   page: value,
    // });
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
        {patientDosResult?.data?.response
          ? patientDosResult?.data?.response?.map((data) => (
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

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1">
            <Tab.Container activeKey={activeTabHead}>
              <div className="row">
                <div className="col-xl-12">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={1}
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(1)}
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
                        onClick={() => selectTab(2)}
                      >
                        Visit Data
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={3}
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(3)}
                      >
                        Combination Codes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={4}
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(4)}
                      >
                        MEAT Criteria
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Select
                        placeholder="Select Year"
                        onChange={handleOptions}
                        className="dosSelect"
                        allowClear
                        // value={selectDosValue}
                        style={{ marginRight: "10px" }}
                      >
                        {dosYear?.map((data) => (
                          <Option key={data?.value} value={data?.value}>
                            {data.label}
                          </Option>
                        ))}
                      </Select>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Select
                        placeholder="Select DOS"
                        onChange={handleOptions}
                        // className="dosSelect"
                        allowClear
                        // value={selectDosValue}
                        style={{width: "220px"}}
                      >
                        {dosSummariesList?.map((data) => (
                          <Option key={data?.value} value={data?.value}>
                            {data.label}
                          </Option>
                        ))}
                      </Select>
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
                          style={{ marginLeft: "10px" }}
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
                  </Nav>
                </div>
              </div>
              {!isLoading ? (
                <SpinnerDots />
              ) : (
                <Tab.Content>
                  <Tab.Pane id="my-posts" eventKey={1}>
                    <File
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                    />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={2}>
                    <VisitData
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                    />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={3}>
                    <Combo />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={4}>
                    <Meat />
                  </Tab.Pane>
                </Tab.Content>
              )}
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    radiologyDetailsResult: state?.patientDetails?.details?.radiologyResult,
    patientDosResult: state?.patientDetails?.details?.radiologyDosResult,
    processedYearResult: state?.patientDetails.details?.processedYear,
  }),
  {
    getRadiologyDetails: detailsActions.radiologyDetailsAction,
    getRadiologyFileDetails: detailsActions.radiologyFileAction,
  }
);
export default enhancer(Radiology);
