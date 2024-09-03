import React, { useEffect, useState } from "react";
import { Tab, Nav ,Button} from "react-bootstrap";
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
import { SwapOutlined, PlusCircleFilled } from "@ant-design/icons";
import AddRadiologyForm from "../components/addRadiologyForm";
import AddLabForm from "../components/addLabForm";

const { Option } = Select;

const Radiology = ({
  getRadiologyDetails,
  getRadiologyFileDetails,
  radiologyDetailsResult,
  processedYearResult,
  patientDosResult,
  getPatientRadiologyDosList,
  year,
  setDosYearDefalutSelect
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabHead, setActiveTabHead] = useState(1);
  const [activeMeatTitle, setActiveMeatTitle] = useState(null);
  const [dosSummariesList, setDosSummariesList] = useState([]);
  const [selectDosValue, setSelectDosValue] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [dosYear, setDosYear] = useState([]);
  const [selectedYearValue, setSelectedYearValue] = useState();
  const [search, setSearch] = useState();
  const [radiologyForm, setRadiologyForm] = useState(false);


  const selectTab = (num) => {
    setActiveTabHead(num);
    if (num == 4) {
      setActiveMeatTitle(null);
    }
  };

  const getDosList = async(year) => {
    const patientId = localStorage.getItem("patientId")
    try {
      const res = await getPatientRadiologyDosList(patientId, year)
    } catch (error) {
      
    }
  }

  const handleYearOptions = (value) => {
    setSelectedYearValue(value);
    getDosList(value)
    setDosYearDefalutSelect(value)
  };



  const handleOptions = (value) => {
    var selectData = patientDosResult?.data?.response.filter(
      (i) => i.dateOfService === value
    );
    setIsLoading(true);
    setSelectDosValue(value);
    const patientId = localStorage.getItem("patientId");
    const role = localStorage.getItem("role");
    if (value) {
      getRadiologyDetails(
        patientId,
        selectedYearValue,
        moment(value).format("YYYY-MM-DD"),
        "",
        selectData[0]?.testName
      );
      getRadiologyFileDetails(selectData[0]?.fileDetailDTO?.azureBlobPath);
    } else {
      setSelectDosValue(dosSummariesList[0]?.value);
      getRadiologyDetails(
        patientId,
        selectedYearValue,
        moment(dosSummariesList[0]?.value).format("YYYY-MM-DD"),
        ""
      );
    }
  };

  useEffect(() => {
    if (patientDosResult?.data?.response) {
      getRadiologyFileDetails(
        patientDosResult?.data?.response[0]?.fileDetailDTO?.azureBlobPath
      );
      setIsLoading(true);
    }
  }, [patientDosResult?.data?.response]);

  const getAllProcessYearSelect = async (result) => {
    var dosYearArr = [];
    result?.data?.response?.map((res) => {
      dosYearArr.push({ value: res, label: res });
    });
    setSelectedYearValue(year);
    // setDosYearDefalutSelect(dosYearArr[0])
    getDosList(year);
    setDosYear(dosYearArr);
  };

  useEffect(() => {
    getAllProcessYearSelect(processedYearResult);
  }, [processedYearResult]);

  useEffect(() => {
    if (radiologyDetailsResult?.data?.response) {
      if (radiologyDetailsResult?.data?.response?.fileDetailDTO) {
        getRadiologyFileDetails(
          radiologyDetailsResult?.data?.response?.fileDetailDTO
            ?.radiologyAzureBlobPaths[0]
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

  useEffect(() => {
    if (patientDosResult?.data?.response) {
      setSelectDosValue();
      var dosList = [];
      patientDosResult?.data?.response?.map((res, index) => {
        if (res) {
          var dosLable = (
            <>
              <div className="d-flex justify-content-between">
                <span className={styles.dosLable}>
                  {moment(res.dateOfService).format("MM-DD-YYYY")}
                </span>
                {getStatusIcon(res.processStage)}
              </div>
            </>
          );
          dosList.push({ value: res.dateOfService, label: dosLable });
        }
      });
      setDosSummariesList(dosList);
      if (dosList?.length != 0) {
        setSelectDosValue(dosList[0]?.value);
        const patientId = localStorage.getItem("patientId");
        getRadiologyDetails(
          patientId,
          selectedYearValue,
          moment(patientDosResult?.data?.response[0].dateOfService).format(
            "YYYY-MM-DD"
          ),
          "",
          patientDosResult?.data?.response[0]?.testName
        );
      }
    }
  }, [patientDosResult?.data?.response]);

  const handleChangePageNumber = async (value) => {
    setPopoverVisible(false);
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
        {patientDosResult?.data?.response[0]?.fileDetailDTO?.dosSummaries
          ? patientDosResult?.data?.response[0]?.fileDetailDTO?.dosSummaries?.map((data) => (
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
                  <Nav as="ul"  className={`nav nav-tabs ${styles.tabsContainer}`}>
                  <div className={styles.tabslistConatiner}>
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
                    {/* <Nav.Item as="li" className="nav-item">
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
                    </Nav.Item> */}
                    <Nav.Item as="li" className="nav-item">
                      <Select
                        placeholder="Select Year"
                        className="dosSelect"
                        value={selectedYearValue}
                        onChange={handleYearOptions}
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
                        value={selectDosValue}
                        style={{ width: "220px" }}
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
                    </div>
                     <div>
                      <Button
                        onClick={() => {
                          setRadiologyForm(true);
                        }}
                        style={{
                          background: "#04306f",
                          height: "31px !",
                        }}
                        className={`btn btn-sm ms-2 flr width-max-conten ${styles.labUploadBtn}`}
                      >
                        <PlusCircleFilled /> UPLOAD
                      </Button>
                    </div>
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
                      search={search}
                      setSearch={setSearch}
                    />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={2}>
                    <VisitData
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                    />
                  </Tab.Pane>
                  {/* <Tab.Pane id="my-posts" eventKey={3}>
                    <Combo />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={4}>
                    <Meat />
                  </Tab.Pane> */}
                </Tab.Content>
              )}
            </Tab.Container>
          </div>
        </div>
      </div>
      <AddLabForm setOpen={setRadiologyForm} open={radiologyForm} title="RADIOLOGY" />

    </>
  );
};

const enhancer = connect(
  (state) => ({
    radiologyDetailsResult: state?.patientDetails?.details?.radiologyResult,
    processedYearResult: state?.patientDetails.details?.processedYear,
    patientDosResult: state?.patientDetails?.details?.radiologyDosResult,
  }),
  {
    getRadiologyDetails: detailsActions.radiologyDetailsAction,
    getRadiologyFileDetails: detailsActions.radiologyFileAction,
    getPatientRadiologyDosList: detailsActions.radiologyDosDeatilsAction,
  }
);
export default enhancer(Radiology);
