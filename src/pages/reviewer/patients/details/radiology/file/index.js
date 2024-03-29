import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCheck,
  faInfo,
  faPlus,
  faArrowsAlt,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { Popconfirm, Divider, Popover, Menu, DatePicker, Dropdown } from "antd";
import Select from "react-select";
import { Modal } from "antd";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import CamboTree from "../../hcc/org";

const File = ({}) => {
  const radiologyDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.radiologyDeatils
  );
  const radiologyFile = useSelector(
    (state) => state?.ReviewerReducers?.radiologyFileDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;
  const [invalidMoveDiseasesList, setInvalidMoveDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [patientDetailsRadiology, setPatientDetailsRadiology] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);

  const [newValidDiseaseListRadiology, setNewValidDiseaseListRadiology] =
    useState([]);
  const [newInValidDiseaseListRadiology, setInNewValidDiseaseListRadiology] =
    useState([]);
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [isLoadingDos, setIsLoadingDos] = useState(true);

  const [radiologyFileDateofServieList, setFileRadiologyDateofServiceList] =
    useState([]);
  const [radiologyFileDateDefaulteSelect, setRadiologyFileDateDefaulteSelect] =
    useState("");
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");

  const [radiologyFileDetailCheck, setRadiologyFileDetailCheck] =
    useState(false);
  const [dosYearDefalutSelectRadiology, setDosYearDefalutSelectRadiology] =
    useState("");

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
    var patientId = localStorage.getItem("patientId");
    if (radiologyDetailsResult?.result?.response) {
      var result = radiologyDetailsResult?.result?.response;
      setPatientDetailsRadiology(result);
      if (result.radiologyFileDetail != null) {
        if (result.radiologyFileDetail.length != 0) {
          var dosYearArrFile = [];

          result.radiologyFileDetail.map((res, index) => {
            for (var key in res.documentDos) {
              dosYearArrFile.push({
                value: key,
                label: key + " - " + res.documentDos[key].testName,
              });
            }
          });
          setFileRadiologyDateofServiceList(dosYearArrFile);
          setRadiologyFileDateDefaulteSelect(dosYearArrFile[0]);
          setRadiologyFileDetailCheck(true);
        }
      }
      if (result.validDisease != null) {
        var validDis = "";
        var comboDis = "";
        var dosYearArr = [];
        var validDiseaseNewRes = [];
        var invalidDiseaseNewRes = [];
        var unMatchRes = [];

        for (var key in result.validDisease) {
          dosYearArr.push({ value: key, label: key });
        }

        var dateofService = dosYearArr[0].value;
        validDis = result.validDisease[dateofService];
        validDiseaseNewRes = result.validDisease[dateofService];
        invalidDiseaseNewRes = result.invalidDisease[dateofService];
        if (result.unmatchedDisease != null) {
          var unMatchResCheck = result.unmatchedDisease[dateofService];

          if (unMatchResCheck != null) {
            unMatchRes = result.unmatchedDisease[dateofService];
          }
        }
        var validDisArray = [];
        validDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
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

        var invalidDisArray = [];
        invalidDiseaseNewRes.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          var providerList = [];
          res.provider?.map((res, index) => {
            providerList.push(res.providerName);
          });
          invalidDisArray.push({
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
        setNewValidDiseaseListRadiology(validDisArray);
        setInNewValidDiseaseListRadiology(invalidDisArray);
        setIsLoadingDos(false);
      }
    }
  };
  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    if (radiologyFile?.result?.response) {
      setSelectFileURLRadiology(radiologyFile?.result?.response);
    }
  };

  const confirmvalid = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("validToDeleted")
        )
      );
    });

  const confirmInvalidMoveDis = () =>
    new Promise((resolve) => {
      validMoveConfirmDis();
      setTimeout(() => resolve(null), 1000);
    });

  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    setSelectDiseasesName(title);
    setSelectInvalidDetails(data);
  };
  const validMoveConfirmDis = () => {
    const result = invalidMoveDiseasesList.filter(
      (res) => res.diagnosisCode != selectDiseasesName
    );
    setInvalidMoveDiseasesList(result);
    const result2 = invalidMoveDiseasesList.filter(
      (res2) => res2.diagnosisCode == selectDiseasesName
    );
    // var namePush = [];
    // namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...newValidDiseaseList, ...result2];
    setNewValidDiseaseList(newArray);
  };

  const findValueDocument = (value, disDescription) => {
    var splitPoint = disDescription.substring(" ", 40);

    highlight({
      keyword: splitPoint,
    });
  };
  const dosOnChangeRadiologyFile = async (e) => {
    var dosKeyValue = e.value;
    patientDetailsRadiology.radiologyFileDetail.map((res, index) => {
      for (var key in res.documentDos) {
        if (key == dosKeyValue) {
          // getPatientPdfFileRadiologyYear(fileDetails[0].azureBlobPath, localTenantId);
          getPatientPdfFileRadiology(res.azureBlobPath, localTenantId);
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
    console.log(dublicateCaptureDelete);
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
        <span onClick={() => getEncounterDetails(res)}>
          <span
            className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
          >
            <i>
              <CalendarOutlined className={visitStyles.calenderIcon} />
            </i>
            {moment(res).format("MMM DD")}
          </span>
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDetails = async (date) => {
    var date = moment(date).format("DD");
    highlight({
      keyword: date,
    });
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
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
          {radiologyFileDetailCheck ? (
            <Select
              onChange={(e) => dosOnChangeRadiologyFile(e)}
              options={radiologyFileDateofServieList}
              className="custom-react-select"
              defaultValue={radiologyFileDateDefaulteSelect}
              isSearchable={false}
            />
          ) : (
            <div></div>
          )}
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
                    {newValidDiseaseListRadiology.length}
                  </span>
                </div>
              </div>

              {newValidDiseaseListRadiology.map((data, i) => (
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

                      <Popconfirm
                        title="You want to delete?"
                        description={data.diagnosisCode}
                        onConfirm={confirmvalid}
                        placement="leftTop"
                        okText="Yes"
                        cancelText="No"
                        onOpenChange={() => onchangeValid(data.diagnosisCode)}
                      >
                        <div className={visitStyles.close_icon}>
                          <FontAwesomeIcon
                            icon={faArrowsAlt}
                            style={{ size: 8, color: "#a80404" }}
                          />
                        </div>
                      </Popconfirm>
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
                      <div>
                        {getCaptureSectionBackgroundFile(
                          data.capturedSections,
                          "Radio"
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
          <div className="col-xl-3">
            <div className="">
              <ul className="timeline">
                <div
                  className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                >
                  <span className={`${visitStyles.suggested_title_name}`}>
                    NON-HCC
                  </span>
                  <div className="d-flex justify-content-center">
                    <span className={`${visitStyles.suggested_title_badge}`}>
                      {newInValidDiseaseListRadiology.length}
                    </span>
                  </div>
                </div>
                <div className={visitStyles.suggestedcontainer2}>
                  <div className={visitStyles.hccStickey_head}>
                    {newInValidDiseaseListRadiology.map((data, i) => (
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

                            <Popconfirm
                              title="You want to delete?"
                              description={data.diagnosisCode}
                              onConfirm={confirmvalid}
                              placement="leftTop"
                              okText="Yes"
                              cancelText="No"
                              onOpenChange={() =>
                                onchangeValid(data.diagnosisCode)
                              }
                            >
                              <div className={visitStyles.close_icon}>
                                <FontAwesomeIcon
                                  icon={faArrowsAlt}
                                  style={{
                                    size: 8,
                                    color: "#a80404",
                                  }}
                                />
                              </div>
                            </Popconfirm>
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
                            <div>
                              {getCaptureSectionBackgroundFile(
                                data.capturedSections,
                                "Radio"
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
                <div className={visitStyles.suggestedcontainer2}>
                  <div className={visitStyles.hccStickey_head}>
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
                            onOpenChange={() =>
                              onchangeValid(data.diagnosisCode)
                            }
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
                  </div>
                </div>
              </ul>
            </div>
          </div>
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
    </>
  );
};

export default File;
