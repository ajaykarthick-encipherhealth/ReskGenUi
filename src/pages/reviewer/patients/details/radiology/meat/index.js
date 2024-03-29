import React, { useState, useRef, useEffect } from "react";
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
import CamboTree from "../../hcc/org";

const Meat = ({}) => {
  const radiologyDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.radiologyDeatils
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const radiologyFile = useSelector(
    (state) => state?.ReviewerReducers?.radiologyFileDetails
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [localTenantId, setLocalTenantId] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [patientDetailsRadiology, setPatientDetailsRadiology] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [opens, setOpens] = useState(false);
  const [meatCriteriaListRadiology, setMeatCriteriaListRadiology] = useState(
    []
  );
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [selectMeatResult, setSelectMeatResult] = useState(null);
  const [isModalOpenRadiologyMeat, setIsModalOpenRadiologyMeat] =
    useState(false);
  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };

  useEffect(() => {
    getPatientDetailsRadiologyYear();
  }, [radiologyDetailsResult]);

  useEffect(() => {
    getPatientPdfFileRadiology();
  }, [radiologyFile?.result?.response]);

  const getPatientDetailsRadiologyYear = async () => {
    if (radiologyDetailsResult?.result?.response) {
      var result = radiologyDetailsResult?.result?.response;
      setPatientDetailsRadiology(result);
      if (result.validDisease != null) {
        var meatCri = "";
        var dosYearArr = [];
        for (var key in result.validDisease) {
          dosYearArr.push({ value: key, label: key });
        }
        var dateofService = dosYearArr[0].value;
        if (result.meatCriteria != null) {
          meatCri = result.meatCriteria[dateofService];
        }
        var validDiseaseNewRes = result?.validDisease[dateofService];
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
        });

        var newArrayColorMatchs = [];
        newArrayColorMatchs = [
          ...sectionColorResult,
          ...sectionColorResultMatch,
          ...notMatchColorArray,
        ];

        setCaptureSectionMatching(newArrayColorMatchs);
        var meatListArr = [];
        meatCri.map((res, index) => {
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
        setMeatCriteriaListRadiology(meatListArr);
      } else {
        setIsLoading(false);
      }
    }
  };
  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  function colorCodeMatch(arrList, key) {
    var colorReturnValue = null;
    const result = arrList.filter((res) => res.header == key);
    if (result[0] != undefined) {
      colorReturnValue = result[0].color;
    }

    return colorReturnValue;
  }

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    if (radiologyFile?.result?.response) {
      setSelectFileURLRadiology(radiologyFile?.result?.response);
    }
  };

  const confirmInvalidMeat = () =>
    new Promise((resolve) => {
      meatMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const onchangeMeat = (data, code) => {
    setSelectCode(code);
  };
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

  const handleCloseModal = () => {
    setIsModalOpenRadiologyMeat(false);
  };
  const handleOpenModalRadiologyMeat = (
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
      });
      var dataset = value + " - (" + disDescription + ")";
      setSelectMeatName(dataset);
    }, 2000);
    setDocumentLoaded(true);
    var dataset = value + " - (" + disDescription + ")";
    setSelectMeatName(dataset + " -  " + "Loading...");
    setIsModalOpenRadiologyMeat(true);
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  const getCaptureSectionBackgroundMeat = (
    value,
    dis,
    radiology,
    meatresult
  ) => {
    if (value) {
      var igonreCase = value.toLowerCase();
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == igonreCase
      );

      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() =>
            handleOpenModalRadiologyMeat(value, dis, radiology, meatresult)
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheaderMeat}`}
        >
          {value}
        </span>
      );
      return sectionMapArr;
    }
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
        <div className={visitStyles.container}>
          {meatCriteriaListRadiology.length != 0 ? (
            <div className={visitStyles.hccStickey_head}>
              {meatCriteriaListRadiology?.map((item) => {
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
                        {item.monitor != "" ? (
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
                        {item.evaluate != "" ? (
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
                        {item.treatment != "" ? (
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

              {meatCriteriaListRadiology.length == 0 ? (
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
      </div>

      {/* Modals */}

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

      <Modal
        title={selectMeatName}
        // title="Pdf Test"
        centered
        open={isModalOpenRadiologyMeat}
        // style={{ top: 5 }}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        width="90%"
        footer={false}
        // height={400}
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
                        fileUrl={selectFileURLRadiology}
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
