import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import visitStyles from "../../../../styles/visitdata.module.css";
import File from "./file";
import VisitData from "./visitData";
import styles from "../hcc/styles.module.css";
import { Select } from "antd";
import moment from "moment";
import { actions as detailsActions } from "../../../../stores/patient/details";
import { connect } from "react-redux";
import { getStatusIcon } from "../../../reuseableFunctions";
import YearAndDosStatus from "../components/yearAndDosStatus";
import { getStorage } from "../../../../utils/storages";
import DosSelect from "../components/dosSelect";

const { Option } = Select;

const NonHcc = ({
  getpatientDetailsData,
  setIsLoading,
  patientDosResult,
  patientDetailsResult,
  getSelectedDos,
  isDosSelected,
  selectDosValue,
  setSelectDosValue,
  patientDetailsLoad,
  search,
  setSearch,
  setFlagContainerActive,
  selectedDate,
  setSelectedDate,
  storeFileDetails,
  getSelectedDosPageNumber,
}) => {
  // const [selectDosValue, setSelectDosValue] = useState("");
  const [dosSummariesList, setDosSummariesList] = useState([]);
  const [pageNumberOptions, setPageNumberOptions] = useState([]);

  const selectTab = async (number) => {};
  const handleOptions = async (value) => {
    setIsLoading(true);
    setSelectDosValue(value);
    patientDetailsLoad(true);
    const filteredDos = pageNumberOptions?.filter(
      (data) => data?.dos === value
    );
    const filteredDos1 = dosSummariesList?.find(
      (data) => data?.value === value
    );
    storeFileDetails(filteredDos1?.details?.fileId || null);
    if (filteredDos1?.details?.stateIndicators?.includes("LAB")) {
    } else if (filteredDos1?.details?.stateIndicators?.includes("RADIOLOGY")) {
    } else {
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
      await getpatientDetailsData(
        patientId,
        null,
        moment(value).format("YYYY-MM-DD"),
        "",
        role
      );
      setTimeout(() => {
        patientDetailsLoad(false);
      }, 500);
    } else {
      await getpatientDetailsData(
        patientId,
        patientDetailsResult?.data?.response?.processedYear,
        null,
        "",
        role
      );
      setTimeout(() => {
        patientDetailsLoad(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (patientDosResult?.data?.response) {
      setSelectDosValue();
      var dosList = [];
      patientDosResult?.data?.response?.map((res, index) => {
        if (res) {
          var dosLable = (
            <>
              <div className="d-flex align-items-center justify-content-between">
                <span className={styles.dosLable}>
                  {moment(res.dateOfService).format("MM-DD-YYYY")}
                </span>
                {getStatusIcon(res.processedStatus)}
              </div>
            </>
          );
          dosList.push({ value: res.dateOfService, label: dosLable });
        }
      });
      setDosSummariesList(dosList);
      if (patientDetailsResult?.data?.response?.dateOfService) {
        setSelectDosValue(patientDetailsResult?.data?.response?.dateOfService);
      }
    }
  }, [patientDosResult?.data?.response]);

  useEffect(() => {
    if (isDosSelected) {
      setSelectDosValue(isDosSelected);
      getSelectedDos(isDosSelected);
    }
  }, [isDosSelected]);
  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1">
            <Tab.Container defaultActiveKey="file">
              <Nav as="ul" className="nav nav-tabs">
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link
                    to="#my-posts"
                    className={visitStyles.navColor}
                    activeClassName={visitStyles.activeLink}
                    eventKey="file"
                    onClick={() => selectTab(1)}
                  >
                    File
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" className="nav-item">
                  <Nav.Link
                    to="#my-posts"
                    eventKey="validDiseases"
                    className={visitStyles.navColor}
                    activeClassName={visitStyles.activeLink}
                    onClick={() => selectTab(2)}
                  >
                    Visit Data
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li" className="nav-item">
                  <DosSelect
                    options={patientDosResult?.data?.response}
                    handleOptions={handleOptions}
                    setSearch={setSearch}
                    setFlagContainerActive={setFlagContainerActive}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                  {/* <Select
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
                  </Select> */}
                </Nav.Item>
                <Nav.Item as="li" className="nav-item mx-2">
                  {getStorage("userRole") != "admin" && selectDosValue && (
                    <YearAndDosStatus
                      isDosStatus={true}
                      setIsLoading={setIsLoading}
                    />
                  )}
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane id="my-posts" eventKey="validDiseases">
                  <VisitData />
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="file">
                  <File
                    pageNumberOptions={pageNumberOptions}
                    setPageNumberOptions={setPageNumberOptions}
                    search={search}
                    setSearch={setSearch}
                    selectDosValue={selectDosValue}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
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
    patientDetailsLoad: detailsActions.patientDetailsLoad,
    storeFileDetails: detailsActions.storeFileIdAction,
    getSelectedDosPageNumber: detailsActions.getSelectedDosPageNumber,
  }
);

export default enhancer(NonHcc);
