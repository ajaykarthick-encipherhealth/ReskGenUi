import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import "react-vertical-timeline-component/style.min.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faPlus,
  faArrowsAlt,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { notification } from "antd";
import { Tooltip } from "antd";
import { getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";

const File = ({}) => {
  const dispatch = useDispatch();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const hccFileDetails = useSelector(
    (state) => state?.ReviewerReducers?.hccFileDetails
  );

  const fileDosPageNumberList = useSelector(
    (state) => state?.ReviewerReducers.dosPageNumberList
  );
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { toolbarPluginInstance } = defaultLayoutPluginInstance;
  const { searchPluginInstance } = toolbarPluginInstance;
  const { highlight } = searchPluginInstance;
  const { setTargetPages } = searchPluginInstance;
  const [isModalOpenCaptureSection, setIsModalOpenCaptureSection] =
    useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [confirmNotesModalInValid, setConfirmNotesModalInValid] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [newInValidDiseaseList, setInNewValidDiseaseList] = useState([]);
  const [inputValue, setInputValue] = useState({
    notes: "",
  });
  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [selectInvalidDetails, setSelectInvalidDetails] = useState(false);
  const [suggestedNonHccList, setSuggestedNonHccList] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isValidAction, setIsValidAction] = useState("");
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [listPageNumber, setListPageNumber] = useState([]);
  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoadFile = () => {
    setDocumentLoaded(true);
    if (findFileKeyword) {
      setTimeout(() => {
        setFileModalHeader(fileModalTitle);
        if (fileInitialPage != null) {
          setTargetPages(
            (targetPage) =>
              targetPage.pageIndex === fileInitialPage ||
              targetPage.pageIndex === fileInitialPage + 1 ||
              targetPage.pageIndex === fileInitialPage + 2
          );
        }
        highlight({
          keyword: findFileKeyword,
        });
      }, 1000);
    }
  };

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    setLocalOrgId(orgId);
    getPatientDetails(patientId, orgId, tenId);
    setLocalTenantId(tenId);
    var uId = localStorage.getItem("userId");
    setLocalUserId(uId);
    setLocalPatientId(patientId);
  }, [patientDetailsResult]);

  useEffect(() => {
    getFileDosPageNumber();
  }, [fileDosPageNumberList]);

  useEffect(() => {
    if (hccFileDetails?.result?.response) {
      setSelectFileURL(hccFileDetails?.result?.response);
    }
  }, [hccFileDetails]);

  useEffect(() => {
    setDocumentLoaded(true);
    if (findFileKeyword) {
      setTimeout(() => {
        setFileModalHeader(fileModalTitle);
        if (fileInitialPage != null) {
          setTargetPages(
            (targetPage) =>
              targetPage.pageIndex === fileInitialPage ||
              targetPage.pageIndex === fileInitialPage + 1 ||
              targetPage.pageIndex === fileInitialPage + 2
          );
        } else {
          setTargetPages(null);
        }
        highlight({
          keyword: findFileKeyword,
        });
        setTimeout(() => {
          setFileLoading(false);
        }, 1000);
      }, 1000);
    }
  }, [fileInitialPage, findFileKeyword]);

  const getPatientDetails = async (patientId, orgId, tenId, reload) => {
    if (patientDetailsResult?.result?.response) {
      var result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      if (result.validDisease != null) {
        setPatientFileDTO(result.fileDetailDTO);
        var invalidDis = "";
        var dosYearArr = [];
        var invalidDiseaseNewRes = [];
        var unMatchRes = [];
        var suggestListAllNonHcc = [];
        result.encounterYears.map((res) => {
          dosYearArr.push({ value: res, label: res });
        });
        const highestDOS = Math.max(...dosYearArr.map((res) => res.value));
        const highestDosValue = dosYearArr.filter(
          (i) => parseInt(i.value) === highestDOS
        );
        setSelectedDosValue(highestDosValue[0].value);
        result.invalidDisease.map((res, index) => {
          const encounterDatearray = res.encounterDate.split(",");
          var providerList = [];
          res.provider?.map((res, index) => {
            providerList.push(res.providerName);
          });
          invalidDiseaseNewRes.push({
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
        if (result.unMatchedDisease != null) {
          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            const encounterDatearray = res.encounterDate.split(",");
            if (res?.isHccValid == false) {
              suggestListAllNonHcc.push({
                actualDescription: res.actualDescription,
                diagnosisCodeFinding: res.diagnosisCode,
                isHccValid: res.isHccValid,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCode,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Hcc",
              });
            }
          });
        
        }
        invalidDis = result.invalidDisease;
        setInNewValidDiseaseList(invalidDiseaseNewRes);
        setSuggestedNonHccList(suggestListAllNonHcc);
        var capturedSectionsColorsMatching = [];
        var capturedSectionsArr = [];
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
        invalidDiseaseNewRes.map((res) => {
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
          submitSectionColors(
            res.name,
            radomColorcode,
            randomColorChangeShadow
          );
        });

        var newArrayColorMatchs = [];
        newArrayColorMatchs = [
          ...sectionColorResultMatch,
          ...notMatchColorArray,
          ...sectionColorResult,
        ];

        setCaptureSectionMatching(newArrayColorMatchs);

        var encounterDateColorsMatching = [];
        var encounterDateArr = [];
        result.invalidDisease.map((res) => {
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
      } else {
        setIsLoading(false);
      }
    }
  };
  const getFileDosPageNumber = async () => {
    var result = fileDosPageNumberList?.result;
    var groupEncounterDate = [];
    for (var key in result?.response) {
      var optionPage = [];
      var pageNumbervalue = result.response[key];
      for (var key2 in pageNumbervalue) {
        var startPage = key2 == "first" ? pageNumbervalue[key2] : null;
        if (startPage) {
          optionPage.push({
            pageNumber: startPage,
          });
        }
      }
      groupEncounterDate.push({
        date: moment(key).format("MM/DD/YYYY"),
        startPage: optionPage,
      });
    }
    setListPageNumber(groupEncounterDate);
  };

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const suggestedToValid = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("suggestedToValid")
        )
      );
    });
  const suggestedToDeleted = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("suggestedToDeleted")
        )
      );
    });

  const confirmInvalid = () =>
    new Promise((resolve) => {
      resolve(setConfirmNotesModalInValid(true));
    });

  const onchangeValid = (code, data) => {
    var title = code + " - " + data.actualDescription;
    setSelectDiseasesName(title);
    setSelectInvalidDetails(data);
  };

  const handleCloseModal = () => {
    setValidated(false);
    setConfirmNotesModalValid(false);
    setConfirmNotesModalInValid(false);
    setIsModalOpenCaptureSection(false);
  };
  const findValueDocument = async (
    value,
    disDescription,
    headerNames,
    encounterDate,
    actualDescription
  ) => {
    setFileLoading(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var splitPoint = actualDescription.substring(" ", 20);
    var data = {
      fileId:fileId,
      header: disDescription,
      dos:encounterDatesHeader,
      stringFileWord:splitPoint      
    }
    try {
      const response = await axios.post(ENDPOINTS.apiEndoint +`dbservice/pageNumber`,data);
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        setFileInitialPage(pageNumber);
        if (result?.first == false) {
          splitPoint = disDescription;
        }
        var pageNumber = result?.second[0] - 1;
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setFileInitialPage(pageNumber);
      } else {
        setFileInitialPage(null);
      }

      setTargetPages(
        (targetPage) =>
          targetPage.pageIndex === pageNumber ||
          targetPage.pageIndex === pageNumber + 1 ||
          targetPage.pageIndex === pageNumber + 2
      );
      setFindFileKeyword(splitPoint);
    } catch (error) {
      setFileLoading(false);
      splitPoint = disDescription;
      setFileInitialPage(null);
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
    }
  };
  const handleOpenModalCombinationCode = async (
    value,
    disDescription,
    check,
    whereCome,
    documentPlace,
    encounterDate,
    headerNames,
    actualDescription
  ) => {
    if (check === "valid") {
      setFileModalTitle("Loading...");
      setFileLoading(true);
      var fileId = patientFileDTO.fileId;
      const encounterDatesValue = encounterDate.split(",");
      const encounterDatesHeader = encounterDatesValue[0];
      var pageNumber = null;
      setIsModalOpenCaptureSection(true);
      var splitPoint = actualDescription.substring(" ", 10);
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/pageNumber?header=${headerNames}&fileId=${fileId}&dos=${encounterDatesHeader}&stringFileWord=${splitPoint}`
      );
      var result = response.data.response;
      if (result?.length) {
        pageNumber = result?.second[0] - 1 ? result?.second[0] - 1 : null;
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setFileInitialPage(pageNumber);
      } else {
        setFileInitialPage(null);
      }

      var dataset = headerNames + " / " + actualDescription;
      var headerName =
        patientDocumentResult.patientId +
        " / " +
        patientDocumentResult.patientName +
        " / " +
        dataset;

      setFileModalTitle(headerName);
      setTargetPages(
        (targetPage) =>
          targetPage.pageIndex === pageNumber ||
          targetPage.pageIndex === pageNumber + 1 ||
          targetPage.pageIndex === pageNumber + 2
      );
      setFindFileKeyword(splitPoint);
    }
  };

  const handleSubmitValidNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModalValid(false);
      if (isValidAction == "suggestedToValid") {
        handleSubmitMoveSuggestedToValid();
      }
    }
    setValidated(true);
  };

  const handleSubmitValiInValiddNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModalInValid(false);
      handleSubmitInValidtoValid();
    }
    setValidated(true);
  };

  const handleSubmitMoveSuggestedToValid = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndoint +
        `dbservice/update/move/suggestedtovalid`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      dispatch(getPatientDetailsResult(localPatientId));
    } else {
    }
  };

  const handleSubmitInValidtoValid = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
      encounterDate: selectInvalidDetails.encounterDate,
      capturedSections: selectInvalidDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndoint +
        `dbservice/update/move/invalidtovalid`,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      dispatch(getPatientDetailsResult(localPatientId));
    } else {
    }
  };

  function removeDuplicates(array) {
    let output = [];
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
    }

    return output;
  }

  const getCaptureSectionBackground = (
    value,
    documentPlace,
    encounterDate,
    actualDescription,
    diagnosisCode
  ) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = diagnosisCode;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() =>
            handleOpenModalCombinationCode(
              disCode,
              res,
              "valid",
              "null",
              documentPlace,
              encounterDate,
              headerNames,
              actualDescription
            )
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };
  const getCaptureSectionBackgroundFile = (
    value,
    encounterDate,
    actualDescription
  ) => {
    // getSectionTagColor(value);
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;
      var sectionMapArr = (
        <span
          onClick={() =>
            findValueDocument(
              disCode,
              res,
              headerNames,
              encounterDate,
              actualDescription
            )
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader} ${backColor}`}
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

  const getEncounterDateBackgroundHcc = (value, code) => {
    return value?.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = (
        <span
          onClick={() => getEncounterDetailsHcc(res, code)}
          className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res).format("MMM DD")}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDetailsHcc = async (date, code) => {
    const findPageNumber = listPageNumber.filter((i) => i.date === date);
    if (findPageNumber.length != 0) {
      var dataset = code + " - (" + date + ")";
      var headerName =
        patientDocumentResult.patientId +
        " / " +
        patientDocumentResult.patientName +
        " / " +
        dataset;
      setFileModalTitle(headerName);
      setFileLoading(true);
      setIsModalOpenCaptureSection(true);
      var date = findPageNumber[0].date;
      if (findPageNumber[0].startPage.length != 0) {
        var pageNumber = findPageNumber[0].startPage[0].pageNumber - 1;
        setFileInitialPage(pageNumber);
        var splitPoint = date.substring(" ", 5);
        setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
        setFindFileKeyword(splitPoint);
        if (pageNumber == fileInitialPage) {
        }
      }
    }
  };

  const getEncounterDetails = async (date) => {
    const findPageNumber = listPageNumber.filter((i) => i.date === date);
    if (findPageNumber.length != 0) {
      setFileLoading(true);
      var date = findPageNumber[0].date;
      if (findPageNumber[0].startPage.length != 0) {
        var pageNumber = findPageNumber[0].startPage[0].pageNumber - 1;
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setFileInitialPage(pageNumber);
        var splitPoint = date.substring(" ", 5);
        setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
        setFindFileKeyword(splitPoint);
      }
    }
  };

  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor == "#efeff033" ? "#54548d33" : result[0]?.backgroundColor ;
      var textColor = result[0]?.sectionColor == "#efeff0" ? "#000" : result[0]?.sectionColor;
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
      {fileLoading ? (
        <div className={"overlay_style"}>
          <div className={"overlay__inner_style"}>
            <div className={"overlay__content_style"}>
              <span className={"spinner_style"}></span>
            </div>
          </div>
        </div>
      ) : null}
      <div className="my-post-content pt-3">
        <div className="row">
          <div className="col-xl-3">
            <ul className="timeline">
              <div
                className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
              >
                <span className={`${visitStyles.hcc_title_name}`}>NON-HCC</span>
                <div className="d-flex justify-content-center">
                  <span className={`${visitStyles.hcc_title_badge}`}>
                    {newInValidDiseaseList.length}
                  </span>
                </div>
              </div>
              <div className={visitStyles.container}>
                {newInValidDiseaseList.map((data, i) => (
                  <li>
                    <div className={`${visitStyles.hcc_card}`}>
                      <div className={`${visitStyles.hcc_card_nameHead}`}>
                        <div className="media-body">
                          <span className="mb-1 disease-name d-flex">
                            <span className="valid-dis-name">
                              {data.diagnosisCode}
                            </span>{" "}
                            - {data.actualDescription}
                          </span>
                        </div>

                        <Popconfirm
                          title="You want move to Hcc?"
                          description={data.diagnosisCode}
                          onConfirm={confirmInvalid}
                          placement="leftTop"
                          okText="Yes"
                          cancelText="No"
                          onOpenChange={() =>
                            onchangeValid(data.diagnosisCode, data)
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
                        <div
                          className={`${visitStyles.encounterAndSectionHeader}`}
                        >
                          {getCaptureSectionBackgroundFile(
                            data.capturedSections,
                            data.encounterDate,
                            data.actualDescription
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </ul>
          </div>
          <div className="col-xl-6">
            <div className="card-body p-0">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                <div
                  style={{
                    height: "80vh",
                    maxWidth: "1000px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {" "}
                  <Viewer
                    fileUrl={selectFileURL}
                    plugins={[defaultLayoutPluginInstance]}
                    initialPage={fileInitialPage}
                    onDocumentLoad={handleDocumentLoadFile}
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
            <ul className="timeline">
              <div
                className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
              >
                <span className={`${visitStyles.suggested_title_name}`}>
                  SUGGESTED CODES
                </span>
                <div className="d-flex justify-content-center">
                  <span className={`${visitStyles.suggested_title_badge}`}>
                    {suggestedNonHccList.length}
                  </span>
                </div>
              </div>
              <div className={visitStyles.container}>
                <div className={visitStyles.hccStickey_head}>
                  {suggestedNonHccList?.map((data) => {
                    return (
                      <>
                        {data.isHccValid == false || data.isHccValid == null ? (
                          <li>
                            <div className={`${visitStyles.hcc_card}`}>
                              <div
                                className={`${visitStyles.hcc_card_nameHead}`}
                              >
                                <div
                                  className="media-body"
                                  onClick={() =>
                                    handleOpenModalCombinationCode(
                                      data.diagnosisCode,
                                      data.actualDescription,
                                      "valid2"
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
                                  title="Choose an action"
                                  icon={
                                    <QuestionCircleOutlined
                                      style={{
                                        color: "blue",
                                      }}
                                    />
                                  }
                                  okText="Move to Deleted"
                                  cancelText="Move to HCC"
                                  onCancel={suggestedToValid}
                                  okButtonProps={{
                                    type: buttonClicked ? "primary" : "default",
                                  }}
                                  cancelButtonProps={{
                                    type: buttonClicked ? "danger" : "default",
                                  }}
                                  description={data.diagnosisCode}
                                  onConfirm={suggestedToDeleted}
                                  placement="leftTop"
                                  onOpenChange={() =>
                                    onchangeValid(data.diagnosisCode, data)
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
                              <div className="">
                                {getEncounterDateBackground(
                                  data.encounterDateSplit
                                )}
                                {data.getPlace == "Lab" ? (
                                  <Tooltip title="LAB">
                                    <span
                                      className={` mt-2 ${visitStyles.labStatus}`}
                                      bg={`  mt-2 bg-bg-seven `}
                                    >
                                      Lab
                                    </span>
                                  </Tooltip>
                                ) : data.getPlace == "Radio" ? (
                                  <Tooltip title="RADIOLOGY">
                                    <span
                                      className={` mt-2 ${visitStyles.radiologyStatus}`}
                                      bg={`  mt-2 bg-bg-eight `}
                                    >
                                      Radiology
                                    </span>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="HCC">
                                    <span
                                      className={` mt-2 ${visitStyles.hccStatus}`}
                                      bg={` mt-2 bg-bg-five `}
                                    >
                                      HCC
                                    </span>
                                  </Tooltip>
                                )}
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
                        ) : null}
                      </>
                    );
                  })}
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>

      {isModalOpenCaptureSection && (
        <Modal
          title={fileModalHeader}
          // title="Pdf Test"
          centered
          open={isModalOpenCaptureSection}
          style={{ top: 1 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="95%"
          footer={false}
          // height={500}
        >
          <div className="section-container">
            <div className="my-post-content pt-3">
              <div className="row">
                <div className="col-xl-2">
                  <ul className="timeline">
                    <div
                      className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
                    >
                      <span className={`${visitStyles.hcc_title_name}`}>
                        NON-HCC
                      </span>
                      <div className="d-flex justify-content-center">
                        <span className={`${visitStyles.hcc_title_badge}`}>
                          {newInValidDiseaseList.length}
                        </span>
                      </div>
                    </div>
                    <div className={visitStyles.container}>
                      {newInValidDiseaseList.map((data, i) => (
                        <li>
                          <div className={`${visitStyles.hcc_card}`}>
                            <div className={`${visitStyles.hcc_card_nameHead}`}>
                              <div className="media-body">
                                <span className="mb-1 disease-name d-flex">
                                  <span className="valid-dis-name">
                                    {data.diagnosisCode}
                                  </span>{" "}
                                  - {data.actualDescription}
                                </span>
                              </div>

                              <Popconfirm
                                title="You want move to Hcc?"
                                description={data.diagnosisCode}
                                onConfirm={confirmInvalid}
                                placement="leftTop"
                                okText="Yes"
                                cancelText="No"
                                onOpenChange={() =>
                                  onchangeValid(data.diagnosisCode, data)
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
                              <div
                                className={`${visitStyles.encounterAndSectionHeader}`}
                              >
                                {getCaptureSectionBackgroundFile(
                                  data.capturedSections,
                                  data.encounterDate,
                                  data.actualDescription
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  </ul>
                </div>
                <div className="col-xl-8">
                  <div className="card-body p-0">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                      <div
                        style={{
                          height: "80vh",
                          maxWidth: "1000px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        {" "}
                        <Viewer
                          fileUrl={selectFileURL}
                          plugins={[defaultLayoutPluginInstance]}
                          initialPage={fileInitialPage}
                          onDocumentLoad={handleDocumentLoadFile}
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
                <div className="col-xl-2">
                  <ul className="timeline">
                    <div
                      className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                    >
                      <span className={`${visitStyles.suggested_title_name}`}>
                        SUGGESTED CODES
                      </span>
                      <div className="d-flex justify-content-center">
                        <span
                          className={`${visitStyles.suggested_title_badge}`}
                        >
                          {suggestedNonHccList.length}
                        </span>
                      </div>
                    </div>
                    <div className={visitStyles.container}>
                      <div className={visitStyles.hccStickey_head}>
                        {suggestedNonHccList?.map((data) => {
                          return (
                            <>
                              {data.isHccValid == false ||
                              data.isHccValid == null ? (
                                <li>
                                  <div className={`${visitStyles.hcc_card}`}>
                                    <div
                                      className={`${visitStyles.hcc_card_nameHead}`}
                                    >
                                      <div
                                        className="media-body"
                                        onClick={() =>
                                          handleOpenModalCombinationCode(
                                            data.diagnosisCode,
                                            data.actualDescription,
                                            "valid2"
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
                                        title="Choose an action"
                                        icon={
                                          <QuestionCircleOutlined
                                            style={{
                                              color: "blue",
                                            }}
                                          />
                                        }
                                        okText="Move to Deleted"
                                        cancelText="Move to HCC"
                                        onCancel={suggestedToValid}
                                        okButtonProps={{
                                          type: buttonClicked
                                            ? "primary"
                                            : "default",
                                        }}
                                        cancelButtonProps={{
                                          type: buttonClicked
                                            ? "danger"
                                            : "default",
                                        }}
                                        description={data.diagnosisCode}
                                        onConfirm={suggestedToDeleted}
                                        placement="leftTop"
                                        onOpenChange={() =>
                                          onchangeValid(
                                            data.diagnosisCode,
                                            data
                                          )
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
                                    <div className="">
                                      {getEncounterDateBackground(
                                        data.encounterDateSplit
                                      )}
                                      {data.getPlace == "Lab" ? (
                                        <Tooltip title="LAB">
                                          <span
                                            className={` mt-2 ${visitStyles.labStatus}`}
                                            bg={`  mt-2 bg-bg-seven `}
                                          >
                                            Lab
                                          </span>
                                        </Tooltip>
                                      ) : data.getPlace == "Radio" ? (
                                        <Tooltip title="RADIOLOGY">
                                          <span
                                            className={` mt-2 ${visitStyles.radiologyStatus}`}
                                            bg={`  mt-2 bg-bg-eight `}
                                          >
                                            Radiology
                                          </span>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip title="HCC">
                                          <span
                                            className={` mt-2 ${visitStyles.hccStatus}`}
                                            bg={` mt-2 bg-bg-five `}
                                          >
                                            HCC
                                          </span>
                                        </Tooltip>
                                      )}
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
                              ) : null}
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {confirmNotesModalValid && (
        <Modal
          title={selectDiseasesName}
          centered
          open={confirmNotesModalValid}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          footer={null}
        >
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitValidNotes}
              >
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Reason <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      onChange={handleChangeSuggested}
                      rows="5"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    Submit
                  </Button>
                  <Button
                    onClick={() => handleCloseModal()}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      )}
      {confirmNotesModalInValid && (
        <Modal
          title={selectDiseasesName}
          centered
          open={confirmNotesModalInValid}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          footer={null}
        >
          <div className="offcanvas-body">
            <div className="container-fluid">
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitValiInValiddNotes}
              >
                <div className="row">
                  <div className="col-xl-12 mb-3">
                    <Form.Label>
                      Reason <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      onChange={handleChangeSuggested}
                      rows="5"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    Submit
                  </Button>
                  <Button
                    onClick={() => handleCloseModal()}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default File;
