import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { Popconfirm, Divider, Popover, Menu, DatePicker, Dropdown } from "antd";
import { Modal } from "antd";

const Meat = ({}) => {
  const labDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.labDeatils
  );
  const labFile = useSelector(
    (state) => state?.ReviewerReducers?.labFileDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;

  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectMeatName, setSelectMeatName] = useState("");
  const [isModalOpenLabMeat, setIsModalOpenLabMeat] = useState(false);

  const [labReportMeatList, setLabReportMeatList] = useState([]);
  const [labReportFile, setLabReportFile] = useState([]);

  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const [providerDetails, setProviderDetails] = useState("");
  const [selectMeatResult, setSelectMeatResult] = useState(null);

  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };

  useEffect(() => {
    getLabReportDetails();
  }, [labDetailsResult]);

  useEffect(() => {
    getLabReportFiles();
  }, [labFile?.result?.response]);

  const getLabReportDetails = async () => {
    var resultTest = labDetailsResult?.result?.response;
    if (resultTest?.labFileDetail) {
      var result = resultTest;
      var dosYearArr = [];
      var validDiseaseNewRes = [];
      var meatRes = [];

      for (var key in result.validDisease) {
        dosYearArr.push({ value: key, label: key });
      }
      var validDisArray = [];

      if (dosYearArr.length != 0) {
        var dateofService = dosYearArr[0].value;

        validDiseaseNewRes = result.validDisease[dateofService];
        validDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          // var providerList = [];
          // providerList.push({
          //   providerName: res.providerName,
          //   authorizedProvider: true,
          // });
          var providerList = [];
          res.provider?.map((res, index) => {
            providerList.push(res.providerName);
          });
          validDisArray.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition,
            providerName: providerList,
          });
        });
        var capturedSectionsColorsMatching = [];
        var capturedSectionsArr = [];
        validDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              diagnosisCode: res.diagnosisCode,
            });
          });
        });

        var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

        dublicateSectionArr.map((res, index) => {
          capturedSectionsColorsMatching.push({
            name: res.name,
            diagnosisCode: res.diagnosisCode,
          });
        });

        var sectionColorResult = sectionColorList.result?.response;
        let sectionColorResultMatch = sectionColorResult.filter((o1) =>
          dublicateSectionArr.some((o2) => o1.sectionName === o2.name)
        );
        let sectionColorResultNotMatch = dublicateSectionArr.filter(
          (o1) => !sectionColorResult.some((o2) => o1.name === o2.sectionName)
        );

        var notMatchColorArray = [];
        sectionColorResultNotMatch?.map((res, index) => {
          var radomColorcode = stringToColour(res.name);
          var randomColorChangeShadow = radomColorcode + 33;
          notMatchColorArray.push({
            sectionName: res.name,
            backgroundColor: randomColorChangeShadow,
            sectionColor: radomColorcode,
          });
          // submitSectionColors(
          //   res.name,
          //   radomColorcode,
          //   randomColorChangeShadow
          // );
        });

        var newArrayColorMatchs = [];
        newArrayColorMatchs = [
          ...sectionColorResult,
          ...sectionColorResultMatch,
          ...notMatchColorArray,
        ];

        setCaptureSectionMatching(newArrayColorMatchs);

        var encounterDateColorsMatching = [];
        var encounterDateArr = [];

        validDiseaseNewRes.map((res) => {
          const array = res.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        var encounterDateArrDublicatesRemove = getUniqueListBy(
          encounterDateArr,
          "name"
        );
        encounterDateArrDublicatesRemove.map((res, index) => {
          encounterDateColorsMatching.push({
            name: res.name,
          });
        });

        setEncounterDateMatching(encounterDateColorsMatching);
        meatRes = result.meatCriteria[dateofService];
      }

      var meatListArr = [];
      meatRes.map((res, index) => {
        meatListArr.push({
          diagnosisCode: res.diagnosisCode,
          diseaseName: res.diseaseName,
          monitorCapturedFromHeader: res.monitorCapturedFromHeader,
          assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
          evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
          treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
          radiology: res.radiology,
          assessment: res.assessment,
          monitor: res.monitor,
          evaluate: res.evaluate,
          treatment: res.treatment,
          isMeatCriteriaPresent: res.isMeatCriteriaPresent,
        });
      });
      setLabReportMeatList(meatListArr);
    }
  };
  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const getLabReportFiles = async (fileId, tenId) => {
    if (labFile?.result?.response) {
      setLabReportFile(labFile?.result?.response);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenLabMeat(false);
  };

  function removeDuplicates(array) {
    let output = [];
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
    }

    return output;
  }

  const getCaptureSectionBackgroundMeat = (
    value,
    dis,
    radiology,
    meatresult
  ) => {
    if (value) {
      console.log(value);
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == value
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() => handleOpenModalLab(value, dis, radiology, meatresult)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheaderMeat}`}
        >
          {value}
        </span>
      );
      return sectionMapArr;
    }
  };

  const getEncounterDetails = async (date) => {
    var date = moment(date).format("DD");
    highlight({
      keyword: date,
    });
    // var dotLoading = (
    //   <div className={visitStyles.loadingFileHeader}>
    //     <Spinner />
    //   </div>
    // );
    // setProviderDetails(dotLoading);
    // var encounterDate = moment(date).format("MM/DD/YYYY");
    // var result = await getProviderDetails(localPatientId, encounterDate);
    // var data = "";
    // if (result?.status == "SUCCESS") {
    //   var datas = result.response;
    //   data = (
    //     <div className="validhcc-details">
    //       <div>Provider Name : {datas.providerName}</div>
    //       <div>Authorized Provider : {datas.authorizedProvider}</div>
    //       <div>UnAuthorize Provider : {datas.unAuthorizeProvider}</div>
    //       <div>No Credential : {datas.noCredential}</div>
    //       <div>UnSigned : {datas.unSigned}</div>
    //     </div>
    //   );
    // } else {
    //   data = (
    //     <div className="validhcc-details">
    //       <div>Provider Not Found</div>
    //     </div>
    //   );
    // }
    // setProviderDetails(data);
  };

  const confirmInvalidMeat = () =>
    new Promise((resolve) => {
      meatMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const meatMoveInvalidConfirm = () => {
    const result = meatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = meatCriteriaList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setMeatCriteriaList(result);
    var newArray = [];
    newArray = [...invalidMeatCriteriaList, ...result2];
    setInvalidMeatCriteriaList(newArray);
  };

  const onchangeMeat = (data, code) => {
    setSelectDiseasesName(data);
  };

  const handleOpenModalLab = (
    value,
    disDescription,
    radiologyCheck,
    meatresult
  ) => {
    setSelectMeatResult(meatresult);
    var splitPoint = disDescription.substring(" ", 40);
    setTimeout(() => {
      highlight({
        keyword: splitPoint,
        matchCase: true,
        // wholeWords:true
      });
      var dataset = value + " - (" + disDescription + ")";
      setSelectMeatName(dataset);
    }, 2000);
    setDocumentLoaded(true);
    var dataset = value + " - (" + disDescription + ")";
    setSelectMeatName(dataset + " -  " + "Loading...");
    setIsModalOpenLabMeat(true);
  };

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var sectionMapArr = (
        <span
          className={`mt-2 text-start ${visitStyles.provider_name}`}
          style={{ backgroundColor: backColor, color: textColor }}
        >
          <i>
            {" "}
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{
                size: 10,
                color: textColor,
              }}
            />
          </i>
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  return (
    <>
      <div className="my-post-content pt-3">
        <div className={visitStyles.meat_head_card}>
          <div className="row">
            <div className="col-xl-1">
              <label>Codes</label>
            </div>
            <div className="col-xl-2">
              <label>Description</label>
            </div>
            <div className="col-xl-2">
              <label>Monitor</label>
            </div>
            <div className="col-xl-2">
              <label>Evaluation</label>
            </div>
            <div className="col-xl-2">
              <label>Assessment</label>
            </div>
            <div className="col-xl-2">
              <label>Treatment</label>
            </div>
            <div className="col-xl-1">
              <label></label>
            </div>
          </div>
        </div>
        {labReportMeatList.length != 0 ? (
          <div className={visitStyles.hccStickey_head}>
            {labReportMeatList?.map((item) => {
              return (
                <div
                  className={
                    item.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    {/* <div className="col-xl-1">
                                                  <span className="font-bold">{item.diagnosisCode}</span>
                                                </div> */}
                    <div className="col-xl-1 d-grid">
                      <span className="font-bold meat-name-details">
                        {item.diagnosisCode}
                      </span>
                      {item.category == "Valid" ? (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validmeat`}
                        >
                          {item.category}
                        </Badge>
                      ) : (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validUnmatch`}
                        >
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    <div className="col-xl-2">
                      <Popover
                        placement="topLeft"
                        title="Description"
                        content={item.diseaseName}
                      >
                        <span className="meat-name-details">
                          {item.diseaseName}
                        </span>
                      </Popover>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.monitor != "" && item.monitor != null ? (
                        <Popover
                          placement="topLeft"
                          title="Monitor"
                          content={item.monitor}
                        >
                          <span className="meat-name-details">
                            {item.monitor}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.monitorCapturedFromHeader,
                          item.monitor,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.evaluate != "" && item.evaluate != null ? (
                        <Popover
                          placement="topLeft"
                          title="Evaluation"
                          content={item.evaluate}
                        >
                          <span className="meat-name-details">
                            {item.evaluate}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.evaluateCapturedFromHeader,
                          item.evaluate,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.assessment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Assessment"
                          content={item.assessment}
                        >
                          <span className="meat-name-details">
                            {item.assessment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.assessmentCapturedFromHeader,
                          item.assessment,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.treatment != "" && item.treatment != null ? (
                        <Popover
                          placement="topLeft"
                          title="Treatment"
                          content={item.treatment}
                        >
                          <span className="meat-name-details">
                            {item.treatment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.treatmentCapturedFromHeader,
                          item.treatment,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-1 meatclose">
                      <Popconfirm
                        title="You want move to Invalid?"
                        description={item.diseaseName}
                        onConfirm={confirmInvalidMeat}
                        placement="leftTop"
                        okText="Yes"
                        cancelText="No"
                        onOpenChange={() =>
                          onchangeMeat(item.diseaseName, item.diagnosisCode)
                        }
                      >
                        <div className={visitStyles.close_icon}>
                          <FontAwesomeIcon
                            icon={faArrowsAlt}
                            style={{ size: 8, color: "#a80404" }}
                          />
                        </div>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              );
            })}

            {labReportMeatList.length == 0 ? (
              <div className="card combo-card">
                <div className="col-xl-12">
                  <div>
                    <span className="no-patient-data">NO DATA</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <Modal
        title={selectMeatName}
        centered
        open={isModalOpenLabMeat}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        width="90%"
        footer={false}
      >
        <div className="section-container">
          <div className="my-post-content pt-3">
            <div className="row">
              <div className="col-xl-4">
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-6">
                      <label>Codes</label>
                    </div>
                    <div className="col-xl-6">
                      <label>Description</label>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-6 d-grid">
                      <span className="font-bold">
                        {selectMeatResult?.diagnosisCode}
                      </span>
                      {selectMeatResult?.category == "Valid" ? (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validmeat`}
                        >
                          {selectMeatResult?.category}
                        </Badge>
                      ) : (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validUnmatch`}
                        >
                          {selectMeatResult?.category}
                        </Badge>
                      )}
                    </div>
                    <div className="col-xl-6 d-grid">
                      <Popover
                        placement="topLeft"
                        title="Description"
                        content={selectMeatResult?.diseaseName}
                      >
                        <span className="meat-name-details2">
                          {selectMeatResult?.diseaseName}
                        </span>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Monitor</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.monitor != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Monitor"
                          content={selectMeatResult?.monitor}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.monitor}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.monitorCapturedFromHeader,
                          selectMeatResult?.monitor,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Evaluation</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.evaluate != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Evaluation"
                          content={selectMeatResult?.evaluate}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.evaluate}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.evaluateCapturedFromHeader,
                          selectMeatResult?.evaluate,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Assessment</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.assessment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Assessment"
                          content={selectMeatResult?.assessment}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.assessment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}

                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.assessmentCapturedFromHeader,
                          selectMeatResult?.assessment,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Treatment</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.treatment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Treatment"
                          content={selectMeatResult?.treatment}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.treatment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.treatmentCapturedFromHeader,
                          selectMeatResult?.treatment,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="card-body p-0 z-index-low">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                    <div
                      style={{
                        height: "80vh",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {" "}
                      <Viewer
                        fileUrl={labReportFile}
                        plugins={[defaultLayoutPluginInstance]}
                        onDocumentLoad={handleDocumentLoad}
                        renderLoader={(percentages) => (
                          <div style={{ width: "240px" }}>
                            <ProgressBar progress={Math.round(percentages)} />
                          </div>
                        )}
                      />
                    </div>
                  </Worker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Meat;
