import React, { useState, useRef, useEffect } from "react";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment, { months } from "moment";
import "react-vertical-timeline-component/style.min.css";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowsAlt,
  faSitemap,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { Popconfirm, Select, Tag } from "antd";
import { SVGICON } from "../../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Offcanvas } from "react-bootstrap";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import Spinner from "../../../../../../components/loadingSpinner";
import styles from "../styles.module.css";
import { manuallyAddComboCode } from "../../../../../../services/PatientsListSevice";
import { getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import CamboTree from "../org";
import PdfViewer from "../../PdfViewerComponent";
const addOnCodeColor = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];
const Combo = ({}) => {
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
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] =
    useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [selectCode, setSelectCode] = useState("");
  const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [combiTree, setCombiTree] = useState({});
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    notes: "",
    diagnosisCode: "",
    actualDescription: "",
    capturedSections: "",
    encodedDate: "",
    flag: "",
    comments: "",
    description: "",
    queryReason: "",
    providerName: "",
    imagingTestHeader: "",
    headerName: "",
    queryComment: "",
    reason: "",
    diagnosisCodeQuery: "",
    comboCode: "",
    additionalCode: "",
  });
  const [localPatientId, setLocalPatientId] = useState("");
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [isAddComboCode, setIsAddComboCode] = useState(false);
  const [listPageNumber, setListPageNumber] = useState([]);
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const [fileLoading, setFileLoading] = useState(false);
  const [search, setSearch] = useState(false);

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCodeQuery") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "encodedDate") {
      setInputValueFileDate(e.target.value);
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
  };
  const handleDocumentLoadFile = () => {
    setDocumentLoaded(true);
    if (findFileKeyword) {
      setTimeout(() => {
        setFileModalHeader(fileModalTitle);
        if (fileInitialPage) {
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
    setLocalPatientId(patientId);
    setLocalOrgId(orgId);
    setLocalTenantId(tenId);
    getPatientDetails();
  }, [patientDetailsResult]);

  useEffect(() => {
    if (hccFileDetails?.result?.response) {
      setSelectFileURL(hccFileDetails?.result?.response);
    }
  }, [hccFileDetails]);

  useEffect(() => {
    getFileDosPageNumber();
  }, [fileDosPageNumberList]);

  useEffect(() => {
    // loadFilterPatientList();
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    getPatientDetailsFileLoad(patientId, orgId, tenId);
  }, [activeTabNumber]);

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
  }, [fileInitialPage, findFileKeyword, fileModalTitle]);

  const getPatientDetails = async () => {
    if (patientDetailsResult?.result?.response) {
      var result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      if (result?.comboDisease) {
        var combiDisArray = [];
        if (result?.comboDisease) {
          result?.comboDisease.map((res, index) => {
            var providerList = [];
            res.providers?.map((res, index) => {
              providerList.push(res.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            combiDisArray.push({
              addOnCode: res.addOnCode,
              addOnCodeTwo: res.addOnCodeTwo,
              addOnCodeThree: res.addOnCodeThree,
              addOnCodes: [res.addOnCode, res.addOnCodeTwo, res.addOnCodeThree],
              diagnosisCodeCombo: res.diagnosisCodeCombo,
              diseaseName: res.diseaseName,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              providerName: providerList,
              providers: res.provider ? res.providers : res.provider,
              ruleType: res.ruleType,
              capturedSections: res.capturedSections,
              children: res.children ? res.children : [],
              expanded: true,
            });
          });
        }
        setPatientFileDTO(result?.fileDetailDTO);
        setComboDiseaseCodesList(combiDisArray);
        const COLORS3 = [
          "encounterDateTag1",
          "encounterDateTag2",
          "encounterDateTag3",
          "encounterDateTag4",
          "encounterDateTag5",
          "encounterDateTag6",
          "encounterDateTag7",
          "encounterDateTag8",
          "encounterDateTag9",
          "encounterDateTag10",
        ];
        var encounterDateColorsMatching = [];
        var encounterDateArr = [];

        result?.comboDisease?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr?.push({
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
        setCaptureSectionMatching(sectionColorList.result?.response);
      } else {
      }
    }
  };
  const getPatientDetailsFileLoad = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    getFileDosPageNumber();
    if (patientDetailsResult?.result?.response) {
      var result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      if (result.validDisease != null) {
        getPatientPdfFile(result?.fileDetailDTO?.azureBlobPath, tenId);
        setPatientFileDTO(result?.fileDetailDTO);
      } else {
      }
    }
  };

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const getPatientPdfFile = async (fileId, tenId) => {
    // const response = await axios.get(
    //   ENDPOINTS.apiEndoint +
    //     `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    // );
    // if (response.data) {
    //   var result = response.data.response;
    //   setSelectFileURL(response.data.response);
    //   setSelectFileURLValid(response.data.response);
    //   setIsLoading(false);
    //   setIsLoadingDos(false);
    // }
  };

  const confirmComboInvalid = () =>
    new Promise((resolve) => {
      comboMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmComboValid = () =>
    new Promise((resolve) => {
      comboMoveValidConfirm();
      setTimeout(() => resolve(null), 1000);
    });
  const onchangeCombo = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };

  const comboMoveInvalidConfirm = () => {
    const result = comboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = comboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setComboDiseaseCodesList(result);
    var namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    var newArray = [];
    newArray = [...invalidComboDiseaseCodesList, ...result2];
    setInvalidComboDiseaseCodesList(newArray);
  };

  const comboMoveValidConfirm = () => {
    const result = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setInvalidComboDiseaseCodesList(result);
    const result2 = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    var newArray = [];
    newArray = [...comboDiseaseCodesList, ...result2];
    setComboDiseaseCodesList(newArray);
  };

  const handleCloseModal = () => {
    setValidated(false);
    setIsModalOpenCaptureSection(false);
    setIsAddComboCode(false);
    setFindFileKeyword(null);
    setFileLoading(false);
  };

  const handleOpenModal = async (
    value,
    disDescription,
    encounterDate,
    meatresult
  ) => {
    setSelectMeatResult(meatresult);
    setFileLoading(true);
    var splitPoint = disDescription.substring(" ", 20);
    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var pageNumber = null;
    try {
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/pageNumber?header=${value}&fileId=${fileId}&dos=${encounterDatesHeader}&stringFileWord=${splitPoint}`
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        if (result?.first == false) {
          splitPoint = value;
        }
        pageNumber = result?.second[0] - 1 ? result?.second[0] - 1 : null;
        setFileInitialPage(pageNumber);
      } else {
        setFileInitialPage(null);
      }
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
        var dataset = value + " / (" + disDescription + ")";
      }
      setFindFileKeyword(splitPoint);

      var dataset = value + " / (" + disDescription + ")";
      setSelectMeatName(dataset);
    } catch (error) {
      splitPoint = value;
      if (findFileKeyword == value) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
    }
  };

  const findValueDocuments = async (
    value,
    disDescription,
    headerNames,
    encounterDate,
    actualDescription,
    diagnosisCode,
  ) => {
    setFileLoading(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var splitPoint = actualDescription;
    var pageNumber = null;
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: splitPoint,
      diagnosisCode: diagnosisCode,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.second[0]? result?.second[0] : null;
        if (result?.first == false) {
          splitPoint = headerNames;
        }
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setSearch({
          value: splitPoint,
          page: pageNumber,
        });
        setFileInitialPage(pageNumber);
      } else {
        splitPoint = headerNames;
        setFileInitialPage(null);
      }
      setTargetPages(
        (targetPage) =>
          targetPage.pageIndex === pageNumber ||
          targetPage.pageIndex === pageNumber + 1 ||
          targetPage.pageIndex === pageNumber + 2
      );
      setFindFileKeyword(splitPoint);
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
      }
    } catch (error) {
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
      setSearch({
        value: splitPoint,
        page: null,
      });
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
    }
  };

  const findValueDocument = async (
    value,
    disDescription,
    headerNames,
    encounterDate,
    actualDescription,
    diagnosisCode
  ) => {
    setFileLoading(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var splitPoint;
    var pageNumber = null;
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: actualDescription,
      diagnosisCode: diagnosisCode,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber/latest`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.pageNumber - 1 ? result?.pageNumber - 1 : null;
        splitPoint = result?.searchString;
        if (result == null) {
          return findValueDocuments(
            value,
            disDescription,
            headerNames,
            encounterDate,
            actualDescription,
            diagnosisCode,
          );
        }
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setSearch({
          value: splitPoint,
          page: result?.pageNumber,
        });
        setFileInitialPage(pageNumber);
      } else {
        splitPoint = headerNames;
        setFileInitialPage(null);
      }
      setTargetPages((targetPage) => {
        targetPage.pageIndex === pageNumber;
      });
      setFindFileKeyword(splitPoint);
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
      }
    } catch (error) {
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
    }
  };
  const handleOpenModalCombinationCodeOld = async (
    value,
    disDescription,
    check,
    whereCome,
    documentPlace,
    encounterDate,
    headerNames,
    actualDescription,
    testModal
  ) => {
    setFileLoading(true);
    setDocumentLoaded(false);
    var dataset = value + " - (" + disDescription + ")";
    setSelectMeatName(dataset + " -  " + "Loading...");
    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    var headerName = dotLoading;
    setFileModalHeader(headerName);
    setIsModalOpenCaptureSection(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var splitPoint = "";
    var pageNumber = null;
    splitPoint = actualDescription;
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: splitPoint,
      diagnosisCode: value,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        if (result?.first == false) {
          splitPoint = headerNames;
        }
        pageNumber = result?.second[0] ? result?.second[0] : null;
        setFileInitialPage(pageNumber);
      } else {
        splitPoint = headerNames;
      }
      setFindFileKeyword(splitPoint);
      setSearch({
        value: splitPoint,
        page: pageNumber,
      });
      var dataset =
        value +
        " - (" +
        disDescription +
        ")" +
        " / (" +
        actualDescription +
        ")";
      setSelectMeatName(dataset);
      var headerName =
        patientDocumentResult.patientId +
        " / " +
        patientDocumentResult.patientName +
        " / " +
        dataset;
      setFileModalTitle(headerName);
      setDocumentLoaded(true);
    } catch (error) {
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
      setSearch({
        value: splitPoint,
        page: null,
      });
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
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
    actualDescription,
    testModal
  ) => {
    setFileLoading(true);
    setDocumentLoaded(false);
    var dataset = value + " - (" + disDescription + ")";
    setSelectMeatName(dataset + " -  " + "Loading...");
    var dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    var headerName = dotLoading;
    setFileModalHeader(headerName);
    setIsModalOpenCaptureSection(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    const encounterDatesHeader = encounterDatesValue[0];
    var splitPoint = "";
    var pageNumber = null;
    splitPoint = actualDescription.substring(" ", 20);
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: actualDescription.substring(" ", 20),
      diagnosisCode: value,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber/latest`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.pageNumber - 1 ? result?.pageNumber - 1 : null;
        splitPoint = result?.searchString;
        if (result == null) {
          return handleOpenModalCombinationCodeOld(
            value,
            disDescription,
            check,
            whereCome,
            documentPlace,
            encounterDate,
            headerNames,
            actualDescription,
            testModal
          );
        }
        setSearch({
          value: splitPoint,
          page: pageNumber,
        });
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setFileInitialPage(pageNumber);
        var headerName =
          patientDocumentResult.patientId +
          " / " +
          patientDocumentResult.patientName +
          " / " +
          dataset;
        // setFileModalHeader(headerName);
        setFileModalTitle(headerName);
        setSearch({
          value: splitPoint,
          page: result?.pageNumber,
        });
      } else {
        splitPoint = headerNames;
        setFileInitialPage(null);
      }
      setTargetPages((targetPage) => {
        targetPage.pageIndex === pageNumber;
      });
      setFindFileKeyword(splitPoint);
      if (findFileKeyword == splitPoint) {
        setFileLoading(false);
      }
    } catch (error) {
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
    }
  };
  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const getPatientDetailsReload = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    dispatch(getPatientDetailsResult(patientId));
  };

  function removeDuplicates(array) {
    let output = [];
    if (array) {
      for (let item of array) {
        if (!output.includes(item)) output.push(item);
      }
    }

    return output;
  }

  const getCaptureSectionBackgroundFile = (
    value,
    encounterDate,
    actualDescription,
    diagnosisCode
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
              actualDescription,
              diagnosisCode
            )
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
        >
              
          {res}{console.log(diagnosisCode , "testing")}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getCaptureSectionBackground = (
    value,
    documentPlace,
    encounterDate,
    actualDescription,
    testModal,
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
              actualDescription,
              testModal
            )
          }
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  const getEncounterDateBackgroundHcc = (value, code, place, meatResult) => {
    return value?.map((res) => {
      const result = encounterDateMatching.filter((res2) => res2.name == res);
      var backColor = result[0]?.colors;
      var sectionMapArr = res ? (
        <span
          onClick={() => getEncounterDetailsHcc(res, code, place, meatResult)}
          className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
        >
          <i>
            <CalendarOutlined className={visitStyles.calenderIcon} />
          </i>
          {moment(res, "MM/DD/YYYY").format("MMM DD")}
        </span>
      ) : (
        ""
      );
      return sectionMapArr;
    });
  };

  const getEncounterDetailsHcc = async (date, code, place, meatResult) => {
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
      if (place == "MEAT") {
        setSelectMeatName(headerName);
        setSelectMeatResult(meatResult);
      } else if (place == "COMBO") {
        setIsModalOpenCaptureSection(true);
      } else {
      }
      var date = findPageNumber[0].date;
      if (findPageNumber[0].startPage.length != 0) {
        var pageNumber = findPageNumber[0].startPage[0].pageNumber;
        setFileInitialPage(pageNumber);
        var splitPoint = date.substring(" ", 5);
        setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
        setFindFileKeyword(splitPoint);
        if (pageNumber == fileInitialPage) {
        }
        setSearch({
          value: splitPoint,
          page: pageNumber,
        });
      }
    }
  };

  const getFileDosPageNumber = async () => {
    var result = fileDosPageNumberList?.result;
    var groupPageNumber = [];
    var groupEncounterDate = [];
    for (var key in result?.response) {
      var optionArray = [];
      var optionPage = [];
      var pageNumbervalue = result.response[key];
      for (var key2 in pageNumbervalue) {
        var startPage = key2 == "first" ? pageNumbervalue[key2] : null;
        var keyValue = key2 == "first" ? "Start - " : "End - ";
        optionArray.push({
          label: keyValue + " " + pageNumbervalue[key2],
          value: pageNumbervalue[key2] + "," + moment(key).format("MM/DD"),
        });
        if (startPage) {
          optionPage.push({
            pageNumber: startPage,
          });
        }
      }
      groupPageNumber.push({
        label: moment(key).format("MM-DD-YYYY"),
        options: optionArray,
      });
      groupEncounterDate.push({
        date: moment(key).format("MM/DD/YYYY"),
        startPage: optionPage,
      });
    }
    setListPageNumber(groupEncounterDate);
  };

  const handleChangePageNumber = async (value) => {
    setPopoverVisible(false);
    var str_array = value.split(",");
    var pageNumber = str_array[0];
    var findData = str_array[1];
    setFindFileKeyword(null);
    setFileLoading(true);
    var pageIndex = pageNumber - 1;
    setFileInitialPage(pageIndex);
    setTargetPages(
      (targetPage) =>
        targetPage.pageIndex === pageNumber ||
        targetPage.pageIndex === pageNumber + 1 ||
        targetPage.pageIndex === pageNumber + 2
    );
    setFindFileKeyword(findData);
  };

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var value = ["09/19/2023"];
      var sectionMapArr = (
        // <Popover
        //   content={
        //     <>
        //       {value?.map((res3) => {
        //         const result = encounterDateMatching.filter(
        //           (res2) => res2.name == res3
        //         );
        //         var backColor = result[0]?.colors;
        //         <span
        //           className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
        //         >
        //           <i>
        //             <CalendarOutlined className={visitStyles.calenderIcon} />
        //           </i>
        //           {moment(res3).format("MMM DD")}
        //         </span>;
        //       })}
        //     </>
        //   }
        //   trigger={["click"]}
        //   placement="bottom"
        //   onClick={() => getEncounterProviderDetails(res)}
        // >
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
        // </Popover>
      );
      return sectionMapArr;
    });

    // var value = data?.map((res) =>
    //   res.providerName ? (
    //     <Badge
    //       className={
    //         res.authorizedProvider === true
    //           ? `mt-2 text-start ${visitStyles.provider_name}`
    //           : `mt-2 text-start ${visitStyles.un_provider_name}`
    //       }
    //     >
    //       <i>
    //         {" "}
    //         <FontAwesomeIcon
    //           icon={faCircleUser}
    //           style={{
    //             size: 10,
    //             color:
    //               res.authorizedProvider === true ? "#008000bf" : "#ff0000cc",
    //           }}
    //         />
    //       </i>
    //       {res.providerName}
    //     </Badge>
    //   ) : null
    // );
    // return value;
  };

  const addComboCode = () => {
    setIsAddComboCode(true);
  };

  const handleSubmitComboCode = async (event) => {
    var dos = dosYearDefalutSelect.label;

    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      var updateDataformat = {
        patientId: localPatientId,
        dosYear: selectedDosValue,
        comboCode: inputValue.comboCode,
        additionalCode: inputValue.additionalCode,
        description: inputValue.description,
      };
      var result = await manuallyAddComboCode(updateDataformat);
      if (result.status == "SUCCESS") {
        setIsAddComboCode(false);
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getPatientDetailsReload(
          localPatientId,
          localOrgId,
          localTenantId,
          "fileNotLoad"
        );
      }

      setValidated(true);
    }
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  return (
    <>
      {fileLoading ? (
        <div className={styles.overlay_style}>
          <div className={styles.overlay__inner_style}>
            <div className={styles.overlay__content_style}>
              <span className={styles.spinner_style}></span>
            </div>
          </div>
        </div>
      ) : null}
      <div className={`${visitStyles.comboContainer}`}>
        <div className={`row ${visitStyles.comboContainer2}`}>
          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>VALID CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label>Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label>Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label>Description</label>
                  </div>
                  <div className="col-xl-1">
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => addComboCode()}
                        className={visitStyles.combo_add_btn}
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
                  </div>
                </div>
              </div>
              {comboDiseaseCodesList?.length != 0 ? (
                <div className={visitStyles.container}>
                  <div className={visitStyles.hccStickey_head}>
                    {comboDiseaseCodesList?.map((item) => {
                      return (
                        <div className={visitStyles.combo_details_card}>
                          <div className="row">
                            <div className="col-xl-3 d-grid">
                              <span className="font-bold">
                                {item.diagnosisCodeCombo}
                              </span>
                            </div>
                            <div className="col-xl-3">
                              {item.addOnCodes?.map(
                                (addCombo, index) =>
                                  addCombo && (
                                    <span className="font-bold">
                                      <Tag color={addOnCodeColor[index]}>
                                        {addCombo}
                                      </Tag>
                                    </span>
                                  )
                              )}
                            </div>
                            <div className="col-xl-5">
                              <span>{item.diseaseName}</span>
                            </div>
                            <div className="col-xl-1">
                              <div>
                                <Popconfirm
                                  title="You want move to Invalid?"
                                  description={item.diseaseName}
                                  onConfirm={confirmComboInvalid}
                                  placement="leftTop"
                                  okText="Yes"
                                  cancelText="No"
                                  onOpenChange={() =>
                                    onchangeCombo(
                                      item.diseaseName,
                                      item.addOnCode
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
                              {/* <Popconfirm
                                            title="You want to see the tree view?"
                                            description={item.diseaseName}
                                            onConfirm={() => {
                                              setOpens(true);
                                              
                                            }}
                                            placement="leftTop"
                                            okText="Yes"
                                            cancelText="No"
                                            onOpenChange={() => {
                                              setCombiTree(item);
                                            }}
                                          > */}
                              <div
                                className={visitStyles.close_icon}
                                style={{ background: "#c7f3c6" }}
                                onClick={() => {
                                  setOpens(true);
                                  setCombiTree([{ ...item, expanded: true }]);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faSitemap}
                                  style={{
                                    size: 8,
                                    color: "#088f39",
                                  }}
                                />
                              </div>
                              {/* </Popconfirm> */}
                            </div>
                            <div className={styles.comboDetailsHeaders}>
                              <div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getProviderNameList(item?.providerName)}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getEncounterDateBackgroundHcc(
                                    item.encounterDateSplit,
                                    item.diagnosisCodeCombo,
                                    "COMBO"
                                  )}
                                </div>
                                <div
                                  className={`${visitStyles.encounterAndSectionHeader}`}
                                >
                                  {getCaptureSectionBackground(
                                    item.capturedSections,
                                    "COMBO",
                                    item.encounterDate,
                                    item.diseaseName,
                                    null,
                                    item.diagnosisCodeCombo
                                  )}
                                </div>
                              </div>
                              {/* <div>
                                            <span
                                              className={styles.ruleTypeCol}
                                            >
                                              {underScoreRemove(item.ruleType)}
                                            </span>
                                          </div> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {comboDiseaseCodesList?.length == 0 ? (
                <div>
                  <span className="no-patient-data">No Combination Codes</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>DELETED COMBO CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label>Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label>Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label>Description</label>
                  </div>
                </div>
              </div>
              {invalidComboDiseaseCodesList?.length != 0 ? (
                <>
                  <div className={visitStyles.container}>
                    <div className={visitStyles.hccStickey_head}>
                      {invalidComboDiseaseCodesList?.map((item) => {
                        return (
                          <div className={visitStyles.combo_details_card}>
                            <div className="row">
                              <div className="col-xl-3">
                                <span className="font-bold">
                                  {item.diagnosisCodeCombo}
                                </span>
                              </div>
                              <div className="col-xl-3">
                                <span className="font-bold">
                                  {item.addOnCode}
                                </span>
                              </div>
                              <div className="col-xl-5">
                                <span>{item.diseaseName}</span>
                              </div>
                              <div className="col-xl-1 comboclose">
                                <Popconfirm
                                  title="You want move to Valid?"
                                  description={item.diseaseName}
                                  onConfirm={confirmComboValid}
                                  placement="leftTop"
                                  okText="Yes"
                                  cancelText="No"
                                  onOpenChange={() =>
                                    onchangeCombo(
                                      item.diseaseName,
                                      item.addOnCode
                                    )
                                  }
                                >
                                  <div className={visitStyles.tick_icon}>
                                    {SVGICON.tickIcon}
                                  </div>
                                </Popconfirm>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>{" "}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
            <div className="row">
              <div className="col-xl-5">
                <div
                  className={`my-post-content  ${visitStyles.comboContainer3}`}
                >
                  <div className={visitStyles.combo_head_card}>
                    <div className="row">
                      <div className="col-xl-3">
                        <label>Combo Codes</label>
                      </div>
                      <div className="col-xl-3">
                        <label>Additional Codes</label>
                      </div>
                      <div className="col-xl-5">
                        <label>Description</label>
                      </div>
                      <div className="col-xl-1"></div>
                    </div>
                  </div>
                  {comboDiseaseCodesList?.length != 0 ? (
                    <div className={visitStyles.container}>
                      <div className={visitStyles.hccStickey_head}>
                        {comboDiseaseCodesList?.map((item) => {
                          return (
                            <div className={visitStyles.combo_details_card}>
                              <div className="row">
                                <div className="col-xl-3 d-grid">
                                  <span className="font-bold">
                                    {item.diagnosisCodeCombo}
                                  </span>
                                </div>
                                <div className="col-xl-3">
                                  {item.addOnCodes?.map(
                                    (addCombo, index) =>
                                      addCombo && (
                                        <span className="font-bold">
                                          <Tag color={addOnCodeColor[index]}>
                                            {addCombo}
                                          </Tag>
                                        </span>
                                      )
                                  )}
                                </div>
                                <div className="col-xl-5">
                                  <span>{item.diseaseName}</span>
                                </div>
                                <div className="col-xl-1">
                                  <div>
                                    <Popconfirm
                                      title="You want move to Invalid?"
                                      description={item.diseaseName}
                                      onConfirm={confirmComboInvalid}
                                      placement="leftTop"
                                      okText="Yes"
                                      cancelText="No"
                                      onOpenChange={() =>
                                        onchangeCombo(
                                          item.diseaseName,
                                          item.addOnCode
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
                                  {/* <Popconfirm
                                            title="You want to see the tree view?"
                                            description={item.diseaseName}
                                            onConfirm={() => {
                                              setOpens(true);
                                              
                                            }}
                                            placement="leftTop"
                                            okText="Yes"
                                            cancelText="No"
                                            onOpenChange={() => {
                                              setCombiTree(item);
                                            }}
                                          > */}
                                  <div
                                    className={visitStyles.close_icon}
                                    style={{ background: "#c7f3c6" }}
                                    onClick={() => {
                                      setOpens(true);
                                      setCombiTree([
                                        { ...item, expanded: true },
                                      ]);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faSitemap}
                                      style={{
                                        size: 8,
                                        color: "#088f39",
                                      }}
                                    />
                                  </div>
                                  {/* </Popconfirm> */}
                                </div>
                                <div className={styles.comboDetailsHeaders}>
                                  <div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getProviderNameList(item?.providerName)}
                                    </div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getEncounterDateBackgroundHcc(
                                        item.encounterDateSplit,
                                        item.diagnosisCode,
                                        "COMBO"
                                      )}
                                    </div>
                                    <div
                                      className={`${visitStyles.encounterAndSectionHeader}`}
                                    >
                                      {getCaptureSectionBackgroundFile(
                                        item?.capturedSections,
                                        item?.encounterDate,
                                        item?.diseaseName,
                                        item?.diagnosisCodeCombo
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-xl-7">
                {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                  <div
                    style={{
                      height: "80vh",
                      width: "900px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
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
                </Worker> */}

                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
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
      <Offcanvas
        onHide={handleCloseModal}
        show={isAddComboCode}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add Combo Code
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => handleCloseModal()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmitComboCode}
            >
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Combo Code <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="comboCode"
                    name="comboCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>Additional Code</Form.Label>
                  <Form.Control
                    type="text"
                    id="additionalCode"
                    name="additionalCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={handleChangeSuggested}
                    rows="5"
                    required
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
      </Offcanvas>
    </>
  );
};

export default Combo;
