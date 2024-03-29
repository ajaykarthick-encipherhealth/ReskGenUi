import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCheck,
  faInfo,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { Popconfirm, Divider, Popover, Menu, DatePicker, Dropdown } from "antd";
import Select from "react-select";

const File = ({}) => {
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
  const [invalidMoveDiseasesList, setInvalidMoveDiseasesList] = useState([]);

  const [labReportValidList, setLabReportValidList] = useState([]);
  const [labReportFile, setLabReportFile] = useState([]);

  const [labResultStatus, setLabResultStatus] = useState(false);
  const [labFileDateDefaulteSelect, setLabFileDateDefaulteSelect] =
    useState("");
  const [labResult, setLabResult] = useState("");
  const [labFileDosList, setLabFileDosList] = useState([]);

  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [labFileFilterList, setLabFileFilterList] = useState(10);
  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const [providerDetails, setProviderDetails] = useState("");
  const [patientLabDetails, setPatientLabDetails] = useState(null);

  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };

  useEffect(() => {
    setLabReportValidList([]);
    setLabResultStatus(false);
    getLabReportDetails();
  }, [labDetailsResult]);

  useEffect(() => {
    setLabReportFile([]);
    getLabReportFiles();
  }, [labFile?.result?.response]);

  const getLabReportDetails = async (orgId, tenId) => {
    var resultTest = labDetailsResult?.result?.response;
    setPatientLabDetails(resultTest);
    var dosYearArrFile = [];
    var fileDatesArr = [];
    if (resultTest?.labFileDetail) {
      if (resultTest.labFileDetail.length != 0) {
        resultTest.labFileDetail.map((res, index) => {
          for (var key in res.documentDos) {
            fileDatesArr.push({ value: key, label: key });
          }
        });
        for (var key in resultTest.labFileDetail[0].documentDos) {
          dosYearArrFile.push({ value: key, label: key });
        }
        setLabFileDateDefaulteSelect(dosYearArrFile[0]);
        var fileDetails = resultTest.labFileDetail;
        getLabReportFiles(fileDetails[0].azureBlobPath, tenId);
      }
    }
    setLabFileFilterList(fileDatesArr);
    if (resultTest?.labFileDetail) {
      var result = resultTest;
      setLabResult(result);
      var dosYearArr = [];
      var dosYearArrFile = [];
      var validDiseaseNewRes = [];
      for (var key in result.validDisease) {
        dosYearArr.push({ value: key, label: key });
      }

      setLabFileDosList(dosYearArr);
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

        const COLORS2 = [
          "sectionTag5",
          "sectionTag6",
          "sectionTag7",
          "sectionTag8",
          "sectionTag1",
          "sectionTag2",
          "sectionTag3",
          "sectionTag4",
        ];

        const COLORS3 = [
          "encounterDateTag1",
          "encounterDateTag2",
          "encounterDateTag3",
          "encounterDateTag4",
          "encounterDateTag5",
          "encounterDateTag6",
          "encounterDateTag7",
          "encounterDateTag8",
        ];

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
            colors: COLORS2[index],
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
            colors: COLORS3[index],
          });
        });

        setEncounterDateMatching(encounterDateColorsMatching);

        if (result.labFileDetail != null || result.labFileDetail.length != 0) {
          for (var key in result.labFileDetail[0].documentDos) {
            dosYearArrFile.push({ value: key, label: key });
          }
          setLabFileDateDefaulteSelect(dosYearArrFile[0]);
          var fileDetails = result.labFileDetail;
          getLabReportFiles(fileDetails[0].azureBlobPath, tenId);
        }
      }
      setLabReportValidList(validDisArray);
      setLabResultStatus(true);
    }
  };
  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const getLabReportFiles = async (fileId, tenId) => {
    if (labFile?.result?.response && labDetailsResult?.result?.response?.patientId) {
      setLabReportFile(labFile?.result?.response);
    }
  };
  const findValueDocument = (value, disDescription) => {
    var splitPoint = disDescription.substring(" ", 40);

    highlight({
      keyword: splitPoint,
    });
  };

  const dosOnChangeLabFile = async (e) => {
    var dosKeyValue = e.value;
    labResult.labFileDetail.map((res, index) => {
      for (var key in res.documentDos) {
        if (key == dosKeyValue) {
          getLabReportFiles(res.azureBlobPath);
        }
      }
    });
  };

  function removeDuplicates(array) {
    let output = [];
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
    }

    return output;
  }

  const getCaptureSectionBackgroundFile = (value) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var headerNames = result[0]?.sectionName;
      var disCode = result[0]?.diagnosisCode;

      var sectionMapArr = (
        <span
          onClick={() => findValueDocument(disCode, res)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDateBackground = (value) => {
    return value.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = (
        <Popover
          onClick={() => getEncounterDetails(res)}
          content={providerDetails}
          title=""
          placement="bottom"
          trigger="click"
        >
          <span
            className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
          >
            <i>
              <CalendarOutlined className={visitStyles.calenderIcon} />
            </i>
            {moment(res).format("MMM DD")}
          </span>
        </Popover>
      );
      return sectionMapArr;
    });
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
        <div className="radiology-select-dos">
          {labResultStatus ? (
            <Select
              onChange={(e) => dosOnChangeLabFile(e)}
              options={labFileFilterList}
              className="custom-react-select"
              defaultValue={labFileDateDefaulteSelect}
              isSearchable={false}
            />
          ) : null}
        </div>
        <div className="row">
          <div className="col-xl-3">
            <ul className="timeline">
              <div
                className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
              >
                <span className={`${visitStyles.hcc_title_name}`}>HCC</span>
                <div className="d-flex justify-content-center">
                  <span className={`${visitStyles.hcc_title_badge}`}>
                    {labReportValidList.length}
                  </span>
                </div>
              </div>

              {labReportValidList.map((data, i) => (
                <li>
                  <div className={`${visitStyles.hcc_card}`}>
                    <div className={`${visitStyles.hcc_card_nameHead}`}>
                      <div
                        className="media-body"
                        onClick={() =>
                          findValueDocument(
                            data.diagnosisCode,
                            data.actualDescription
                          )
                        }
                      >
                        <span className="mb-1 disease-name d-flex">
                          <span className="valid-dis-name">
                            {data.diagnosisCode}
                          </span>{" "}
                          - {data.actualDescription}
                        </span>
                      </div>
                    </div>
                    <div className={`${visitStyles.hoverActiveHcc}`}>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getProviderNameList(data?.providerName)}
                      </div>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getEncounterDateBackground(
                          data.encounterDateSplit,
                          data.diagnosisCode
                        )}
                      </div>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getCaptureSectionBackgroundFile(
                          data.capturedSections,
                          "Lab"
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-xl-6">
            <div className="card-body p-0 z-index-low">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                <div
                  style={{
                    height: "62vh",
                    maxWidth: "1000px",
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
          <div className="col-xl-3">
            <div className="">
              <ul className="timeline">
                <div
                  className={`valid-text d-flex justify-content-sm-between ${visitStyles.deleted_title_card}`}
                >
                  <span className={`${visitStyles.deleted_title_name}`}>
                    DELETED CODES
                  </span>
                  <div className="d-flex justify-content-center">
                    <span className={`${visitStyles.deleted_title_badge}`}>
                      {invalidMoveDiseasesList.length}
                    </span>
                  </div>
                </div>
                {invalidMoveDiseasesList.map((data, i) => (
                  <li>
                    <div className="timeline-panel invalid-disease">
                      <div className="media-body">
                        <span className="mb-1 disease-name d-flex">
                          <span className="valid-dis-name">
                            {data.diagnosisCode}
                          </span>{" "}
                          - {data.actualDescription}
                        </span>
                      </div>
                      <Popover
                        content={data.dbDescription}
                        title={data.diagnosisCode}
                        placement="bottom"
                        trigger="click"
                      >
                        <div className="icon-box  bg-danger-light me-1">
                          <FontAwesomeIcon
                            icon={faInfo}
                            style={{
                              color: "blue",
                            }}
                          />
                        </div>
                      </Popover>
                      <Popconfirm
                        title="You want move to valid?"
                        description={data.diagnosisCode}
                        onConfirm={confirmInvalidMoveDis}
                        placement="leftTop"
                        okText="Yes"
                        cancelText="No"
                        onOpenChange={() => onchangeValid(data.diagnosisCode)}
                      >
                        <div className="icon-box  bg-danger-light me-1">
                          <FontAwesomeIcon
                            icon={faCheck}
                            style={{
                              color: "orange",
                            }}
                          />
                        </div>
                      </Popconfirm>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default File;
