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

const { Option } = Select;

const NonHcc = ({
  getpatientDetailsData,
  setIsLoading,
  patientDosResult,
  patientDetailsResult,
  getSelectedDos,
  isDosSelected,
  selectDosValue, setSelectDosValue
}) => {
  // const [selectDosValue, setSelectDosValue] = useState("");
  const [dosSummariesList, setDosSummariesList] = useState([]);
  const selectTab = async (number) => {};

  const handleOptions = (value) => {
    setIsLoading(true);
    setSelectDosValue(value);
    // const filteredDos = pageNumberOptions?.filter(
    //   (data) => data?.dos === value
    // );
    // getSelectedDosPageNumber(filteredDos?.length>0?filteredDos[0]?.startPageNumber:null);
    if (value) {
      getSelectedDos(value);
    } else {
      getSelectedDos("");
    }
    const patientId = localStorage.getItem("patientId");
    const role = localStorage.getItem("role");

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
      setSelectDosValue(isDosSelected)
    }
  }, [isDosSelected])

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
                  {localStorage.getItem("role") != "admin" &&
                    selectDosValue && (
                      <YearAndDosStatus setIsLoading={setIsLoading} />
                    )}
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane id="my-posts" eventKey="validDiseases">
                  <VisitData />
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="file">
                  <File />
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
  }
);

export default enhancer(NonHcc);
