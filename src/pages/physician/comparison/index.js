import React, { useState, useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import moment from "moment";
import { Progress, Modal, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  faCircleUser,
  faPlus,
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import visitStyles from "../../../styles/visitdata.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { SVGICON } from "../../../jsx/constant/theme";
import { getComparisionData } from "../../../services/physicianService/comparisionService";
import SpinnerDots from "../../../components/spinner/index";

const Hcc = () => {
  const dispatch = useDispatch();
  const comparisonData = useSelector((state) => state.physicianComparison.data);
  const [validHccList, setvalidHccList] = useState([]);
  const [validClienHccList, setvalidClienHccList] = useState([]);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [compareResults, setCompareResults] = useState({});

  const currentYear = new Date().getFullYear();
  const twoYearsAgo = currentYear - 2;
  const oneYearAgo = currentYear - 1;
  const clientYear =
    comparisonData?.data ?
    Object.keys(comparisonData?.data?.clientResult?.validDisease):"";
  const cogentYear =
    comparisonData?.data ?
    Object.keys(comparisonData?.data?.cogentAIResult?.validDisease):"";

  const validhcc =comparisonData?.data?.clientResult&& comparisonData?.data?.clientResult?.validDisease[clientYear];

  const validClientHcc =comparisonData?.data?.cogentAIResult &&
    comparisonData?.data?.cogentAIResult?.validDisease[cogentYear];

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
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
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

  const getProviderNameList = (data) => {
    let value = data?.map((res) =>
      res.providerName ? (
        <Badge
          className={
            res.authorizedProvider === true
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
                  res.authorizedProvider === true ? "#008000bf" : "#ff0000cc",
              }}
            />
          </i>
          {res.providerName}
        </Badge>
      ) : null
    );
    return value;
  };

  const getEncounterDateBackgroundHcc = (value, code) => {
    return value?.map((res) => {
      let sectionMapArr = (
        <span className={`mt-2 text-start cr-pointer ${styles.encounterDate}`}>
          <i style={{ marginRight: "5px" }}>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res).format("MMM DD")}
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

  const compareHccList = () => {
    let data = {
      cogentAiPercentage: 100,
      clientPercentage: 75,
      cogentAiScore: "2.337",
      clientScore: "1.286",
    };
    setCompareResults(data);
  };

  useEffect(()=>{
    dispatch(getComparisionData());
  },[])

  useEffect(() => {
if(validhcc && validClientHcc){
  const validDisArray = [];
  validhcc?.length>0 && validhcc?.map((res, index) => {
    const encounterDatearray = res?.encounterDate?.split(",");
    let providerList = [];
    providerList?.push({
      providerName: res?.providerName,
      authorizedProvider: true,
    });
    validDisArray?.push({
      actualDescription: res?.actualDescription,
      capturedSections: res?.capturedSections,
      diagnosisCode: res?.diagnosisCode,
      encounterDate: res?.encounterDate,
      encounterDateSplit: encounterDatearray,
      isManuallyAdded: res?.isManuallyAdded,
      isHccValid: res?.isHccValid,
      defaultPosition: res?.defaultPosition,
      providerName: providerList,
      dbDescription: res?.dbDescription,
    });
  });
  const validDisClientArray = [];
  validClientHcc?.length>0 && validClientHcc?.map((res, index) => {
    const encounterDatearray = res?.encounterDate?.split(",");
    let providerList = [];
    providerList?.push({
      providerName: res?.providerName,
      authorizedProvider: true,
    });
    validDisClientArray?.push({
      actualDescription: res?.actualDescription,
      capturedSections: res?.capturedSections,
      diagnosisCode: res?.diagnosisCode,
      encounterDate: res?.encounterDate,
      encounterDateSplit: encounterDatearray,
      isManuallyAdded: res?.isManuallyAdded,
      isHccValid: res?.isHccValid,
      defaultPosition: res?.defaultPosition,
      providerName: providerList,
      dbDescription: res?.dbDescription,
    });
  });
  setvalidHccList(validDisArray);
  setvalidClienHccList(validDisClientArray);
}
  }, []);
console.log(validhcc,validClientHcc)
  return (
    <div className={`show`}>
      <Header />
      <div className={visitStyles.headerFixed}>
        <div class="content-body">
          <div className={`container-fluid ${styles.container_fluid}`}>
            <div className={styles.mainContainer}>
              <div className="row">
                <div className="col-xl-8 col-sm-12">
                  <div className={`${visitStyles.patient_info_details}`}>
                    <div className="card-body">
                      <div className="row">
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
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="row">
                    {comparisonData?.loading?<SpinnerDots/>:
                   <> <div className="col-xl-6">
                   {/* <h6 className={styles.patientName}>
                     EH-2032 / Diana M Pallo
                   </h6> */}

                   <div className={styles.headerTitle}>
                     <div className="d-flex">
                       <h6 className={styles.headerName2}>Client Results</h6>
                       <button
                         onClick={() => setFileUploadModal(true)}
                         className={`${visitStyles.combo_add_btn} ${styles.addFileBtn}`}
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
                     <div>
                       <button
                         className={styles.compareBtn}
                         onClick={() => compareHccList()}
                       >
                         Compare
                       </button>
                     </div>
                   </div>
                   <div className={`my-post-content ${styles.mainCard}`}>
                     <div className="widget-media   ps--active-y">
                       <div className="row">
                         <div className="col-xl-12">
                           <ul className="timeline">
                             <div
                               className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                             >
                               <span
                                 className={`${visitStyles.hcc_title_name}`}
                               >
                                 HCC
                               </span>
                               <div className="d-flex justify-content-center">
                                 <span
                                   className={`${visitStyles.hcc_title_badge}`}
                                 >
                                   {validHccList?.length}
                                 </span>
                               </div>
                             </div>
                             <div className={visitStyles.container}>
                               <div className={visitStyles.hccStickey_head}>
                                 {validHccList?.length>0 && validClienHccList.map((data, _i) => (
                                   <li>
                                     <div
                                       className={`hccActiveCard ${visitStyles.hcc_card}`}
                                     >
                                       <div
                                         className={`${visitStyles.hcc_card_nameHead}`}
                                       >
                                         <div className="media-body">
                                           <span className="mb-1 disease-name d-flex">
                                             <span className="valid-dis-name">
                                               {data.diagnosisCode} -
                                             </span>
                                             <Popover
                                               content={
                                                 data.actualDescription
                                               }
                                               trigger="hover"
                                             >
                                               {data.actualDescription}
                                             </Popover>
                                           </span>
                                         </div>
                                       </div>
                                       <div
                                         className={`${visitStyles.hoverActiveHcc}`}
                                       >
                                         <div
                                           className={`${visitStyles.encounterAndSectionHeader}`}
                                         >
                                           {getProviderNameList(
                                             data?.providerName
                                           )}
                                           {getEncounterDateBackgroundHcc(
                                             data.encounterDateSplit,
                                             data.diagnosisCode
                                           )}
                                         </div>
                                         <div
                                           className={`${visitStyles.encounterAndSectionHeader}`}
                                         >
                                           {getCaptureSectionBackground(
                                             data.capturedSections,
                                             data.diagnosisCode
                                           )}
                                         </div>
                                       </div>
                                     </div>
                                   </li>
                                 ))}
                               </div>
                             </div>
                           </ul>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="col-xl-6">
                   {/* <h6 className={styles.patientName}>
                     EH_1234 / Mary E Stone
                   </h6> */}
                   <div className={styles.headerTitle}>
                     <h6 className={styles.headerName}>Cogent AI Results</h6>
                   </div>
                   <div className={`my-post-content ${styles.mainCard}`}>
                     <div className="widget-media   ps--active-y">
                       <div className="row">
                         <div className="col-xl-12">
                           <ul className="timeline">
                             <div
                               className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                             >
                               <span
                                 className={`${visitStyles.hcc_title_name}`}
                               >
                                 HCC
                               </span>
                               <div className="d-flex justify-content-center">
                                 <span
                                   className={`${visitStyles.hcc_title_badge}`}
                                 >
                                   {validHccList.length}
                                 </span>
                               </div>
                             </div>
                             <div className={styles.container}>
                               <div className={visitStyles.hccStickey_head}>
                                 {validHccList.map((data) => (
                                   <li>
                                     <div
                                       className={`hccActiveCard ${visitStyles.hcc_card}`}
                                     >
                                       <div
                                         className={`${visitStyles.hcc_card_nameHead}`}
                                       >
                                         <div className="media-body">
                                           <span className="mb-1 disease-name d-flex">
                                             <span className="valid-dis-name">
                                               {data.diagnosisCode} -
                                             </span>
                                             <Popover
                                               content={
                                                 data.actualDescription
                                               }
                                               trigger="hover"
                                             >
                                               {data.actualDescription}
                                             </Popover>
                                           </span>
                                         </div>
                                       </div>
                                       <div
                                         className={`${visitStyles.hoverActiveHcc}`}
                                       >
                                         <div
                                           className={`${visitStyles.encounterAndSectionHeader}`}
                                         >
                                           {getProviderNameList(
                                             data?.providerName
                                           )}
                                           {getEncounterDateBackgroundHcc(
                                             data.encounterDateSplit,
                                             data.diagnosisCode
                                           )}
                                         </div>
                                         <div
                                           className={`${visitStyles.encounterAndSectionHeader}`}
                                         >
                                           {getCaptureSectionBackground(
                                             data.capturedSections,
                                             data.diagnosisCode
                                           )}
                                         </div>
                                       </div>
                                     </div>
                                   </li>
                                 ))}
                               </div>
                             </div>
                           </ul>
                         </div>
                         <div className="col-xl-12">
                           <ul className="timeline">
                             <div
                               className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                             >
                               <span
                                 className={`${visitStyles.suggested_title_name}`}
                               >
                                 SUGGESTED CODES
                               </span>
                               <div className="d-flex justify-content-center">
                                 <span
                                   className={`${visitStyles.suggested_title_badge}`}
                                 >
                                   {suggestedHccList.length}
                                 </span>
                               </div>
                             </div>
                             <div className={visitStyles.suggestedcontainer}>
                               <div className={visitStyles.hccStickey_head}>
                                 {suggestedHccList.map((data) => (
                                   <li>
                                     <div
                                       className={`hccActiveCard ${visitStyles.hcc_card}`}
                                     >
                                       <div
                                         className={`${visitStyles.hcc_card_nameHead}`}
                                       >
                                         <div className="media-body">
                                           <span className="mb-1 disease-name d-flex">
                                             <span className="valid-dis-name">
                                               {data.diagnosisCode} -
                                             </span>
                                             <Popover
                                               content={
                                                 data.actualDescription
                                               }
                                               trigger="hover"
                                             >
                                               {data.actualDescription}
                                             </Popover>
                                           </span>
                                         </div>
                                       </div>
                                       <div
                                         className={`${visitStyles.hoverActiveHcc}`}
                                       >
                                         <div
                                           className={`${visitStyles.encounterAndSectionHeader}`}
                                         >
                                           {getProviderNameList(
                                             data?.providerName
                                           )}
                                           {getEncounterDateBackgroundHcc(
                                             data.encounterDateSplit,
                                             data.diagnosisCode
                                           )}
                                         </div>
                                         <div
                                           className={`${visitStyles.encounterAndSectionHeader}`}
                                         >
                                           {getCaptureSectionBackground(
                                             data.capturedSections,
                                             data.diagnosisCode
                                           )}
                                         </div>
                                       </div>
                                     </div>
                                   </li>
                                 ))}
                               </div>
                             </div>
                           </ul>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div></>}
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className={styles.headerTitle2}>
                    <h6 className={styles.headerName}>Summary</h6>
                  </div>
                  <div
                    className={`my-post-content mainCard ${styles.mainCard}`}
                  >
                    <div className={styles.accuracyConatiner}>
                      <div>
                        <h5>Raf Score</h5>
                        <div>
                          <div className="row">
                            <div className="col-xl-6">
                              <div className={styles.rafCard}>
                                <div className={styles.rafTitle}>
                                  <span className={styles.previousYearText}>
                                    {twoYearsAgo} RAF
                                  </span>
                                  <h1 className={styles.rafPercentage}>
                                    {compareResults?.cogentAiScore}
                                  </h1>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6">
                              <div className={styles.rafCard}>
                                <div className={styles.rafTitle}>
                                  <span className={styles.previousYearText}>
                                    {oneYearAgo} RAF
                                  </span>
                                  <h1 className={styles.rafPercentage}>
                                    {compareResults?.clientScore}
                                  </h1>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h5></h5>
                        <div className={styles.accuracyCard}>
                          <div className={styles.accuracyCard2}>
                            <div className={`mainCard ${styles.card1}`}>
                              <h6
                                className={`text-center ${styles.rafHeading1}`}
                              >
                                {/* Cogent AI RAF */}
                              </h6>
                              <Progress
                                type="dashboard"
                                percent={compareResults?.cogentAiPercentage}
                                width={250}
                                format={() => (
                                  <>
                                    <div>
                                      <div className={styles.currentYearText}>
                                        {currentYear}
                                      </div>
                                      <div>
                                        {compareResults?.cogentAiPercentage
                                          ? "100%"
                                          : "0%"}
                                      </div>
                                    </div>
                                  </>
                                )}
                                className="mainCard"
                              />
                            </div>
                            <div className={styles.card2}>
                              <h6
                                className={`text-center ${styles.rafHeading2}`}
                              >
                                {/* Client’s RAF */}
                              </h6>

                              <Progress
                                type="dashboard"
                                percent={compareResults?.clientPercentage}
                                width={250}
                                format={() => (
                                  <>
                                    <div>
                                      <div className={styles.currentYearText}>
                                        {" "}
                                        Difference ({currentYear} & {oneYearAgo}
                                        ){" "}
                                      </div>
                                      <div>
                                        {compareResults?.clientPercentage
                                          ? "100%"
                                          : "0%"}
                                      </div>
                                    </div>
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            title="Choose Patient"
            open={fileUploadModal}
            centered
            onCancel={() => closeModal()}
            footer={false}
          >
            <div className="offcanvas-body">
              <div className="container-fluid">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <div className="row">
                    <div className={styles.patientListContainer}>
                      <div>
                        <h6 className={styles.patientName}>
                          EH_1234 / Mary E Stone
                        </h6>
                      </div>
                      <div>
                        <h6 className={styles.patientName}>
                          EH_1235 / Snyder, Earl A
                        </h6>
                      </div>
                      <div>
                        <h6 className={styles.patientName}>
                          EH_1234 / VAIN, Rosemary
                        </h6>
                      </div>
                    </div>

                    {/* <div className={styles.fileContainer}>
                        <Form.Control
                          required
                          type="file"
                          accept="application/pdf,text/plain"
                        />
                      </div> */}
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="btn btn-primary btn-sm me-1"
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => closeModal()}
                      className="btn btn-danger btn-sm light ms-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Hcc;
