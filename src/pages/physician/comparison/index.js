import React, { useState, useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  faCircleUser,
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import leftArrow from "../../../images/physician/leftArrow.svg";
import { CalendarOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import visitStyles from "../../../styles/visitdata.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { SVGICON } from "../../../jsx/constant/theme";
import {
  getColors,
  getComparisionData,
} from "../../../services/physicianService/comparisionService";
import SpinnerDots from "../../../components/spinner/index";
import ClientResult from "./ClientResult";
import CogentAIResult from "./CogentAIResult";
import RafSummary from "./RafSummary";
import ModalContent from "./ModalContent";
import { COLORS3 } from "../../reviewer/patients/details/hcc";
import { getPatients } from "../../../store/actions/physicianAction/patientsActions";

const Hcc = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const comparisonData = useSelector((state) => state.physicianComparison.data);
  const colorsData = useSelector((state) => state.physicianComparison.colors);
  const [validHccList, setvalidHccList] = useState([]);
  const [validClienHccList, setvalidClienHccList] = useState([]);
  const [clientSuggestedHccList, setClientSuggestedHccList] = useState([]);
  const [cogentSuggestedHccList, setCogentSuggestedHccList] = useState([]);
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState();

  function removeDuplicates(array) {
    let output = [];
    if (array) {
      for (let item of array) {
        if (!output.includes(item)) output.push(item);
      }
    }
    return output;
  }

  const getCaptureSectionBackground = (value, diagnosisCode) => {
    let dublicateCaptureDelete = removeDuplicates(value);

    return dublicateCaptureDelete.map((res) => {
      const result =
        colorsData?.data?.response?.length > 0 &&
        colorsData?.data?.response?.filter((res2) => res2?.sectionName == res);

      let backColor = result[0]?.backgroundColor;
      let textColor = result[0]?.sectionColor;

      let sectionMapArr = (
        <span
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getProviderNameList = (res) => {
    let value = res?.providerName ? (
      <div>
        <Badge
          className={
            res?.authorizedProvider === true
              ? `mt-2 text-start ${styles.provider_name}`
              : `mt-2 text-start ${visitStyles.un_provider_name}`
          }
        >
          <i>
            {" "}
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{
                size: 10,
                marginRight: "5px",
                color:
                  res?.authorizedProvider === true ? "#008000bf" : "#ff0000cc",
              }}
            />
          </i>
          {res?.providerName}
        </Badge>
      </div>
    ) : null;

    return value;
  };

  const getEncounterDateBackgroundHcc = (value, code) => {
    const encounterDateMatching = [];
    return value?.split(",")?.map((res, index) => {
      encounterDateMatching?.push({
        name: res,
        colors: COLORS3[index],
      });

      const result = encounterDateMatching.filter((res2) => res2.name == res);
      let backColor = result[0]?.colors;
      let sectionMapArr = (
        <span
          className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
        >
          <i style={{ marginRight: "5px" }}>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res, "MM/DD/YYYY").format("MMM DD")}
        </span>
      );
      return sectionMapArr;
    });
  };
  const closeModal = () => {
    setFileUploadModal(false);
    setValidated(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);
  };
  const backToPatientData = () => {
    dispatch(getPatients(null));
    router.back();
  };
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedParams = urlParams.get("id");
   
    setSelectedPatient(JSON.parse(atob(encodedParams))?.id);
    if (selectedPatient) {
      dispatch(
        getComparisionData(
          "ID-001",
          selectedPatient
        )
      );
    }
    dispatch(getColors());
  }, [selectedPatient]);

  const clientYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.clientResult?.validDisease)
    : "";
  const cogentYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.cogentAIResult?.validDisease)
    : "";

  const clientSuggestedYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.clientResult?.suggestLab)
    : "";
  const cogentSuggestedYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.cogentAIResult?.suggestLab)
    : "";

  const clientUnmatchedYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.clientResult?.unmatchedDisease)
    : "";
  const cogentUnmatchedYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.cogentAIResult?.unmatchedDisease)
    : "";
  const clientLabYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.clientResult?.suggestRadiology)
    : "";
  const cogentLabYear = comparisonData?.data
    ? Object.keys(comparisonData?.data?.cogentAIResult?.suggestRadiology)
    : "";
  useEffect(() => {
    const clientResult = comparisonData?.data?.clientResult;
    const cogentAIResult = comparisonData?.data?.cogentAIResult;

    if (clientResult && cogentAIResult) {
      const validClienthcc = clientResult?.validDisease[clientYear];
      const validClientSuggestedHcc =
        cogentAIResult?.suggestLab[cogentSuggestedYear];
      const validClientUnmatchededHcc =
        cogentAIResult?.unmatchedDisease[cogentUnmatchedYear];
      const validClientLabHcc = cogentAIResult?.suggestRadiology[cogentLabYear];

      const validCogentHcc = cogentAIResult?.validDisease[cogentYear];
      const validSuggestedhcc = clientResult.suggestLab[clientSuggestedYear];
      const validUnmatchededhcc =
        clientResult?.unmatchedDisease[clientUnmatchedYear];

      const validLabhcc = clientResult?.suggestRadiology[clientLabYear];

      if (validClienthcc?.length > 0 && validCogentHcc?.length > 0) {
        setvalidHccList(validClienthcc);
        setvalidClienHccList(validCogentHcc);
        setClientSuggestedHccList([
          ...validSuggestedhcc?.map((item) => ({
            ...item,
            getPlace: "Lab",
          })),
          ...validUnmatchededhcc.map((item) => ({
            ...item,
            getPlace: "Hcc",
          })),
          ...validLabhcc.map((item) => ({
            ...item,
            getPlace: "Radio",
          })),
        ]);
        setCogentSuggestedHccList([
          ...validClientSuggestedHcc?.map((item) => ({
            ...item,
            getPlace: "Lab",
          })),
          ...validClientUnmatchededHcc?.map((item) => ({
            ...item,
            getPlace: "Hcc",
          })),

          ...validClientLabHcc?.map((item) => ({
            ...item,
            getPlace: "Radio",
          })),
        ]);
      }
    }
  }, [comparisonData]);

  return (
    <div className={`show`}>
      <Header />
      <div className={visitStyles.headerFixed}>
        <div class="content-body">
          <div className={`container-fluid ${styles.container_fluid}`}>
            <div className={styles.mainContainer}>
              <div className="row">
                <div className="col-xl-12 col-sm-12">
                  <div className={`${visitStyles.patient_info_details}`}>
                    <div
                      className="card-body"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="row" style={{ width: "90%" }}>
                        <Button
                          onClick={backToPatientData}
                          className={`${visitStyles.backArrowBtn}`}
                          style={{
                            marginTop: "0px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{
                              color: "rgb(38 50 107)",
                            }}
                          />
                        </Button>
                        <div className="col-xl-2 col-sm-12">
                          <FontAwesomeIcon icon={faIdCardClip} />
                          <label>Patient Id</label>
                          <h6 className="ageDtails">
                            {comparisonData?.data?.clientResult?._id}
                          </h6>
                        </div>
                        <div className="col-xl-2 col-sm-12">
                          <FontAwesomeIcon icon={faUserCircle} />

                          <label>Name</label>
                          <h6 className="ageDtails">
                            {comparisonData?.data?.clientResult?.patientName}
                          </h6>
                        </div>
                        <div className="col-xl-2 col-sm-12">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <label>Age</label>
                          <h6 className="ageDtails">
                            {comparisonData?.data?.clientResult?.age}
                          </h6>
                        </div>
                        <div className="col-xl-2 col-sm-12">
                          <FontAwesomeIcon icon={faVenusMars} />
                          <label>Gender</label>
                          <h6 className="ageDtails">
                            {comparisonData?.data?.clientResult?.gender}
                          </h6>
                        </div>
                        <div className="col-xl-2 col-sm-12">
                          <i className={visitStyles.dob_icon}>
                            {SVGICON.DatebirthIcon}
                          </i>
                          <label>DOB</label>
                          <h6 className="ageDtails">
                            {comparisonData?.data?.clientResult?.dob}
                          </h6>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        <button
                          onClick={() => {
                            setFileUploadModal(true);
                            dispatch(getPatients());
                          }}
                          className={`${styles.addFileBtn}`}
                        >
                          <Image
                            src={leftArrow}
                            alt="noimg"
                            width={25}
                            height={23}
                            style={{ marginTop: "-2px" }}
                          />
                          Patients List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="row">
                    {comparisonData?.loading ? (
                      <SpinnerDots />
                    ) : (
                      <>
                        {" "}
                        <div className="col-xl-6">
                          <div className={styles.headerTitle}>
                            <div className="d-flex">
                              <h6 className={styles.headerName2}>
                                Client Results
                              </h6>
                            </div>
                          </div>
                          <div className={`my-post-content ${styles.mainCard}`}>
                            <div className="widget-media   ps--active-y">
                              <ClientResult
                                validHccList={validHccList}
                                getProviderNameList={getProviderNameList}
                                getEncounterDateBackgroundHcc={
                                  getEncounterDateBackgroundHcc
                                }
                                getCaptureSectionBackground={
                                  getCaptureSectionBackground
                                }
                                clientSuggestedHccList={clientSuggestedHccList}
                                comparisonData={comparisonData}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className={styles.headerTitle}>
                            <h6 className={styles.headerName}>
                              Cogent AI Results
                            </h6>
                          </div>
                          <div className={`my-post-content ${styles.mainCard}`}>
                            <div className="widget-media   ps--active-y">
                              <CogentAIResult
                                validClienHccList={validClienHccList}
                                getProviderNameList={getProviderNameList}
                                getEncounterDateBackgroundHcc={
                                  getEncounterDateBackgroundHcc
                                }
                                getCaptureSectionBackground={
                                  getCaptureSectionBackground
                                }
                                cogentSuggestedHccList={cogentSuggestedHccList}
                                comparisonData={comparisonData}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-xl-6">
                  <RafSummary comparisonData={comparisonData} />
                </div>
              </div>
            </div>
          </div>
          <ModalContent
            closeModal={closeModal}
            fileUploadModal={fileUploadModal}
            handleSubmit={handleSubmit}
            validated={validated}
            setFileUploadModal={setFileUploadModal}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
          />
        </div>
      </div>
    </div>
  );
};

export default Hcc;
