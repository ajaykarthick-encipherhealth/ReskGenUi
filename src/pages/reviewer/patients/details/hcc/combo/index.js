import React, { useState, useEffect } from "react";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment from "moment";
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
import { Popconfirm, notification, Tag, Modal } from "antd";
import { SVGICON } from "../../../../../../jsx/constant/theme";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
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
const Combo = ({ activeComboTree }) => {
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
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [isAddComboCode, setIsAddComboCode] = useState(false);
  const [listPageNumber, setListPageNumber] = useState([]);
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

  useEffect(() => {
    let patientId = localStorage.getItem("patientId");
    setLocalPatientId(patientId);
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
    let orgId = localStorage.getItem("orgId");
    let tenId = localStorage.getItem("tenantId");
    let patientId = localStorage.getItem("patientId");
    getPatientDetailsFileLoad(patientId, orgId, tenId);
  }, []);

  useEffect(() => {
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
      let result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      if (result?.comboDisease) {
        let combiDisArray = [];
        if (result?.comboDisease) {
          result?.comboDisease.map((res, index) => {
            let providerList = [];
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
        let encounterDateColorsMatching = [];
        let encounterDateArr = [];

        result?.comboDisease?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr?.push({
              name: res2,
            });
          });
        });
        let encounterDateArrDublicatesRemove = getUniqueListBy(
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
      let result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      if (result.validDisease != null) {
        setPatientFileDTO(result?.fileDetailDTO);
      }
    }
  };

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

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
    let namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    let newArray = [];
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
    let newArray = [];
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

  const findValueDocuments = async (
    value,
    disDescription,
    headerNames,
    encounterDate,
    actualDescription,
    diagnosisCode
  ) => {
    setFileLoading(true);
    let fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    let splitPoint = actualDescription;
    let pageNumber = null;
    let data = {
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
      let result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.second[0] ? result?.second[0] : null;
        if (!result?.first) {
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
          headers: result?.first,
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
        headers: true,
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
    let fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    let splitPoint;
    let pageNumber = null;
    let data = {
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
      let result = response.data.response;
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
            diagnosisCode
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
    encounterDate,
    headerNames,
    actualDescription
  ) => {
    setFileLoading(true);

    let dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    let headerName = dotLoading;
    setFileModalHeader(headerName);
    setIsModalOpenCaptureSection(true);
    let fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    let splitPoint = "";
    let pageNumber = null;
    splitPoint = actualDescription;
    let data = {
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
      let result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        if (!result?.first) {
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
        headers: result?.first,
      });

      let headerName =
        patientDocumentResult.patientId +
        " / " +
        patientDocumentResult.patientName +
        " / " +
        dataset;
      setFileModalTitle(headerName);
    } catch (error) {
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
      setSearch({
        value: splitPoint,
        headers: true,
      });
      setFindFileKeyword(splitPoint);
      setFileInitialPage(null);
    }
  };
  const handleOpenModalCombinationCode = async (
    value,
    encounterDate,
    headerNames,
    actualDescription
  ) => {
    setFileLoading(true);

    let dotLoading = (
      <div className={visitStyles.loadingFileHeader}>
        <Spinner />
      </div>
    );
    let headerName = dotLoading;
    setFileModalHeader(headerName);
    setIsModalOpenCaptureSection(true);
    let fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    let splitPoint = "";
    let pageNumber = null;
    splitPoint = actualDescription.substring(" ", 20);
    let data = {
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
      let result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.pageNumber - 1 ? result?.pageNumber - 1 : null;
        splitPoint = result?.searchString;
        if (result == null) {
          return handleOpenModalCombinationCodeOld(
            value,
            encounterDate,
            headerNames,
            actualDescription
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
        let headerName =
          patientDocumentResult.patientId +
          " / " +
          patientDocumentResult.patientName +
          " / " +
          dataset;

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

  const getPatientDetailsReload = async (patientId) => {
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
    let dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      let backColor = result[0]?.backgroundColor;
      let textColor = result[0]?.sectionColor;
      let disCode = result[0]?.diagnosisCode;
      let headerNames = result[0]?.sectionName;
      let sectionMapArr = (
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
          {res}
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
    let dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      let backColor = result[0]?.backgroundColor;
      let textColor = result[0]?.sectionColor;
      let disCode = diagnosisCode;
      let headerNames = result[0]?.sectionName;

      let sectionMapArr = (
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
      let backColor = result[0]?.colors;
      let sectionMapArr = res ? (
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
      let dataset = code + " - (" + date + ")";
      let headerName =
        patientDocumentResult.patientId +
        " / " +
        patientDocumentResult.patientName +
        " / " +
        dataset;
      setFileModalTitle(headerName);

      setFileLoading(true);
      if (place == "MEAT") {
        setSelectMeatResult(meatResult);
      } else if (place == "COMBO") {
        setIsModalOpenCaptureSection(true);
      }
      let date = findPageNumber[0].date;
      if (findPageNumber[0].startPage.length != 0) {
        let pageNumber = findPageNumber[0].startPage[0].pageNumber;
        setFileInitialPage(pageNumber);
        let splitPoint = date.substring(" ", 5);
        setTargetPages((targetPage) => targetPage.pageIndex === pageNumber);
        setFindFileKeyword(splitPoint);

        setSearch({
          value: splitPoint,
          page: pageNumber,
        });
      }
    }
  };

  const getFileDosPageNumber = async () => {
    let result = fileDosPageNumberList?.result;
    let groupPageNumber = [];
    let groupEncounterDate = [];
    for (let key in result?.response) {
      let optionArray = [];
      let optionPage = [];
      let pageNumbervalue = result.response[key];
      for (let key2 in pageNumbervalue) {
        let startPage = key2 == "first" ? pageNumbervalue[key2] : null;
        let keyValue = key2 == "first" ? "Start - " : "End - ";
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

  const getProviderNameList = (data) => {
    let dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res) => {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == res
      );
      let backColor = result[0]?.backgroundColor;
      let textColor = result[0]?.sectionColor;

      let sectionMapArr = (
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

  const addComboCode = () => {
    setIsAddComboCode(true);
  };

  const handleSubmitComboCode = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      let updateDataformat = {
        patientId: localPatientId,
        dosYear: "",
        comboCode: inputValue.comboCode,
        additionalCode: inputValue.additionalCode,
        description: inputValue.description,
      };
      let result = await manuallyAddComboCode(updateDataformat);
      if (result.status == "SUCCESS") {
        setIsAddComboCode(false);
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getPatientDetailsReload(localPatientId);
      }

      setValidated(true);
    }
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  useEffect(() => {
    if (activeComboTree) {
      comboDiseaseCodesList?.map((item) => {
        if (
          item.diagnosisCodeCombo.replace(".", "") ==
          activeComboTree.diagnosisCode.replace(".", "")
        ) {
          setOpens(true);
          setCombiTree([{ ...item, expanded: true }]);
        }
      });
    }
  }, [activeComboTree]);

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
                    <label htmlFor="combo">Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label htmlFor="additional">Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label htmlFor="description">Description</label>
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
                        <div
                          className={visitStyles.combo_details_card}
                          key={item?.id}
                        >
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
                                    <span
                                      className="font-bold"
                                      key={addOnCodeColor[index]}
                                    >
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
                    <label htmlFor="combo">Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label htmlFor="additional">Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label htmlFor="description">Description</label>
                  </div>
                </div>
              </div>
              {invalidComboDiseaseCodesList?.length != 0 ? (
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
                  </div>
                </div>
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
                        <label htmlFor="combo">Combo Codes</label>
                      </div>
                      <div className="col-xl-3">
                        <label htmlFor="additional">Additional Codes</label>
                      </div>
                      <div className="col-xl-5">
                        <label htmlFor="description">Description</label>
                      </div>
                      <div className="col-xl-1"></div>
                    </div>
                  </div>
                  {comboDiseaseCodesList?.length != 0 ? (
                    <div className={visitStyles.container}>
                      <div className={visitStyles.hccStickey_head}>
                        {comboDiseaseCodesList?.map((item) => {
                          return (
                            <div
                              className={visitStyles.combo_details_card}
                              key={item?.id}
                            >
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
                                        <span
                                          className="font-bold"
                                          key={addOnCodeColor[index]}
                                        >
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
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
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
