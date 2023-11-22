import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav, Badge } from "react-bootstrap";
import NavBar from "../../../../jsx/layouts/nav/Header";
import { useSelector } from "react-redux";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import LoadingSpinner from "../../../../jsx/components/spinner/spinner";
import visitStyles from "../../../../styles/visitdata.module.css";

import { Viewer, Worker, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faCheck,
  faAdd,
  faInfo,
  faIdBadge,
  faUser,
  faSearch,
  faCalendar,
  faCheckCircle,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Divider, Popover } from "antd";
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
import Select from "react-select";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import { Space, Spin } from "antd";
// import { searchPlugin ,NextIcon, PreviousIcon, RenderSearchProps,} from '@react-pdf-viewer/search';
import { Icon, MinimalButton, Position, Tooltip } from "@react-pdf-viewer/core";
import {
  NextIcon,
  PreviousIcon,
  RenderSearchProps,
  searchPlugin,
} from "@react-pdf-viewer/search";
import Form from "react-bootstrap/Form";
import { Offcanvas } from "react-bootstrap";
import { InfoCircleOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { notification } from "antd";

export default function PatientDetails() {
  let searchKeywords = [];

  // const searchPluginInstance = searchPlugin({
  //   // keyword: [
  //   //   'document',
  //   //   {
  //         keyword: 'Assessment',
  //         matchCase: true,
  //     // },
  // // ],
  // })

  const searchPluginInstance = searchPlugin({
    // keyword: 'Plan / Discussion',
    matchCase: true,
    wholeWords: true,
  });
  const { highlight, Search } = searchPluginInstance;
  const { ShowSearchPopoverButton } = searchPluginInstance;
  const [searchPluginInstanceLocal, setSearchPluginInstanceLocal] =
    useState(searchPluginInstance);

  const sideMenu = useSelector((state) => state.sideMenu);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenValid, setIsModalOpenValid] = useState(false);
  const [isModalOpenValidCodes, setIsModalOpenValidCodes] = useState(false);
  const [isModalOpenCaptureSection, setIsModalOpenCaptureSection] =
    useState(false);
  const [confirmNotesModalDecline, setConfirmNotesModalDecline] =
    useState(false);
  const [confirmNotesModalHold, setConfirmNotesModalHold] = useState(false);

  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [confirmNotesModalInValid, setConfirmNotesModalInValid] =
    useState(false);

  const storePatientDetails = useSelector(
    (state) => state.patientDetails.patientDetails
  );
  const storeDetails = useSelector((state) => state);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSection, setIsLoadingSection] = useState(true);
  const [invalidDiseasesList, setInvalidDiseasesList] = useState([]);
  const [invalidMoveDiseasesList, setInvalidMoveDiseasesList] = useState([]);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] =
    useState([]);

  const [validDiseasesList, setValidDiseasesList] = useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectCode, setSelectCode] = useState("");
  const [dosYear, setDosYear] = useState("");
  const [dosYearRadiology, setDosYearRadiology] = useState("");
  const [dosYearDefalutSelect, setDosYearDefalutSelect] = useState("");
  const [dosYearDefalutSelectRadiology, setDosYearDefalutSelectRadiology] =
    useState("");
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [selectMeatFileId, setSelectMeatFileId] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [selectFileURLValid, setSelectFileURLValid] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rafScore, setRAFScore] = useState([]);
  const [patientDetails, setPatientDetails] = useState([]);
  const [patientDetailsRadiology, setPatientDetailsRadiology] = useState([]);

  const [rafHccList, setRafScoreHccList] = useState([]);
  const [isMatchBtn, setIsMatchBtn] = useState(false);
  const [matchHccList, setMatchHccList] = useState([]);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [newInValidDiseaseList, setInNewValidDiseaseList] = useState([]);
  const [unMatchResList, setNewUnMatchHccList] = useState([]);
  const [meatColorCodeList, setMeatColorCodeList] = useState([]);

  const [dbDescriptionRes, setDbDescriptionRes] = useState([]);

  const [openPopover, setOpenPopover] = useState(false);

  const [activeTab, setActiveTab] = useState(1);
  const [activeTabHead, setActiveTabHead] = useState("validDiseases");

  const [unmatchHccListRadiology, setUnMatchHccListRadiology] = useState([]);
  const [newValidDiseaseListRadiology, setNewValidDiseaseListRadiology] =
    useState([]);
  const [newInValidDiseaseListRadiology, setInNewValidDiseaseListRadiology] =
    useState([]);
  const [comboDiseaseCodesListRadiology, setComboDiseaseCodesListRadiology] =
    useState([]);
  const [meatCriteriaListRadiology, setMeatCriteriaListRadiology] = useState(
    []
  );
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
  const [radiologyResCheck, setRadiologyResCheck] = useState(false);
  const [radiologyFileProcessing, setRadiologyFileProcessing] = useState(
    "Please wait file processing..."
  );

  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [labReportSlider, setLapReportSlider] = useState(false);
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    notes: "",
    diagnosisCode: "",
    actualDescription: '',
    capturedSections: '',
    encodedDate: "",
  });

  const [selectFileRadiology, setSelectFileRadiology] = useState(null);
  const [selectLabReportFile, setSelectLabReportFile] = useState(null);

  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");

  const [validHccDetails, setvalidHccDetails] = useState("");
  const [validLocalFileDownloadAndView, setValidLocalFileDownloadAndView] =
    useState([]);

  const [unMatchListNonHcc, setUnmatchListNonHcc] = useState([]);
  const [comboDiseaseCodesListNonHcc, setComboDiseaseCodesListNonHcc] =
    useState([]);
  const [meatCriteriaListNonHcc, setMeatCriteriaListNonHcc] = useState([]);
  const [yearOfServiceList, setYearOfServiceList] = useState([]);
  const [isLoadingDos, setIsLoadingDos] = useState(true);
  const [suggestedModal, setSuggestedModal] = useState(false);
  const [suggesteSelectValue, setSuggestedSelectValue] = useState("");
  const [suggesteSelectCode, setSuggestedSelectCode] = useState("");
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [suggestedBtnTitle, setSuggestedBtnTitle] = useState("Add");
  const [selectInvalidDetails, setSelectInvalidDetails] = useState(false);
  const [selectActiveCode, setSelectActiveCode] = useState("");
  const [labReportValidList, setLabReportValidList] = useState([]);
  const [labReportFile, setLabReportFile] = useState([]);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [suggestedNonHccList, setSuggestedNonHccList] = useState([]);
  const [nonHccActiveCodes, setNonHccActiveCodes] = useState(false);
  const [radiologyFileDateofServieList, setFileRadiologyDateofServiceList] =
    useState([]);
  const [radiologyFileDateDefaulteSelect, setRadiologyFileDateDefaulteSelect] =
    useState("");
  const [radiologyResult, setRadiologyResult] = useState("");
  const [radiologyResultStatus, setRadiologyResultStatus] = useState(false);
  const [labResultStatus, setLabResultStatus] = useState(false);
  const [labFileDateofServieList, setFileLabDateofServiceList] = useState([]);
  const [labFileDateDefaulteSelect, setLabFileDateDefaulteSelect] =
    useState("");
  const [labResult, setLabResult] = useState("");
  const [labFileDosList, setLabFileDosList] = useState([]);
  const [labFileDosListDefaultSelect, setLabFileDosListDefaultSelect] =
    useState([]);
  const [saveBtnTitle, setSaveBtnTitle] = useState("Save");
  const [completedBtnTitle, setCompleteBtnTitle] = useState("Complete");
  const [declineBtnTitle, setDeclineBtnTitle] = useState("Decline");

  const [suggestRadiology, setSuggestRadiology] = useState([]);
  const [suggestLab, setSuggestLab] = useState([]);

  const [buttonClicked, setButtonClicked] = useState(false);
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [isValidAction, setIsValidAction] = useState('');
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [isModalComments, setIsModalComments] = useState(false);
  const [flagContainerActive, setFlagContainerActive] = useState("");



  const handleAddButtonClick = () => {
    setIsAddButtonClicked(true);
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value)
    }

    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const hidePopover = () => {
    setOpenPopover(false);
  };

  const handleOpenChangePopover = (newOpen) => {
    setOpenPopover(newOpen);
  };

  //   highlight([
  //     'document',
  //     {
  //         keyword: 'PDF',
  //         matchCase: true,
  //     },
  // ]);

  const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
  const handleDocumentLoad = () => {
    setDocumentLoaded(true);
    // setTimeout(() => {
    //   highlight({
    //     keyword: selectDiseasesName,
    //     matchCase: true,
    //   });
    // }, 6000);
  };

  const changeSearch = () => {
    //   searchPlugin({
    //     keyword: 'BMP',
    //     matchCase: true,
    // });
    setDocumentLoaded(true);
    setTimeout(() => {
      highlight({
        keyword: "BMP",
        matchCase: true,
      });
    }, 1000);
  };

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    setLocalOrgId(orgId);
    getPatientDetails(orgId, tenId);
    // getPatientDetailsRadiology(orgId, tenId);
    setLocalTenantId(tenId);

    var uId = localStorage.getItem("userId");
    setLocalUserId(uId);
    var patientId = localStorage.getItem("patientId");
    setLocalPatientId(patientId);

    //   if (isDocumentLoaded) {
    //     enableShortcuts({
    //         keyword: 'Coverage for Jeffrey She',
    //         matchCase: true,
    //     });
    // }
  }, []);

  const getYearOfService = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
    }
  };

  const submitYearOfService = async (year) => {
    var data = {
      yearOfService: year,
    };

    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc + `aiservice/ai/upload`,
      data
    );
  };

  const getYearOfServiceDetails = async (year) => {
    var patientId = localStorage.getItem("patientId");
    // const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
    // if (response.data) {
    //   if(response.data != null){
    //   }else{
    //    submitYearOfService(year)
    //   }
    // }
  };

  const getPatientDetails = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    // const response = await axios.get(ENDPOINTS.apiEndoint + "dbservice/patient/compute/get?patientid=ambal&orgid=ambal");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
      var result = response.data;
      setPatientDetails(result);
      if (result.validDisease != null) {
        var validDis = "";
        var invalidDis = "";
        var comboDis = "";
        var meatCri = "";
        var dosYearArr = [];
        var rafScore = null;
        var validDiseaseNewRes = [];
        var invalidDiseaseNewRes = [];
        var unMatchRes = [];
        var unMatchResHcc = [];
        var unMatchResNonHcc = [];
        var meatCriColorTagList = [];

        var suggestRadiologyList = [];
        var suggestLabList = [];

        var suggestListAll = [];
        var suggestListAllNonHcc = [];
        var deleteHccList = [];

        getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId);
        setSelectMeatFileId(response.data.fileId);
        setPatientDocumentResult(result);

        result.encounterYears.map((res) => {
          dosYearArr.push({ value: res, label: res });
        })

        // const highestDOS = Math.max(...dosYearArr.map((res) => res.value));
        // setSelectedDosValue(highestDOS);

        // const highestDosValue = dosYearArr.filter(
        //   (i) => parseInt(i.value) === highestDOS
        // );
        setDosYearDefalutSelect(dosYearArr[0]);

        console.log(dosYearArr)

        if (result.rafScore != null) {
          rafScore = result.rafScore;
        }

        var unMacthResList = [];

        validDis = result.validDisease;
        validDiseaseNewRes = result.validDisease;
        invalidDiseaseNewRes = result.invalidDisease;
        if (result.deletedDiseases != null) {
          deleteHccList = result.deletedDiseases;

        }
        if (result.suggestRadiology != null) {
          // var checkDosRadio = [];
          // for (var key in result.suggestRadiology) {
          //   checkDosRadio.push({ value: key, label: key });
          // }
          suggestRadiologyList = result.suggestRadiology;
          suggestRadiologyList.map((res, index) => {
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              getPlace: "Radio",
              isHccValid: true,
            });
          });
        }

        if (result.suggestLab != null) {
          suggestLabList = result.suggestLab;
          suggestLabList.map((res, index) => {
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              getPlace: "Lab",
              isHccValid: true,
            });
          });
        }

        if (result.unMatchedDisease != null) {

          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            if (res.isHccValid == true) {
              suggestListAll.push({
                actualDescription: res.actualDescription,
                diagnosisCodeFinding: res.diagnosisCodeFinding,
                isHccValid: res.isHccValid,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCodeFinding,
                encounterDate: res.encounterDate,
                getPlace: "Hcc",
              });
            } else {
              // suggestListAll.push({
              //   actualDescription: res.actualDescription,
              //   diagnosisCodeFinding: res.diagnosisCodeFinding,
              //   isHccValid: res.isHccValid,
              //   capturedSections: res.capturedSections,
              //   diagnosisCode: res.diagnosisCodeFinding,
              //   encounterDate: res.encounterDate,
              //   getPlace: "Hcc",
              // });
              suggestListAllNonHcc.push({
                actualDescription: res.actualDescription,
                diagnosisCodeFinding: res.diagnosisCodeFinding,
                isHccValid: res.isHccValid,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCodeFinding,
                encounterDate: res.encounterDate,
                getPlace: "Hcc",
              });
            }
          });
        }


        invalidDis = result.invalidDisease;
        comboDis = result.comboDisease;
        meatCri = result.meatCriteria;

        // validDiseaseNewRes = validDiseaseNew[2019]

        var invalidDiseasesArray = [];
        var validDiseasesArray = [];

        for (var key in invalidDis) {
          invalidDiseasesArray.push({ name: invalidDis[key] });
        }
        for (var key in validDis) {
          validDiseasesArray.push({ name: validDis[key] });
        }

        // for (var key in result.validDisease) {
        //   validDis = result.validDisease[key];
        //   if (result.rafScore != null) {
        //     rafScore = result.rafScore[key]
        //   }
        // }
        // for (var key in result.invalidDisease) {
        //   invalidDis = result.invalidDisease[key];
        // }
        // for (var key in result.comboDisease) {
        //   comboDis = result.comboDisease[key];
        // }
        // for (var key in result.meatCriteria) {
        //   meatCri = result.meatCriteria[key];
        // }

        // var invalidDiseasesArray = [];
        // var validDiseasesArray = [];

        // for (var key in invalidDis) {
        //   invalidDiseasesArray.push({ name: invalidDis[key] });
        // }
        // for (var key in validDis) {
        //   validDiseasesArray.push({ name: validDis[key] });
        // }

        setNewValidDiseaseList(validDiseaseNewRes);
        setInNewValidDiseaseList(invalidDiseaseNewRes);
        setNewUnMatchHccList(suggestListAll);
        setValidDiseasesList(validDiseasesArray);
        setInvalidDiseasesList(invalidDiseasesArray);
        setComboDiseaseCodesList(comboDis);
        // setMeatCriteriaList(meatCri);
        setDosYear(dosYearArr);
        setRAFScore(rafScore);
        console.log(suggestListAllNonHcc)
        setSuggestedNonHccList(suggestListAllNonHcc);
        setSuggestedHccList(suggestListAll);
        setDeletedHccList(deleteHccList)

        const COLORS = [
          "bg-bg-seven",
          "bg-third",
          "bg-bg-four",
          "bg-bg-five",
          "bg-bg-six",
          "bg-bg-eight",
          "bg-bg-nine",
          "bg-bg-ten",
          "bg-bg-leven",
        ];

        var meatListArr = [];
        var meatMoniterHead = [];
        var meatEvaluteHead = [];
        var meatAssesmentHead = [];
        var meatTreatMentHead = [];
        var allMeatHead = [];
        var allMeatHeadColorArr = [];
        var allMeatHeadColor = [];
        var dublicateRemoveSecondArr = [];
        var nonHccMeatListArr = [];

        meatCri.map((res, index) => {
          if (res.monitorCapturedFromHeader != "") {
            meatMoniterHead.push({
              header: res.monitorCapturedFromHeader,
            });
          }
          if (res.evaluateCapturedFromHeader != "") {
            meatEvaluteHead.push({
              header: res.evaluateCapturedFromHeader,
            });
          }
          if (res.assessmentCapturedFromHeader != "") {
            meatAssesmentHead.push({
              header: res.assessmentCapturedFromHeader,
            });
          }
          if (res.treatmentCapturedFromHeader != "") {
            meatTreatMentHead.push({
              header: res.treatmentCapturedFromHeader,
            });
          }
          var newArray = [];
          newArray = [
            ...allMeatHead,
            ...meatMoniterHead,
            ...meatEvaluteHead,
            ...meatAssesmentHead,
            ...meatTreatMentHead,
          ];
          var dublicateRemoveArr = getUniqueListBy(newArray, "header");
          dublicateRemoveArr.map((res3, index) => {
            allMeatHeadColor.push({
              header: res3.header,
              color: COLORS[index],
            });
          });
          allMeatHeadColorArr = allMeatHeadColor;

          dublicateRemoveSecondArr = getUniqueListBy(
            allMeatHeadColor,
            "header"
          );
          setMeatColorCodeList(dublicateRemoveSecondArr);
        });

        meatCri.map((res, index) => {
          if (res.category == "Invalid") {
            nonHccMeatListArr.push({
              diagnosisCode: res.diagnosisCode,
              diseaseName: res.diseaseName,
              monitorCapturedFromHeader: res.monitorCapturedFromHeader,
              assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
              evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
              treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
              monitorCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.monitorCapturedFromHeader
              ),
              assessmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.assessmentCapturedFromHeader
              ),
              evaluateCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.evaluateCapturedFromHeader
              ),
              treatmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.treatmentCapturedFromHeader
              ),
              monitorColor: COLORS[index],
              meatColor: COLORS[index],
              assessment: res.assessment,
              monitor: res.monitor,
              evaluate: res.evaluate,
              treatment: res.treatment,
              isMeatCriteriaPresent: res.isMeatCriteriaPresent,
              category: res.category,
            });
          } else {
            meatListArr.push({
              diagnosisCode: res.diagnosisCode,
              diseaseName: res.diseaseName,
              monitorCapturedFromHeader: res.monitorCapturedFromHeader,
              assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
              evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
              treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
              monitorCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.monitorCapturedFromHeader
              ),
              assessmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.assessmentCapturedFromHeader
              ),
              evaluateCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.evaluateCapturedFromHeader
              ),
              treatmentCapturedFromHeaderColor: colorCodeMatch(
                dublicateRemoveSecondArr,
                res.treatmentCapturedFromHeader
              ),
              monitorColor: COLORS[index],
              meatColor: COLORS[index],
              assessment: res.assessment,
              monitor: res.monitor,
              evaluate: res.evaluate,
              treatment: res.treatment,
              isMeatCriteriaPresent: res.isMeatCriteriaPresent,
              category: res.category,
            });
          }
        });
        setMeatCriteriaList(meatListArr);
        setMeatCriteriaListNonHcc(nonHccMeatListArr);
        setIsLoadingDos(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const getPatientDetailsRadiology = async (orgId, tenId) => {
    // setIsLoadingDos(true);
    var patientId = localStorage.getItem("patientId");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
      setRadiologyResCheck(true);
      var result = response.data;
      if (result.radiologyFileDetail != null) {
        getPatientPdfFileRadiology(
          result.radiologyFileDetail.azureBlobPath,
          tenId
        );
      }
      if (result.validDisease != null) {
        setNewValidDiseaseListRadiology(result.validDisease);
      }
      if (result.invalidDisease != null) {
        setInNewValidDiseaseListRadiology(result.invalidDisease);
      }

      if (result.comboDisease != null) {
        setComboDiseaseCodesListRadiology(result.comboDisease);
      }
      if (result.meatCriteria != null) {
        var meatCri = result.meatCriteria;

        const COLORS = [
          "bg-bg-seven",
          "bg-third",
          "bg-bg-four",
          "bg-bg-five",
          "bg-bg-six",
          "bg-bg-eight",
          "bg-bg-nine",
          "bg-bg-ten",
          "bg-bg-leven",
        ];

        var meatListArr = [];
        var meatMoniterHead = [];
        var meatEvaluteHead = [];
        var meatAssesmentHead = [];
        var meatTreatMentHead = [];
        var allMeatHead = [];
        var allMeatHeadColorArr = [];
        var allMeatHeadColor = [];
        var dublicateRemoveSecondArr = [];

        meatCri.map((res, index) => {
          if (res.monitorCapturedFromHeader != "") {
            meatMoniterHead.push({
              header: res.monitorCapturedFromHeader,
            });
          }
          if (res.evaluateCapturedFromHeader != "") {
            meatEvaluteHead.push({
              header: res.evaluateCapturedFromHeader,
            });
          }
          if (res.assessmentCapturedFromHeader != "") {
            meatAssesmentHead.push({
              header: res.assessmentCapturedFromHeader,
            });
          }
          if (res.treatmentCapturedFromHeader != "") {
            meatTreatMentHead.push({
              header: res.treatmentCapturedFromHeader,
            });
          }
          var newArray = [];
          newArray = [
            ...allMeatHead,
            ...meatMoniterHead,
            ...meatEvaluteHead,
            ...meatAssesmentHead,
            ...meatTreatMentHead,
          ];
          var dublicateRemoveArr = getUniqueListBy(newArray, "header");
          dublicateRemoveArr.map((res3, index) => {
            allMeatHeadColor.push({
              header: res3.header,
              color: COLORS[index],
            });
          });
          allMeatHeadColorArr = allMeatHeadColor;

          dublicateRemoveSecondArr = getUniqueListBy(
            allMeatHeadColor,
            "header"
          );
          setMeatColorCodeList(dublicateRemoveSecondArr);
        });

        meatCri.map((res, index) => {
          meatListArr.push({
            diagnosisCode: res.diagnosisCode,
            diseaseName: res.diseaseName,
            monitorCapturedFromHeader: res.monitorCapturedFromHeader,
            assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
            evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
            treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
            monitorCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.monitorCapturedFromHeader
            ),
            assessmentCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.assessmentCapturedFromHeader
            ),
            evaluateCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.evaluateCapturedFromHeader
            ),
            treatmentCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.treatmentCapturedFromHeader
            ),
            monitorColor: COLORS[index],
            meatColor: COLORS[index],
            assessment: res.assessment,
            monitor: res.monitor,
            evaluate: res.evaluate,
            treatment: res.treatment,
            isMeatCriteriaPresent: res.isMeatCriteriaPresent,
          });
        });
        setMeatCriteriaListRadiology(meatListArr);
        setIsLoadingDos(false);

        // setMeatCriteriaListRadiology(result.meatCriteria)
      }
      if (result.unmatchedDisease != null) {
        setUnMatchHccListRadiology(result.unmatchedDisease);
      }
      // setPatientDetails(result);
    }
  };
  const getPatientDetailsRadiologyYear = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    var testresult = {
      patientId: "uvais-10",
      patientName: "uvais",
      fileId: "[fe5e4bcc-e61d-49ee-9292-8c5d9e3293e8]",
      orgId: "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
      tenantId: "b4d34e42-79a6-478e-b3af-12ce7311fa09",
      validDisease: {
        "06/03/2023": [
          {
            diagnosisCode: "I65.23",
            actualDescription:
              "Mild stenosis in the right internal carotid artery",
            dbDescription:
              "Occlusion and stenosis of bilateral carotid arteries",
            notes: null,
            capturedSections: ["Right Findings"],
            encounterDate: "05/09/2023",
          },
          {
            diagnosisCode: "I65.23",
            actualDescription:
              "Mild stenosis in the left internal carotid artery",
            dbDescription:
              "Occlusion and stenosis of bilateral carotid arteries",
            notes: null,
            capturedSections: ["Left Findings"],
            encounterDate: "05/09/2023",
          },
        ],
      },
      invalidDisease: {
        "06/03/2023": [],
      },
      unmatchedDisease: {
        "06/03/2023": [],
      },
      comboDisease: {
        "06/03/2023": [],
      },
      meatCriteria: {
        "06/03/2023": [
          {
            diseaseName: "Mild stenosis in the right internal carotid artery",
            diagnosisCode: "I65.23",
            isMeatCriteriaPresent: true,
            monitorCapturedFromHeader: "Right Findings",
            monitor:
              "Doppler flow velocities in the right internal carotid artery (ICA)",
            evaluateCapturedFromHeader: "Right Findings",
            evaluate: "Stenosis in the range of 1-39% with mild plaque",
            assessmentCapturedFromHeader: "Right Findings",
            assessment: "Mild stenosis in the right internal carotid artery",
            treatmentCapturedFromHeader: "Not specified",
            treatment: "Not specified",
            category: null,
          },
          {
            diseaseName: "Mild stenosis in the left internal carotid artery",
            diagnosisCode: "I65.23",
            isMeatCriteriaPresent: true,
            monitorCapturedFromHeader: "Left Findings",
            monitor:
              "Doppler flow velocities in the left internal carotid artery (ICA)",
            evaluateCapturedFromHeader: "Left Findings",
            evaluate: "Stenosis in the range of 1-39% with mild plaque",
            assessmentCapturedFromHeader: "Left Findings",
            assessment: "Mild stenosis in the left internal carotid artery",
            treatmentCapturedFromHeader: "Not specified",
            treatment: "Not specified",
            category: null,
          },
        ],
      },
      radiologyFileDetail: {
        "06/03/2023": [
          {
            createdAt: "11/9/23, 10:29 AM",
            version: 0,
            updatedAt: "11/9/23, 10:29 AM",
            createdBy: null,
            updatedBy: null,
            active: false,
            fileId: "fe5e4bcc-e61d-49ee-9292-8c5d9e3293e8",
            patientId: "uvais-10",
            userId: "uvais01@encipherhealth.onmicrosoft.com",
            orgId: "daa95f13-8b1d-4dc3-8d1c-c15d192c6cd5",
            dos: "06/03/2023",
            tenantId: "b4d34e42-79a6-478e-b3af-12ce7311fa09",
            fileName: "consult.pdf",
            azureBlobPath: "fe5e4bcc-e61d-49ee-9292-8c5d9e3293e8.pdf",
          },
        ],
      },
    };
    // setRadiologyResult(testresult);
    // var result = testresult;
    // if (result.validDisease != null) {
    //   var validDis = '';
    //   var invalidDis = '';
    //   var comboDis = '';
    //   var meatCri = '';
    //   var dosYearArr = [];
    //   var dosYearArrFile = [];
    //   var validDiseaseNewRes = [];
    //   var invalidDiseaseNewRes = [];
    //   var unMatchRes = [];
    //   // getPatientPdfFileRadiology(result.radiologyFileDetail.azureBlobPath, tenId);
    //   // getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId)

    //   for (var key in result.validDisease) {
    //     dosYearArr.push({ value: key, label: key });
    //   }

    //   var dateofService = dosYearArr[0].value;

    //   const highestDOS = Math.max(...dosYearArr.map(res => res.value));

    //   const highestDosValue = dosYearArr.filter((i) => parseInt(i.value) === highestDOS);
    //   setDosYearDefalutSelectRadiology(dosYearArr[0]);

    //   if (result.radiologyFileDetail != null) {
    //     for (var key in result.radiologyFileDetail) {
    //       dosYearArrFile.push({ value: key, label: key });
    //     }
    //     var fileDetails = result.radiologyFileDetail[dateofService];
    //     setRadiologyFileDateDefaulteSelect(dosYearArrFile[0])
    //     getPatientPdfFileRadiology(fileDetails[0].azureBlobPath, tenId);
    //   }

    //   validDis = result.validDisease[dateofService];
    //   validDiseaseNewRes = result.validDisease[dateofService];
    //   invalidDiseaseNewRes = result.invalidDisease[dateofService];
    //   if (result.unmatchedDisease != null) {
    //     var unMatchResCheck = result.unmatchedDisease[dateofService]

    //     if (unMatchResCheck != null) {
    //       unMatchRes = result.unmatchedDisease[dateofService]

    //     }
    //   }

    //   invalidDis = result.invalidDisease[dateofService];
    //   comboDis = result.comboDisease[dateofService];
    //   meatCri = result.meatCriteria[dateofService];

    //   setNewValidDiseaseListRadiology(validDiseaseNewRes);
    //   setInNewValidDiseaseListRadiology(invalidDiseaseNewRes);
    //   setUnMatchHccListRadiology(unMatchRes)
    //   setComboDiseaseCodesListRadiology(comboDis);
    //   setDosYearRadiology(dosYearArr);
    //   setFileRadiologyDateofServiceList(dosYearArrFile)

    //   const COLORS = ['bg-bg-seven', 'bg-third', 'bg-bg-four', 'bg-bg-five', 'bg-bg-six', 'bg-bg-eight', 'bg-bg-nine', 'bg-bg-ten', 'bg-bg-leven'];

    //   var meatListArr = [];
    //   var meatMoniterHead = [];
    //   var meatEvaluteHead = [];
    //   var meatAssesmentHead = [];
    //   var meatTreatMentHead = [];
    //   var allMeatHead = [];
    //   var allMeatHeadColorArr = [];
    //   var allMeatHeadColor = [];
    //   var dublicateRemoveSecondArr = [];

    //   meatCri.map((res, index) => {
    //     if (res.monitorCapturedFromHeader != "") {
    //       meatMoniterHead.push({
    //         header: res.monitorCapturedFromHeader,
    //       })
    //     }
    //     if (res.evaluateCapturedFromHeader != "") {
    //       meatEvaluteHead.push({
    //         header: res.evaluateCapturedFromHeader
    //       })
    //     }
    //     if (res.assessmentCapturedFromHeader != "") {
    //       meatAssesmentHead.push({
    //         header: res.assessmentCapturedFromHeader
    //       })
    //     }
    //     if (res.treatmentCapturedFromHeader != "") {
    //       meatTreatMentHead.push({
    //         header: res.treatmentCapturedFromHeader
    //       });
    //     }
    //     var newArray = [];
    //     newArray = [...allMeatHead, ...meatMoniterHead, ...meatEvaluteHead, ...meatAssesmentHead, ...meatTreatMentHead];
    //     var dublicateRemoveArr = getUniqueListBy(newArray, 'header');
    //     dublicateRemoveArr.map((res3, index) => {

    //       allMeatHeadColor.push({
    //         header: res3.header,
    //         color: COLORS[index]
    //       })
    //     })
    //     allMeatHeadColorArr = allMeatHeadColor;

    //     dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, 'header');
    //     setMeatColorCodeList(dublicateRemoveSecondArr)
    //   })

    //   meatCri.map((res, index) => {
    //     meatListArr.push({
    //       diagnosisCode: res.diagnosisCode,
    //       diseaseName: res.diseaseName,
    //       monitorCapturedFromHeader: res.monitorCapturedFromHeader,
    //       assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
    //       evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
    //       treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
    //       monitorCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.monitorCapturedFromHeader),
    //       assessmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.assessmentCapturedFromHeader),
    //       evaluateCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.evaluateCapturedFromHeader),
    //       treatmentCapturedFromHeaderColor: colorCodeMatch(dublicateRemoveSecondArr, res.treatmentCapturedFromHeader),
    //       monitorColor: COLORS[index],
    //       meatColor: COLORS[index],
    //       assessment: res.assessment,
    //       monitor: res.monitor,
    //       evaluate: res.evaluate,
    //       treatment: res.treatment,
    //       isMeatCriteriaPresent: res.isMeatCriteriaPresent,
    //     })
    //   })
    //   setMeatCriteriaListRadiology(meatListArr);
    //   setIsLoadingDos(false);

    // }
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`
    );
    // const response = await axios.get(ENDPOINTS.apiEndoint + `dbservice/patient/compute/get?patientid=${patientId}&orgid=${orgId}`);
    if (response.data) {
      var result = response.data;
      setPatientDetailsRadiology(result);
      setRadiologyResult(result);
      if (result.validDisease != null) {
        var validDis = "";
        var invalidDis = "";
        var comboDis = "";
        var meatCri = "";
        var dosYearArr = [];
        var dosYearArrFile = [];
        var validDiseaseNewRes = [];
        var invalidDiseaseNewRes = [];
        var unMatchRes = [];
        // getPatientPdfFileRadiology(result.radiologyFileDetail.azureBlobPath, tenId);
        // getPatientPdfFile(result.fileDetailDTO.azureBlobPath, tenId)

        for (var key in result.validDisease) {
          dosYearArr.push({ value: key, label: key });
        }

        var dateofService = dosYearArr[0].value;

        const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

        const highestDosValue = dosYearArr.filter(
          (i) => parseInt(i.value) === highestDOS
        );
        setDosYearDefalutSelectRadiology(dosYearArr[0]);

        if (result.radiologyFileDetail != null) {
          for (var key in result.radiologyFileDetail) {
            dosYearArrFile.push({ value: key, label: key });
          }
          var fileDetails = result.radiologyFileDetail[dateofService];
          setRadiologyFileDateDefaulteSelect(dosYearArrFile[0]);
          getPatientPdfFileRadiology(fileDetails[0].azureBlobPath, tenId);
        }

        validDis = result.validDisease[dateofService];
        validDiseaseNewRes = result.validDisease[dateofService];
        invalidDiseaseNewRes = result.invalidDisease[dateofService];
        if (result.unmatchedDisease != null) {
          var unMatchResCheck = result.unmatchedDisease[dateofService];

          if (unMatchResCheck != null) {
            unMatchRes = result.unmatchedDisease[dateofService];
          }
        }

        invalidDis = result.invalidDisease[dateofService];
        comboDis = result.comboDisease[dateofService];
        meatCri = result.meatCriteria[dateofService];

        setNewValidDiseaseListRadiology(validDiseaseNewRes);
        setInNewValidDiseaseListRadiology(invalidDiseaseNewRes);
        setUnMatchHccListRadiology(unMatchRes);
        setComboDiseaseCodesListRadiology(comboDis);
        setDosYearRadiology(dosYearArr);
        setFileRadiologyDateofServiceList(dosYearArrFile);

        const COLORS = [
          "bg-bg-seven",
          "bg-third",
          "bg-bg-four",
          "bg-bg-five",
          "bg-bg-six",
          "bg-bg-eight",
          "bg-bg-nine",
          "bg-bg-ten",
          "bg-bg-leven",
        ];

        var meatListArr = [];
        var meatMoniterHead = [];
        var meatEvaluteHead = [];
        var meatAssesmentHead = [];
        var meatTreatMentHead = [];
        var allMeatHead = [];
        var allMeatHeadColorArr = [];
        var allMeatHeadColor = [];
        var dublicateRemoveSecondArr = [];

        meatCri.map((res, index) => {
          if (res.monitorCapturedFromHeader != "") {
            meatMoniterHead.push({
              header: res.monitorCapturedFromHeader,
            });
          }
          if (res.evaluateCapturedFromHeader != "") {
            meatEvaluteHead.push({
              header: res.evaluateCapturedFromHeader,
            });
          }
          if (res.assessmentCapturedFromHeader != "") {
            meatAssesmentHead.push({
              header: res.assessmentCapturedFromHeader,
            });
          }
          if (res.treatmentCapturedFromHeader != "") {
            meatTreatMentHead.push({
              header: res.treatmentCapturedFromHeader,
            });
          }
          var newArray = [];
          newArray = [
            ...allMeatHead,
            ...meatMoniterHead,
            ...meatEvaluteHead,
            ...meatAssesmentHead,
            ...meatTreatMentHead,
          ];
          var dublicateRemoveArr = getUniqueListBy(newArray, "header");
          dublicateRemoveArr.map((res3, index) => {
            allMeatHeadColor.push({
              header: res3.header,
              color: COLORS[index],
            });
          });
          allMeatHeadColorArr = allMeatHeadColor;

          dublicateRemoveSecondArr = getUniqueListBy(
            allMeatHeadColor,
            "header"
          );
          setMeatColorCodeList(dublicateRemoveSecondArr);
        });

        meatCri.map((res, index) => {
          meatListArr.push({
            diagnosisCode: res.diagnosisCode,
            diseaseName: res.diseaseName,
            monitorCapturedFromHeader: res.monitorCapturedFromHeader,
            assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
            evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
            treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
            monitorCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.monitorCapturedFromHeader
            ),
            assessmentCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.assessmentCapturedFromHeader
            ),
            evaluateCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.evaluateCapturedFromHeader
            ),
            treatmentCapturedFromHeaderColor: colorCodeMatch(
              dublicateRemoveSecondArr,
              res.treatmentCapturedFromHeader
            ),
            monitorColor: COLORS[index],
            meatColor: COLORS[index],
            assessment: res.assessment,
            monitor: res.monitor,
            evaluate: res.evaluate,
            treatment: res.treatment,
            isMeatCriteriaPresent: res.isMeatCriteriaPresent,
          });
        });
        setMeatCriteriaListRadiology(meatListArr);
        setRadiologyResultStatus(true);
        setIsLoadingDos(false);
      } else {
        setIsLoading(false);
      }
    }
  };
  const getLabReportDetails = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/lab/compute/get/lab?patientid=${patientId}&orgid=${orgId}`
    );

    if (response.data.labFileDetail != null) {
      var result = response.data;
      setLabResult(result);
      var dosYearArr = [];
      var dosYearArrFile = [];
      var validDiseaseNewRes = [];

      for (var key in result.validDisease) {
        dosYearArr.push({ value: key, label: key });
      }

      setLabFileDosList(dosYearArr);

      var dateofService = dosYearArr[0].value;

      const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

      const highestDosValue = dosYearArr.filter((i) => i.value === highestDOS);

      if (dosYearArr.length != 0) {
        validDiseaseNewRes = result.validDisease[dateofService];
        if (result.labFileDetail != null) {
          for (var key in result.labFileDetail) {
            dosYearArrFile.push({ value: key, label: key });
          }
          setFileLabDateofServiceList(dosYearArrFile);
          setLabFileDateDefaulteSelect(dosYearArrFile[0]);
          var fileDetails = result.labFileDetail[dateofService];
          getLabReportFiles(fileDetails[0].azureBlobPath, tenId);
        }
      }
      setLabReportValidList(validDiseaseNewRes);
      setLabFileDosListDefaultSelect(dosYearArr[0]);
      setLabResultStatus(true);
      setIsLoadingDos(false);
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

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const getPatientPdfFile = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data;
      setSelectFileURL(response.data);
      setSelectFileURLValid(response.data)
      setIsLoading(false);
      setIsLoadingDos(false);
      fetch(response.data)
        .then((resp) => resp.arrayBuffer())
        .then((resp) => {
          // set the blog type to final pdf
          const file = new Blob([resp], { type: "application/pdf" });

          // process to auto download it
          const fileURL = URL.createObjectURL(file);
          setValidLocalFileDownloadAndView(fileURL);
          //  setSelectFileURL(fileURL);
          //  setIsLoading(false);

          // Open new Tab
          //  window.open(fileURL)
        });
      //  setIsLoading(false);
    }
  };

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data;
      setSelectFileURLRadiology(response.data);
      fetch(response.data)
        .then((resp) => resp.arrayBuffer())
        .then((resp) => {
          const file = new Blob([resp], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          setSelectFileURLRadiology(fileURL);
          setIsLoading(false);
          // Open new Tab
          //  window.open(fileURL)
        });
    }
  };

  const getLabReportFiles = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      var result = response.data;
      setLabReportFile(response.data);
    }
  };

  const options = [
    { value: "1", label: "Novant Health" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
  const options2 = [
    { value: "1", label: "Home Health" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];
  const options3 = [
    { value: "1", label: "Show Original" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];

  const confirmvalid = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(
        setConfirmNotesModalValid(true),
        setIsValidAction("validToDeleted")
      ), 1000);
    });

  const validToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(setConfirmNotesModalValid(true),
        setIsValidAction("validToSuggested")
      ), 1000);
    });

  const suggestedToValid = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(setConfirmNotesModalValid(true),
        setIsValidAction("suggestedToValid")
      ), 1000);
    });
  const suggestedToDeleted = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(setConfirmNotesModalValid(true),
        setIsValidAction("suggestedToDeleted")
      ), 1000);
    });

  const deletedToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(setConfirmNotesModalValid(true),
        setIsValidAction("deletedToSuggested")
      ), 1000);
    });
  const deletedToValid = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(setConfirmNotesModalValid(true),
        setIsValidAction("deletedToValid")
      ), 1000);
    });


  const confirmInvalid = () =>
    new Promise((resolve) => {
      // invalidMoveConfirm();
      setTimeout(() => resolve(setConfirmNotesModalInValid(true)), 1000);
    });

  const confirmInvalidSuggested = () =>
    new Promise((resolve) => {
      // invalidMoveConfirm();
      setTimeout(() => resolve(setConfirmNotesModalInValid(true)), 1000);
    });

  const confirmInvalidMoveDis = () =>
    new Promise((resolve) => {
      validMoveConfirmDis();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmCombo = () =>
    new Promise((resolve) => {
      comboMoveConfirm();
      setTimeout(() => resolve(null), 1000);
    });

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

  const confirmInvalidMeat = () =>
    new Promise((resolve) => {
      meatMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmValidMeat = () =>
    new Promise((resolve) => {
      meatMoveValidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmMeat = () =>
    new Promise((resolve) => {
      meatMoveConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const onchangeValid = (code, data) => {
    setSelectDiseasesName(code);
    setSelectInvalidDetails(data);
  };

  const onchangeCombo = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };
  const onchangeMeat = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };

  const validMoveConfirm = () => {
    const result = newValidDiseaseList.filter(
      (res) => res.diagnosisCode != selectDiseasesName
    );
    setNewValidDiseaseList(result);
    const result2 = newValidDiseaseList.filter(
      (res2) => res2.diagnosisCode == selectDiseasesName
    );

    // var namePush = [];
    // namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...invalidMoveDiseasesList, ...result2];
    setInvalidMoveDiseasesList(newArray);

    // const result = validDiseasesList.filter(
    //   (res) => res.name != selectDiseasesName
    // );
    // setValidDiseasesList(result);
    // var namePush = [];
    // namePush.push({ name: selectDiseasesName });
    // var newArray = [];
    // newArray = [...invalidDiseasesList, ...namePush];
    // setInvalidDiseasesList(newArray);
  };

  const invalidMoveConfirm = () => {
    const result = newInValidDiseaseList.filter(
      (res) => res.diagnosisCode != selectDiseasesName
    );
    setInNewValidDiseaseList(result);

    const result2 = newInValidDiseaseList.filter(
      (res2) => res2.diagnosisCode == selectDiseasesName
    );
    var namePush = [];
    namePush.push({ name: selectDiseasesName });
    var newArray = [];
    newArray = [...newValidDiseaseList, ...result2];
    setNewValidDiseaseList(newArray);
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

  const meatMoveValidConfirm = () => {
    const result = invalidMeatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setInvalidMeatCriteriaList(result);
    const result2 = invalidMeatCriteriaList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    var newArray = [];
    newArray = [...meatCriteriaList, ...result2];
    setMeatCriteriaList(newArray);
  };

  const meatMoveConfirm = () => {
    const result = meatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setMeatCriteriaList(result);
    var namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    var newArray = [];
    newArray = [...invalidDiseasesList, ...namePush];
    setInvalidMeatCriteriaList(newArray);
  };

  const handleCloseForm = () => {
    setIsAddButtonClicked(false);
    // Add any additional logic for closing the form if needed
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalOpenValid(false);
    setConfirmNotesModalValid(false);
    setConfirmNotesModalInValid(false);
    setIsModalOpenRadiology(false);
    setSuggestedModal(false);
    setIsModalOpenValidCodes(false);
    setIsModalOpenCaptureSection(false);
    setConfirmNotesModalDecline(false);
    setConfirmNotesModalHold(false);
    setIsAddButtonClicked(false);
    setConfirmNotesModalDecline(false);
    setIsAddButtonClicked(false);
    setIsModalComments(false);
    setFlagContainerActive('');
  };
  const handleOpenModal = (value, disDescription) => {
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
    // setSelectMeatName(dataset);
    setSelectMeatName(dataset + " -  " + "Loading...");
    setIsLoadingSection(true);
    setIsModalOpen(true);
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };
  const handleOpenModalCombinationCode = (
    value,
    disDescription,
    check,
    whereCome
  ) => {
    if (whereCome == "nonHcc") {
      setNonHccActiveCodes(true);
    } else {
      setNonHccActiveCodes(false);
    }
    if (check === "valid") {
      setSelectActiveCode(value);
      var splitPoint = "";
      splitPoint = disDescription[0];
      setTimeout(() => {
        highlight({
          keyword: splitPoint,
        });
        var dataset = value + " - (" + splitPoint + ")";
        setSelectMeatName(dataset);
      }, 2000);
      setDocumentLoaded(true);
      var dataset = value + " - (" + splitPoint + ")";
      setSelectMeatName(dataset + " -  " + "Loading...");
      setIsLoadingSection(true);
      setIsModalOpenCaptureSection(true);
    } else if (check == "valid2") {
      setSelectActiveCode(value);
      var splitPoint = "";
      splitPoint = disDescription;
      setTimeout(() => {
        highlight({
          keyword: splitPoint,
          matchCase: true,
        });
        var dataset = value + " - (" + disDescription + ")";
        setSelectMeatName(dataset);
      }, 2000);
      setDocumentLoaded(true);
      var dataset = value + " - (" + disDescription + ")";
      setSelectMeatName(dataset + " -  " + "Loading...");
      setIsLoadingSection(true);
      setIsModalOpenValidCodes(true);
    } else {
      setSelectActiveCode(value);
      var splitPoint = "";
      splitPoint = disDescription.substring(" ", 20);
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
      setIsLoadingSection(true);
      setIsModalOpen(true);
    }
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };
  const handleOpenModalRadiology = (value, disDescription) => {
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
    // setSelectMeatName(dataset);
    setSelectMeatName(dataset + " -  " + "Loading...");
    setIsLoadingSection(true);
    setIsModalOpenRadiology(true);
    // setIsModalOpenValid(true)
    // getSectionResult(value.toLowerCase());
  };

  const getSectionResult = async (value) => {
    var apiUrl = `dbservice/patient/compute/getsection?fileid=cbd48813-3f9c-4cc9-9882-1db87fdd1ffb&section=${value}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + apiUrl);
    var result = response.data;
    if (response.data) {
      setSectionList(response.data);
      setIsLoadingSection(false);
    }
  };

  const onChangeFile = (e) => {
    let value = URL.createObjectURL(e[0]);

    setSelectFileURL(value);
  };

  const addValidDiseases = () => {
    setIsModalOpenValid(true);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
    }
    setValidated(true);
  };

  const handleSubmitValidNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setConfirmNotesModalValid(false);
      // validMoveConfirm();
      if (isValidAction == "validToSuggested") {
        handleSubmitMoveValidToSuggested();
      }
      if (isValidAction == "validToDeleted") {
        handleSubmitMoveValidToDeleted();
      }
      if (isValidAction == "suggestedToDeleted") {
        handleSubmitMoveSuggestedToDeleted();
      }
      if (isValidAction == "suggestedToValid") {
        handleSubmitMoveSuggestedToValid();
      }
      if (isValidAction == "deletedToSuggested") {
        handleSubmitMoveDeletedToSuggested();
      }
      if (isValidAction == "deletedToValid") {
        handleSubmitMoveDeletedToValid();
      }
      if (isValidAction == "declineFunction") {
        handleSubmitHccDeclineApi();
      }
      if (isValidAction == "holdFunction") {
        handleSubmitHccHold();
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

  const handleSubmitSuggestedNotes = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setSuggestedModal(false);
      submitSuggestedHcc();
      // setSuggestedBtnTitle("Loading...")
    }
    setValidated(true);
  };

  const dosOnChangeRadiologyFile = async (e) => {
    var dosKeyValue = e.value;
    var fileDetails = radiologyResult.radiologyFileDetail[dosKeyValue];
    getPatientPdfFileRadiology(fileDetails[0].azureBlobPath, localTenantId);
  };

  const dosOnChangeLabFile = async (e) => {
    var dosKeyValue = e.value;
    var fileDetails = labResult.labFileDetail[dosKeyValue];
    getLabReportFiles(fileDetails[0].azureBlobPath, localTenantId);
  };

  const dosOnChange = async (e) => {
    var dosKeyValue = e.value;
    getYearOfServiceDetails(e.value);

    if (activeTab == 1 || activeTab == 2) {
      //   var validDiseaseNewRes = [];
      //   var invalidDiseaseNewRes = [];
      //   var comboDis = "";
      //   var meatCri = "";
      //   var rafScore = null;
      //   var result = patientDetails;

      //   validDiseaseNewRes = result.validDisease[dosKeyValue];
      //   invalidDiseaseNewRes = result.invalidDisease[dosKeyValue];
      //   comboDis = result.comboDisease[dosKeyValue];
      //   meatCri = result.meatCriteria[dosKeyValue];
      //   if (result.rafScore != null) {
      //     rafScore = result.rafScore[dosKeyValue];
      //   }

      //   setNewValidDiseaseList(validDiseaseNewRes);
      //   setInNewValidDiseaseList(invalidDiseaseNewRes);
      //   setComboDiseaseCodesList(comboDis);
      //   setRAFScore(rafScore);

      //   const COLORS = [
      //     "bg-bg-seven",
      //     "bg-third",
      //     "bg-bg-four",
      //     "bg-bg-five",
      //     "bg-bg-six",
      //     "bg-bg-eight",
      //     "bg-bg-nine",
      //   ];

      //   var meatListArr = [];
      //   var nonHccMeatListArr = [];
      //   var meatMoniterHead = [];
      //   var meatEvaluteHead = [];
      //   var meatAssesmentHead = [];
      //   var meatTreatMentHead = [];
      //   var allMeatHead = [];
      //   var allMeatHeadColorArr = [];
      //   var allMeatHeadColor = [];
      //   var dublicateRemoveSecondArr = [];

      //   meatCri.map((res, index) => {
      //     if (res.monitorCapturedFromHeader != "") {
      //       meatMoniterHead.push({
      //         header: res.monitorCapturedFromHeader,
      //       });
      //     }
      //     if (res.evaluateCapturedFromHeader != "") {
      //       meatEvaluteHead.push({
      //         header: res.evaluateCapturedFromHeader,
      //       });
      //     }
      //     if (res.assessmentCapturedFromHeader != "") {
      //       meatAssesmentHead.push({
      //         header: res.assessmentCapturedFromHeader,
      //       });
      //     }
      //     if (res.treatmentCapturedFromHeader != "") {
      //       meatTreatMentHead.push({
      //         header: res.treatmentCapturedFromHeader,
      //       });
      //     }
      //     var newArray = [];
      //     newArray = [
      //       ...allMeatHead,
      //       ...meatMoniterHead,
      //       ...meatEvaluteHead,
      //       ...meatAssesmentHead,
      //       ...meatTreatMentHead,
      //     ];
      //     var dublicateRemoveArr = getUniqueListBy(newArray, "header");
      //     dublicateRemoveArr.map((res3, index) => {
      //       allMeatHeadColor.push({
      //         header: res3.header,
      //         color: COLORS[index],
      //       });
      //     });
      //     allMeatHeadColorArr = allMeatHeadColor;

      //     dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, "header");
      //     setMeatColorCodeList(dublicateRemoveSecondArr);
      //   });

      //   meatCri.map((res, index) => {
      //     if (res.category == "Invalid") {
      //       nonHccMeatListArr.push({
      //         diagnosisCode: res.diagnosisCode,
      //         diseaseName: res.diseaseName,
      //         monitorCapturedFromHeader: res.monitorCapturedFromHeader,
      //         assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
      //         evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
      //         treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
      //         monitorCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.monitorCapturedFromHeader
      //         ),
      //         assessmentCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.assessmentCapturedFromHeader
      //         ),
      //         evaluateCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.evaluateCapturedFromHeader
      //         ),
      //         treatmentCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.treatmentCapturedFromHeader
      //         ),
      //         monitorColor: COLORS[index],
      //         meatColor: COLORS[index],
      //         assessment: res.assessment,
      //         monitor: res.monitor,
      //         evaluate: res.evaluate,
      //         treatment: res.treatment,
      //         isMeatCriteriaPresent: res.isMeatCriteriaPresent,
      //         category: res.category,
      //       });
      //     } else {
      //       meatListArr.push({
      //         diagnosisCode: res.diagnosisCode,
      //         diseaseName: res.diseaseName,
      //         monitorCapturedFromHeader: res.monitorCapturedFromHeader,
      //         assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
      //         evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
      //         treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
      //         monitorCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.monitorCapturedFromHeader
      //         ),
      //         assessmentCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.assessmentCapturedFromHeader
      //         ),
      //         evaluateCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.evaluateCapturedFromHeader
      //         ),
      //         treatmentCapturedFromHeaderColor: colorCodeMatch(
      //           dublicateRemoveSecondArr,
      //           res.treatmentCapturedFromHeader
      //         ),
      //         monitorColor: COLORS[index],
      //         meatColor: COLORS[index],
      //         assessment: res.assessment,
      //         monitor: res.monitor,
      //         evaluate: res.evaluate,
      //         treatment: res.treatment,
      //         isMeatCriteriaPresent: res.isMeatCriteriaPresent,
      //         category: res.category,
      //       });
      //     }
      //   });
      //   setMeatCriteriaList(meatListArr);
      //   setMeatCriteriaListNonHcc(nonHccMeatListArr);
      //   setIsLoading(false);
      // }

      // if (activeTab == 3) {
      //   var validDiseaseNewRes = [];
      //   var invalidDiseaseNewRes = [];
      //   var unmatchedDiseaseRes = [];
      //   var comboDis = "";
      //   var meatCri = "";
      //   var result = patientDetailsRadiology;

      //   validDiseaseNewRes = result.validDisease[dosKeyValue];
      //   invalidDiseaseNewRes = result.invalidDisease[dosKeyValue];
      //   unmatchedDiseaseRes = result.unmatchedDisease[dosKeyValue];
      //   comboDis = result.comboDisease[dosKeyValue];
      //   meatCri = result.meatCriteria[dosKeyValue];
      //   if (result.radiologyFileDetail != null) {
      //     var fileDetails = result.radiologyFileDetail[dosKeyValue];
      //     getPatientPdfFileRadiology(fileDetails[0].azureBlobPath, localTenantId);
      //   }

      //   if (result.unmatchedDisease != null) {
      //     setUnMatchHccListRadiology(unmatchedDiseaseRes);
      //   }

      //   setNewValidDiseaseListRadiology(validDiseaseNewRes);
      //   setInNewValidDiseaseListRadiology(invalidDiseaseNewRes);
      //   setComboDiseaseCodesListRadiology(comboDis);

      //   const COLORS = [
      //     "bg-bg-seven",
      //     "bg-third",
      //     "bg-bg-four",
      //     "bg-bg-five",
      //     "bg-bg-six",
      //     "bg-bg-eight",
      //     "bg-bg-nine",
      //   ];

      //   var meatListArr = [];
      //   var meatMoniterHead = [];
      //   var meatEvaluteHead = [];
      //   var meatAssesmentHead = [];
      //   var meatTreatMentHead = [];
      //   var allMeatHead = [];
      //   var allMeatHeadColorArr = [];
      //   var allMeatHeadColor = [];
      //   var dublicateRemoveSecondArr = [];

      //   meatCri.map((res, index) => {
      //     if (res.monitorCapturedFromHeader != "") {
      //       meatMoniterHead.push({
      //         header: res.monitorCapturedFromHeader,
      //       });
      //     }
      //     if (res.evaluateCapturedFromHeader != "") {
      //       meatEvaluteHead.push({
      //         header: res.evaluateCapturedFromHeader,
      //       });
      //     }
      //     if (res.assessmentCapturedFromHeader != "") {
      //       meatAssesmentHead.push({
      //         header: res.assessmentCapturedFromHeader,
      //       });
      //     }
      //     if (res.treatmentCapturedFromHeader != "") {
      //       meatTreatMentHead.push({
      //         header: res.treatmentCapturedFromHeader,
      //       });
      //     }
      //     var newArray = [];
      //     newArray = [
      //       ...allMeatHead,
      //       ...meatMoniterHead,
      //       ...meatEvaluteHead,
      //       ...meatAssesmentHead,
      //       ...meatTreatMentHead,
      //     ];
      //     var dublicateRemoveArr = getUniqueListBy(newArray, "header");
      //     dublicateRemoveArr.map((res3, index) => {
      //       allMeatHeadColor.push({
      //         header: res3.header,
      //         color: COLORS[index],
      //       });
      //     });
      //     allMeatHeadColorArr = allMeatHeadColor;

      //     dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, "header");
      //     setMeatColorCodeList(dublicateRemoveSecondArr);
      //   });

      //   meatCri.map((res, index) => {
      //     meatListArr.push({
      //       diagnosisCode: res.diagnosisCode,
      //       diseaseName: res.diseaseName,
      //       monitorCapturedFromHeader: res.monitorCapturedFromHeader,
      //       assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
      //       evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
      //       treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
      //       monitorCapturedFromHeaderColor: colorCodeMatch(
      //         dublicateRemoveSecondArr,
      //         res.monitorCapturedFromHeader
      //       ),
      //       assessmentCapturedFromHeaderColor: colorCodeMatch(
      //         dublicateRemoveSecondArr,
      //         res.assessmentCapturedFromHeader
      //       ),
      //       evaluateCapturedFromHeaderColor: colorCodeMatch(
      //         dublicateRemoveSecondArr,
      //         res.evaluateCapturedFromHeader
      //       ),
      //       treatmentCapturedFromHeaderColor: colorCodeMatch(
      //         dublicateRemoveSecondArr,
      //         res.treatmentCapturedFromHeader
      //       ),
      //       monitorColor: COLORS[index],
      //       meatColor: COLORS[index],
      //       assessment: res.assessment,
      //       monitor: res.monitor,
      //       evaluate: res.evaluate,
      //       treatment: res.treatment,
      //       isMeatCriteriaPresent: res.isMeatCriteriaPresent,
      //     });
      //   });
      //   setMeatCriteriaListRadiology(meatListArr);
      //   setIsLoading(false);
    }
    if (activeTab == 4) {
      var result = labResult;
      var validDiseaseNewRes = [];

      validDiseaseNewRes = result.validDisease[dosKeyValue];

      if (result.labFileDetail != null) {
        var fileDetails = result.labFileDetail[dosKeyValue];
        getLabReportFiles(fileDetails[0].azureBlobPath, localTenantId);
      }

      setLabReportValidList(validDiseaseNewRes);
      setLabResultStatus(true);
    }
  };

  const onchangeSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(setSuggestedModal(true)), 1000);
    });

  const handleMatchHcc = (event, value, code) => {
    var checked = event.target.checked;
    setSuggestedSelectValue(value);
    setSuggestedSelectCode(code);
    // setSuggestedModal(true);
    if (checked == true) {
      // setSuggestedModal(true);
      // var newArray = [];
      // var namePush = [];
      // var dataFormatSuggested = {
      //   "userId": localUserId,
      //   "patientId": localPatientId,
      //   "diagnosisCode": value.diagnosisCodeDocument,
      //   "actualDescription": value.actualDescription,
      //   "dbDescription": "",
      //   "notes": "test",
      //   "dos": 2017
      // }
      // namePush.push(dataFormatSuggested);
      // newArray = [...matchHccList, ...namePush];
      // setMatchHccList(newArray);
    } else {
      const removeArr = matchHccList.filter((i) => i.name != value);
      setMatchHccList(removeArr);
    }
    // if (newArray.length != 0) {
    setIsMatchBtn(true);
    // }
  };

  const handleSubmitMatchHcc = async () => {
    setSuggestedBtnTitle("Loading");
    try {
      const response = await axios.put(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/suggestions`,
        matchHccList
      );
      if (response?.status == 202) {
        setSuggestedBtnTitle("Add");
        notification.success({
          message: "Moved suggested code to valid diseases Successfully!",
        });
        getPatientDetails(localOrgId, localTenantId);
      } else {
        setSuggestedBtnTitle("Add");
      }
    } catch (e) {
      setSuggestedBtnTitle("Add");
    }
  };

  const submitSuggestedHcc = async (notes) => {
    var newArray = [];
    var namePush = [];
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: suggesteSelectCode,
      actualDescription: suggesteSelectValue.actualDescription,
      dbDescription: "",
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    namePush.push(dataFormatSuggested);
    newArray = [...matchHccList, ...namePush];
    setMatchHccList(newArray);
  };

  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const openModelDbDescription = () => { };

  const tabList = [
    { title: "HCC", type: "HCC" },
    { title: "NON HCC", type: "NON HCC" },
    { title: "Radiology", type: "Radiology" },
    { title: "Lab Report", type: "Lab Report" },
  ];

  const navigetPageDetails = (pageTitle) => {
    // setIsLoadingDos(true);
    setActiveTabHead("file");
    setIsLoading(true);
    if (pageTitle == "HCC") {
      setActiveTab(1);
      setIsLoadingDos(false);
    }
    if (pageTitle == "NON HCC") {
      setActiveTab(2);
      setIsLoadingDos(false);
    }
    if (pageTitle == "Radiology") {
      setActiveTab(3);
      if (radiologyResCheck == false) {
        getPatientDetailsRadiologyYear(localOrgId, localTenantId);
      }
    }
    if (pageTitle == "Lab Report") {
      setActiveTab(4);
      getLabReportDetails(localOrgId, localTenantId);
    }
    setIsLoading(false);
  };

  const handleSubmitPatientFile = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();

      submitRadiology();
    }

    setValidated(true);
  };

  const handleSubmitLabReport = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();
      submitLabReport();
    }

    setValidated(true);
  };

  const addPatientFile = (data) => {
    inputValue.patientId = patientDocumentResult.patientId;
    inputValue.name = patientDocumentResult.patientName;
    setValidated(false);
    setAddPatient(true);
    setIsLoadingBtn(false);
  };
  const addLabReport = (data) => {
    inputValue.patientId = patientDocumentResult.patientId;
    inputValue.name = patientDocumentResult.patientName;
    setValidated(false);
    setLapReportSlider(true);
    setIsLoadingBtn(false);
  };

  const onChangeFileRadiology = (e) => {
    setSelectFileRadiology(e[0]);
  };
  const onChangeLabReportFile = (e) => {
    setSelectLabReportFile(e[0]);
  };

  const submitRadiology = async () => {
    const formData = new FormData();
    formData.append("file", selectFileRadiology);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", localTenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("dos", inputValue.year);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc +
      `aiservice/ai/upload/radiology
      `,
      formData,
      headers
    );
    if (response?.status == 202) {
      setAddPatient(false);
      setIsLoadingBtn(false);
      getPatientDetailsRadiology(localOrgId, localTenantId);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
  };
  const submitLabReport = async () => {
    const formData = new FormData();
    formData.append("file", selectLabReportFile);
    formData.append("orgid", localOrgId);
    formData.append("tenantid", localTenantId);
    formData.append("userid", localUserId);
    formData.append("patientid", inputValue.patientId);
    formData.append("patientname", inputValue.name);
    formData.append("dos", inputValue.year);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(
      ENDPOINTS.apiEndointFileUploadHcc +
      `aiservice/ai/upload/lab
      `,
      formData,
      headers
    );
    if (response?.status == 202) {
      setAddPatient(false);
      setIsLoadingBtn(false);
      getPatientDetailsRadiology(localOrgId, localTenantId);
    } else {
      setIsLoadingBtn(false);
    }
    setAddPatient(false);
  };

  const openNewTabDownloadPdf = async () => {
    //    fetch(selectFileURL).then(resp => resp.arrayBuffer()).then(resp => {

    //     // set the blog type to final pdf
    //     const file = new Blob([resp], {type: 'application/pdf'});

    //     // process to auto download it
    //     const fileURL = URL.createObjectURL(file);

    //     // Open new Tab
    //     window.open(fileURL)

    // });

    window.open("details/file-view", "_blank", "width=4000, height=4000");
  };

  const openNewTabDownloadPdfradiology = async () => {
    window.open("details/radiology-file", "_blank", "width=4000, height=4000");
    //     fetch(selectFileURLRadiology).then(resp => resp.arrayBuffer()).then(resp => {

    //      // set the blog type to final pdf
    //      const file = new Blob([resp], {type: 'application/pdf'});

    //      // process to auto download it
    //      const fileURL = URL.createObjectURL(file);

    //      // Open new Tab
    //      window.open(fileURL)

    //  });
  };

  const getValidHccDetails = async (value, code) => {
    var patientId = localStorage.getItem("patientId");
    var result = "";
    const response = await axios.get(
      ENDPOINTS.apiEndoint + `dbservice/hccdisease?diagnosisCode=${code}`
    );
    if (response.data) {
      result = response.data;
    }
    var data = (
      <div className="validhcc-details">
        {/* <Spin className='ml-2 ms-1' size="small" /> */}
        {/* <div>{value}</div> */}
        <div>
          cmsHcc_V22_for_2023_payment_year :{" "}
          {result.cmsHcc_Model_Category_V22_for_2023_payment_year}
        </div>
        <div>
          cmsHcc_V24_for_2023_payment_year :{" "}
          {result.cmsHcc_Model_Category_V24_for_2023_payment_year}
        </div>
        <div>cmsHcc_V22 : {result.cmsHcc_model_category_V22}</div>
        <div>cmsHcc_V24 : {result.cmsHcc_model_category_V24}</div>
        <div>
          rxHcc_V05_for_2023_payment_year :{" "}
          {result.rxHcc_Model_Category_V05_for_2023_payment_year}
        </div>
        <div>
          rxHcc_V08_for_2023_payment_year :{" "}
          {result.rxHcc_model_category_V08_for_2023_payment_year}
        </div>
        <div>rxHcc_V05 : {result.rxHcc_model_category_V05}</div>
        <div>rxHcc_V08 : {result.rxHcc_model_category_V08}</div>
      </div>
    );
    setvalidHccDetails(data);
  };




  const handleSubmitMoveValidToSuggested = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/validtosuggested`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to suggested Successfully!",
      });
      getPatientDetails(localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitMoveValidToDeleted = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/validtodeleted`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to deleted Successfully!",
      });
      getPatientDetails(localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitMoveSuggestedToDeleted = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/suggestedtodeleted`,
      [dataFormatSuggested]
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to deleted Successfully!",
      });
      getPatientDetails(localOrgId, localTenantId);
    } else {
    }
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
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/suggestedtovalid`,
      [dataFormatSuggested]
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to valid Successfully!",
      });
      getPatientDetails(localOrgId, localTenantId);
    } else {
    }
  };

  const handleSubmitMoveDeletedToValid = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/deletedtovalid`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to valid Successfully!",
      });
      getPatientDetails(localOrgId, localTenantId);
    } else {
    }
  };
  const handleSubmitMoveDeletedToSuggested = async () => {
    var dataFormatSuggested = {
      userId: localUserId,
      patientId: localPatientId,
      diagnosisCode: selectInvalidDetails.diagnosisCode,
      actualDescription: selectInvalidDetails.actualDescription,
      dbDescription: selectInvalidDetails.dbDescription,
      notes: inputValue.notes,
      dos: selectedDosValue,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/deletedtoSuggested`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved to Suggested Successfully!",
      });
      getPatientDetails(localOrgId, localTenantId);
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
    };
    const response = await axios.put(
      ENDPOINTS.apiEndointFileUploadHcc + `dbservice/update/move/invalidtovalid`,
      dataFormatSuggested
    );
    if (response?.status == 202) {
      notification.success({
        message: "Moved valid diseases Successfully!",
      });
      getPatientDetails(localOrgId, localTenantId);
    } else {
    }
  };

  const activeValidDisCode = async (code, disDescription) => {
    setSelectActiveCode(code);
    var splitPoint = disDescription.substring(" ", 20);

    setTimeout(() => {
      highlight({
        keyword: disDescription,
        matchCase: true,
      });
      var dataset = code + " - (" + disDescription + ")";
      setSelectMeatName(dataset);
    }, 2000);

    setDocumentLoaded(true);
    var dataset = code + " - (" + disDescription + ")";
    setSelectMeatName(dataset + " -  " + "Loading...");
  };

  const replaceString = (value) => {
    var removeComma = null;
    if (value != null) {
      removeComma = value.replace(/,/g, "");
    }
    return removeComma;
  };

  const replaceCaptureSection = (value) => {
    return value;
  };

  const handleSubmitHccSave = async () => {
    setSaveBtnTitle("Loading...");
    var dos = dosYearDefalutSelect[0].label;
    var validObject = {};
    var inValidObject = {};
    var unmatachObject = {};
    var comoboObject = {};
    var meatObject = {};
    var deletedObject = {};
    validObject[dos] = newValidDiseaseList;
    inValidObject[dos] = newInValidDiseaseList;
    unmatachObject[dos] = suggestedHccList;
    comoboObject[dos] = comboDiseaseCodesList;
    meatObject[dos] = meatCriteriaList;
    deletedObject[dos] = deletedHccList;

    var postData = {
      userId: localUserId,
      patientId: localPatientId,
      patientName: patientDocumentResult.patientName,
      fileId: patientDocumentResult.patientName,
      orgId: patientDocumentResult.orgId,
      tenantId: patientDocumentResult.tenantId,
      dob: patientDocumentResult.dob,
      gender: patientDocumentResult.gender,
      age: patientDocumentResult.age,
      validDisease: validObject,
      invalidDisease: inValidObject,
      unmatchedDisease: unmatachObject,
      comboDisease: comoboObject,
      meatCriteria: meatObject,
      rafScore: patientDocumentResult.rafScore,
      dosFiltered: patientDocumentResult.dosFiltered,
      fileDetailDTO: patientDocumentResult.fileDetailDTO,
      deletedDiseases: deletedObject
    };

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/save`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Saved Successfully!",
        });
        setSaveBtnTitle("Save");
        getPatientDetails(localOrgId, localTenantId);
      } else {
      }
    } catch (e) {
      setSaveBtnTitle("Save");
    }
  };

  const handleSubmitHccComplete = async () => {
    setCompleteBtnTitle("Loading...");
    var dos = dosYearDefalutSelect[0].label;
    var validObject = {};
    var inValidObject = {};
    var unmatachObject = {};
    var comoboObject = {};
    var meatObject = {};
    var deletedObject = {};
    validObject[dos] = newValidDiseaseList;
    inValidObject[dos] = newInValidDiseaseList;
    unmatachObject[dos] = suggestedHccList;
    comoboObject[dos] = comboDiseaseCodesList;
    meatObject[dos] = meatCriteriaList;
    deletedObject[dos] = deletedHccList;


    var postData = {
      userId: localUserId,
      patientId: localPatientId,
      patientName: patientDocumentResult.patientName,
      fileId: patientDocumentResult.patientName,
      orgId: patientDocumentResult.orgId,
      tenantId: patientDocumentResult.tenantId,
      dob: patientDocumentResult.dob,
      gender: patientDocumentResult.gender,
      age: patientDocumentResult.age,
      validDisease: validObject,
      invalidDisease: inValidObject,
      unmatchedDisease: unmatachObject,
      comboDisease: comoboObject,
      meatCriteria: meatObject,
      rafScore: patientDocumentResult.rafScore,
      dosFiltered: patientDocumentResult.dosFiltered,
      fileDetailDTO: patientDocumentResult.fileDetailDTO,
      deletedDiseases: deletedObject
    };

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/complete`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Completed Successfully!",
        });
        setCompleteBtnTitle("Complete");
        getPatientDetails(localOrgId, localTenantId);
      } else {
      }
    } catch (e) {
      setCompleteBtnTitle("Complete");
    }
  };

  const handleSubmitHccDeclineApi = async () => {
    setDeclineBtnTitle("Loading...");
    var postData = {
      orgid: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/decline`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Decline Successfully!",
        });
        setConfirmNotesModalHold(false);
        setDeclineBtnTitle("Decline");
      } else {
      }
    } catch (e) {
      setDeclineBtnTitle("Decline");
    }
  };

  const handleSubmitHccHold = async () => {
    setDeclineBtnTitle("Loading...");
    var postData = {
      orgid: localOrgId,
      patientId: localPatientId,
      notes: inputValue.notes,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/status/hold`,
        postData
      );
      if (response?.status == 202) {
        notification.success({
          message: "Hold Successfully!",
        });
        setConfirmNotesModalHold(false);
        setDeclineBtnTitle("Decline");
      } else {
      }
    } catch (e) {
      setDeclineBtnTitle("Decline");
    }
  };


  const handleSubmitHccDecline = async () => {
    setIsValidAction("declineFunction")
    setConfirmNotesModalHold(true);

  };

  const getFindValidDiagnosisCode = async (value) => {
    console.log(value);

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
      `dbservice/icddisease/finddiseasebycode?diseasecode=${value}`
    );
    if (response.data) {
      console.log(response.data)
    }
  };

  // updated changes
  const handleFormSubmit = async (event) => {
    var dos = dosYearDefalutSelect.label;
    event.preventDefault();
    var dataFormatSuggested = {
      "patientComputeDetailId": localPatientId,
      "year": dos,
      "diseaseFormats": [
        {
          "diagnosisCode": inputValue.diagnosisCode,
          "actualDescription": inputValue.actualDescription,
          "encounterDate": inputValue.encodedDate,
          "capturedSections": [inputValue.capturedSections]
        }
      ]
    }

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndointFileUploadHcc + `dbservice/patient/compute/addvaliddisease`,
        dataFormatSuggested
      );
      if (response?.status == 200) {
        notification.success({
          message: "Saved Successfully!",
        });
        setIsModalOpenValidCodes(false);
        getPatientDetails(localOrgId, localTenantId);
        handleCloseForm();

      } else {
      }
    } catch (e) {
    }
    // Add logic for handling form submission
    // You can access the form data and perform actions accordingly
    // For example, you can access the input field values using refs or state
    // After handling the submission, close the form
  };

  const addComments = (value) => {
    setIsModalComments(true);
    setFlagContainerActive(value);

  }

  const flagList = [
    {
      name: "comments",
      icon: SVGICON.flagIcon,
    },
    {
      name: "timeline",
      icon: SVGICON.filterIcon,
    },
    {
      name: "commentslist",
      icon: SVGICON.commentIcon,
    },
    {
      name: "notes",
      icon: SVGICON.notsIcon,
    },
  ];




  return (
    <>
      <div className={`show ${sideMenu ? "menu-toggle" : ""}`}>
        <NavBar />
        <div class="content-body">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={`container-fluid ${visitStyles.container_fluid_patient}`}>
              <div className="row card patient-file-container">
                <div className="col-xl-12">
                  <div className="row">
                    <div className="col-xl-8 col-sm-12">
                      <div className={`${visitStyles.patient_info_details}`}>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-xl-2 col-sm-12">
                              <i>{SVGICON.patientIdIcon}</i>
                              <label>Patient Id</label>
                              <h6 className="ageDtails">
                                {patientDocumentResult.patientId}
                              </h6>
                            </div>
                            <div className="col-xl-2 col-sm-12">
                              <i>{SVGICON.patientNameIcon}</i> <label>Name</label>
                              <h6 className="ageDtails">
                                {patientDocumentResult.patientName}
                              </h6>
                            </div>
                            <div className="col-xl-2 col-sm-12">
                              <i>{SVGICON.AgeIcon}</i> <label>Age</label>
                              <h6 className="ageDtails">
                                {patientDocumentResult.age}
                              </h6>
                            </div>
                            <div className="col-xl-2 col-sm-12">
                              <i>{SVGICON.GenerIcon}</i>
                              <label>Gender</label>
                              <h6 className="ageDtails">
                                {patientDocumentResult.gender}
                              </h6>
                            </div>
                            <div className="col-xl-2 col-sm-12">
                              <i>{SVGICON.DatebirthIcon}</i> <label>DOB</label>
                              <h6 className="ageDtails">
                                {patientDocumentResult.dob}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-sm-12">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-xl-12 col-sm-12">
                            <label className="form-label">
                              Date of Service
                            </label>
                            {!isLoadingDos ? (
                              <>
                                {activeTab == 3 ? (
                                  <Select
                                    onChange={(e) => dosOnChange(e)}
                                    options={dosYearRadiology}
                                    className="custom-react-select"
                                    defaultValue={
                                      dosYearDefalutSelectRadiology
                                    }
                                    isSearchable={false}
                                  />
                                ) : activeTab == 4 ? (
                                  <Select
                                    onChange={(e) => dosOnChange(e)}
                                    options={labFileDosList}
                                    className="custom-react-select"
                                    defaultValue={labFileDosListDefaultSelect}
                                    isSearchable={false}
                                  />
                                ) : (
                                  <Select
                                    onChange={(e) => dosOnChange(e)}
                                    options={dosYear}
                                    className="custom-react-select"
                                    defaultValue={dosYearDefalutSelect}
                                    isSearchable={false}
                                  />
                                )}
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row"></div>
                    <div className="col-xl-11">
                      <div className="row">
                        <div className="col-xl-8">
                          <div className={`${visitStyles.visitdata_header_card}`}>
                            <div className="card-body p-0">
                              <Tab.Container defaultActiveKey={"HCC"}>
                                <div className={`card-header border-0 flex-wrap patient-details-tab-card `}>
                                  <Nav
                                    as="ul"
                                    className="nav nav-pills mix-chart-tab"
                                  >
                                    {tabList.map((item, index) => (
                                      <Nav.Item
                                        as="li"
                                        className="nav-item"
                                        key={index}
                                      >
                                        <Nav.Link
                                          onClick={() =>
                                            navigetPageDetails(item.type)
                                          }
                                          eventKey={item.title}
                                        >
                                          {item.title}
                                        </Nav.Link>
                                      </Nav.Item>
                                    ))}
                                  </Nav>
                                  <div>

                                    {activeTab == 3 ? (
                                      <div>
                                        <Button
                                          onClick={addPatientFile}
                                          className={`ms-2 ${visitStyles.addPatientBtn}`}>
                                          Add Patient Radiology
                                        </Button>
                                      </div>
                                    ) : null}
                                    {activeTab == 4 ? (
                                      <div>
                                        <Button
                                          onClick={addLabReport}
                                          className={`ms-2 ${visitStyles.addPatientBtn}`}>
                                          Add Lab report
                                        </Button>
                                      </div>
                                    ) : null}

                                  </div>
                                </div>

                              </Tab.Container>
                            </div>
                          </div>

                        </div>
                        <div className={`col-xl-4 ${visitStyles.actionbtnContainer}`}>
                          <Button
                            onClick={handleSubmitHccDecline}
                            className={`ms-2 ${visitStyles.declineBtn}`}>
                            <i>{SVGICON.delclineIcon}</i>
                            {declineBtnTitle}
                          </Button>
                          <Button
                            onClick={() => {
                              setConfirmNotesModalDecline(true);
                              setIsValidAction("holdFunction")
                            }}
                            className={`ms-2 ${visitStyles.holdBtn}`}>
                            <i>{SVGICON.holdBtnIcon}</i>
                            Hold
                          </Button>

                          <Button
                            onClick={handleSubmitHccComplete}
                            className={`ms-2 ${visitStyles.completedBtn}`}>
                            <i>{SVGICON.completedBtnIcon}</i>

                            {completedBtnTitle}
                          </Button>



                        </div>
                      </div>

                      {activeTab == 1 ? (
                        <div className={visitStyles.visitdata_tab_body}>
                          <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
                            <div className="custom-tab-1 "  >
                              <Tab.Container defaultActiveKey={activeTabHead}>
                                <Nav as="ul" className="nav nav-tabs">

                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="validDiseases"
                                    >
                                      Visit Data
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="comboDiseases"
                                    >
                                      Combination Codes
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="meatCriteria"
                                    >
                                      MEAT Criteria
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="RafScore"
                                    >
                                      RAF Score
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="file">
                                      File
                                    </Nav.Link>
                                  </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="validDiseases"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`} >
                                                <span
                                                  className={`${visitStyles.hcc_title_name}`}
                                                >
                                                  HCC
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.hcc_title_badge}`}>
                                                    {newValidDiseaseList.length}
                                                  </span>
                                                </div>
                                              </div>

                                              {newValidDiseaseList.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className={`${visitStyles.hcc_card}`}>
                                                      <div className="timeline-panel">
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
                                                              {
                                                                data.diagnosisCode
                                                              }
                                                            </span>{" "}
                                                            -{" "}
                                                            {
                                                              data.actualDescription
                                                            }
                                                          </span>
                                                        </div>

                                                        <Popover
                                                          onClick={() =>
                                                            getValidHccDetails(
                                                              data.actualDescription,
                                                              data.diagnosisCode
                                                            )
                                                          }
                                                          content={
                                                            validHccDetails
                                                          }
                                                          title={
                                                            data.diagnosisCode
                                                          }
                                                          placement="bottom"
                                                          trigger="click"
                                                        >
                                                          <i>{SVGICON.infoIcon}</i>
                                                        </Popover>


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
                                                          cancelText="Move to Suggested"
                                                          onCancel={
                                                            validToSuggested
                                                          }
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
                                                          description={
                                                            data.diagnosisCode
                                                          }
                                                          onConfirm={
                                                            confirmvalid
                                                          }
                                                          placement="leftTop"
                                                          onOpenChange={() =>
                                                            onchangeValid(
                                                              data.diagnosisCode,
                                                              data
                                                            )
                                                          }
                                                        >
                                                          <div className={visitStyles.close_icon}>
                                                            {SVGICON.closeIcon}
                                                          </div>
                                                        </Popconfirm>
                                                      </div>
                                                      <div className="d-flex justify-content-sm-between valid-providerdocument ">
                                                        <Popover
                                                          placement="topLeft"
                                                          title=""
                                                          content={
                                                            patientDocumentResult.patientName
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                            <i>{SVGICON.patientNameIcon}</i>
                                                            {
                                                              patientDocumentResult.patientName
                                                            }
                                                          </Badge>
                                                        </Popover>
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.encounterDate
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                            <i>{SVGICON.DatebirthIcon}</i>
                                                            {replaceString(
                                                              data.encounterDate
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.capturedSections
                                                          }
                                                        >

                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`} onClick={() =>
                                                            handleOpenModalCombinationCode(
                                                              data.diagnosisCode,
                                                              data.capturedSections,
                                                              "valid"
                                                            )
                                                          }>
                                                            {replaceCaptureSection(
                                                              data.capturedSections
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                        {/* <Popover placement="topLeft" content={ patientDocumentResult.patientName}>
                                                      <Badge className="badge-meat text-white cr-pointer badge-circle mt-2" bg={` badge-circle mt-2 bg-bg-five`} onClick={() => handleOpenModalCombinationCode(data.diagnosisCode, data.actualDescription)}>
                                                      <FontAwesomeIcon
                                                          icon={faSearch}
                                                          style={{ color: "#fff" }}
                                                        />
                                                        HPI Test Urlplan
                                                      </Badge>
                                                      </Popover> */}
                                                      </div>
                                                    </div>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`} >
                                                <span
                                                  className={`${visitStyles.suggested_title_name}`}
                                                >
                                                  Suggested Codes
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.suggested_title_badge}`}>
                                                    {suggestedHccList.length}
                                                  </span>
                                                </div>
                                              </div>
                                              {suggestedHccList?.map(
                                                (data) => {
                                                  return (
                                                    <>
                                                      {data.isHccValid ==
                                                        true ? (
                                                        <li>
                                                          <div className={`${visitStyles.hcc_card}`}>
                                                            <div className="timeline-panel">
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
                                                                    {
                                                                      data.diagnosisCode
                                                                    }
                                                                  </span>{" "}
                                                                  -{" "}
                                                                  {
                                                                    data.actualDescription
                                                                  }
                                                                </span>
                                                              </div>
                                                              <Popover
                                                                onClick={() =>
                                                                  getValidHccDetails(
                                                                    data.actualDescription,
                                                                    data.diagnosisCode
                                                                  )
                                                                }
                                                                content={
                                                                  validHccDetails
                                                                }
                                                                title={
                                                                  data.diagnosisCode
                                                                }
                                                                placement="bottom"
                                                                trigger="click"
                                                              >
                                                                <i>{SVGICON.infoIcon}</i>
                                                              </Popover>

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
                                                                cancelText="Move to Valid"
                                                                onCancel={
                                                                  suggestedToValid
                                                                }
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
                                                                description={
                                                                  data.diagnosisCode
                                                                }
                                                                onConfirm={
                                                                  suggestedToDeleted
                                                                }
                                                                placement="leftTop"
                                                                onOpenChange={() =>
                                                                  onchangeValid(
                                                                    data.diagnosisCode,
                                                                    data
                                                                  )
                                                                }
                                                              >
                                                                <div className={visitStyles.close_icon}>
                                                                  {SVGICON.closeIcon}
                                                                </div>
                                                              </Popconfirm>
                                                            </div>
                                                            <div className="d-flex justify-content-sm-between valid-providerdocument ">
                                                              {data.getPlace ==
                                                                "Lab" ? (
                                                                <Badge
                                                                  className="badge-meat  badge-circle mt-2 text-white"
                                                                  bg={` badge-circle mt-2 bg-bg-seven `}
                                                                >
                                                                  Lab
                                                                </Badge>
                                                              ) : data.getPlace ==
                                                                "Radio" ? (
                                                                <Badge
                                                                  className="badge-meat  badge-circle mt-2 text-white"
                                                                  bg={` badge-circle mt-2 bg-bg-five `}
                                                                >
                                                                  Radiology
                                                                </Badge>
                                                              ) : (
                                                                <Badge
                                                                  className="badge-meat  badge-circle mt-2 text-white"
                                                                  bg={` badge-circle mt-2 bg-bg-five `}
                                                                >
                                                                  Hcc
                                                                </Badge>
                                                              )}

                                                              <Popover
                                                                placement="topLeft"
                                                                content={
                                                                  data.encounterDate
                                                                }
                                                              >
                                                                <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                                  <i>{SVGICON.DatebirthIcon}</i>
                                                                  {replaceString(
                                                                    data.encounterDate
                                                                  )}
                                                                </Badge>
                                                              </Popover>
                                                              <Popover
                                                                placement="topLeft"
                                                                content={
                                                                  data.capturedSections
                                                                }
                                                              >
                                                                <Badge className={`mt-2 text-start ${visitStyles.provider_name}`} onClick={() =>
                                                                  handleOpenModalCombinationCode(
                                                                    data.diagnosisCode,
                                                                    data.capturedSections,
                                                                    "valid"
                                                                  )
                                                                }>
                                                                  {replaceCaptureSection(
                                                                    data.capturedSections
                                                                  )}
                                                                </Badge>
                                                              </Popover>
                                                            </div>
                                                          </div>

                                                        </li>
                                                      ) : null}
                                                    </>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>

                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.deleted_title_card}`} >
                                                <span
                                                  className={`${visitStyles.deleted_title_name}`}
                                                >
                                                  Deleted Codes
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.deleted_title_badge}`}>
                                                    {deletedHccList.length}
                                                  </span>
                                                </div>
                                              </div>
                                              {deletedHccList.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className={`${visitStyles.hcc_card}`}>
                                                      <div className="timeline-panel">
                                                        <div className="media-body">
                                                          <span className="mb-1 disease-name d-flex">
                                                            <span className="valid-dis-name">
                                                              {
                                                                data.diagnosisCode
                                                              }
                                                            </span>{" "}
                                                            -{" "}
                                                            {
                                                              data.actualDescription
                                                            }
                                                          </span>
                                                        </div>
                                                        <Popover
                                                          content={
                                                            data.dbDescription
                                                          }
                                                          title={
                                                            data.diagnosisCode
                                                          }
                                                          placement="bottom"
                                                          trigger="click"
                                                        >
                                                          <i>{SVGICON.infoIcon}</i>
                                                        </Popover>
                                                        <Popconfirm
                                                          title="Choose an action"
                                                          icon={
                                                            <QuestionCircleOutlined
                                                              style={{
                                                                color: "blue",
                                                              }}
                                                            />
                                                          }
                                                          okText="Move to Suggested"
                                                          cancelText="Move to Valid"
                                                          onCancel={
                                                            deletedToValid
                                                          }
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
                                                          description={
                                                            data.diagnosisCode
                                                          }
                                                          onConfirm={
                                                            deletedToSuggested
                                                          }
                                                          placement="leftTop"
                                                          onOpenChange={() =>
                                                            onchangeValid(
                                                              data.diagnosisCode,
                                                              data
                                                            )
                                                          }
                                                        >
                                                          <div className={visitStyles.close_icon}>
                                                            {SVGICON.closeIcon}
                                                          </div>
                                                        </Popconfirm>

                                                      </div>
                                                    </div>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="nonhcc">
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          <div className="col-xl-6">
                                            <ul className="timeline">
                                              <div className="invalid-text d-flex justify-content-sm-between">
                                                <span
                                                  className={`dang d-block`}
                                                >
                                                  {" "}
                                                  NON-HCC{" "}
                                                  <Badge
                                                    as="a"
                                                    href=""
                                                    bg="badge-circle invalid-bange"
                                                  >
                                                    {
                                                      newInValidDiseaseList.length
                                                    }
                                                  </Badge>
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <button
                                                    onClick={() =>
                                                      addValidDiseases()
                                                    }
                                                    className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faAdd}
                                                      fontSize={11}
                                                    />
                                                  </button>
                                                </div>
                                              </div>
                                              {newInValidDiseaseList.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className="timeline-panel invalid-disease">
                                                      <div className="media-body">
                                                        <span className="mb-1 disease-name d-flex">
                                                          <span className="valid-dis-name">
                                                            {
                                                              data.diagnosisCode
                                                            }
                                                          </span>{" "}
                                                          -{" "}
                                                          {
                                                            data.actualDescription
                                                          }
                                                        </span>
                                                      </div>
                                                      <Popconfirm
                                                        title="You want move to valid?"
                                                        description={
                                                          data.diagnosisCode
                                                        }
                                                        onConfirm={
                                                          confirmInvalid
                                                        }
                                                        placement="leftTop"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onOpenChange={() =>
                                                          onchangeValid(
                                                            data.diagnosisCode
                                                          )
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
                                                )
                                              )}
                                            </ul>
                                          </div>
                                          {/* {validDiseasesList.length == 0 ?
                                              <div className="card box-shadow-none">
                                                <div className="card combo-card">
                                                  <div className="col-xl-12">

                                                    <span className="no-patient-data">NO PATIENT DATA</span>
                                                  </div>
                                                </div></div>
                                              : null} */}
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>

                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="comboDiseases"
                                  >
                                    <div className="row">
                                      <div className="col-xl-6">
                                        <div className="invalid-combo">
                                          <span>
                                            Valid Codes{" "}
                                          </span>
                                        </div>
                                        <div className="my-post-content pt-3">
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
                                                    onClick={() =>
                                                      addValidDiseases()
                                                    }
                                                    className={visitStyles.combo_add_btn}
                                                  >
                                                    {SVGICON.addIcon}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {comboDiseaseCodesList?.map((item) => {
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
                                                  <div
                                                    className="col-xl-5 cr-pointer"
                                                    onClick={() =>
                                                      handleOpenModalCombinationCode(
                                                        item.diagnosisCodeCombo,
                                                        item.diseaseName
                                                      )
                                                    }
                                                  >
                                                    <span>
                                                      {item.diseaseName}
                                                    </span>
                                                  </div>
                                                  <div className="col-xl-1 comboclose">
                                                    <Popconfirm
                                                      title="You want move to Invalid?"
                                                      description={
                                                        item.diseaseName
                                                      }
                                                      onConfirm={
                                                        confirmComboInvalid
                                                      }
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
                                                        {SVGICON.closeIcon}
                                                      </div>
                                                    </Popconfirm>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}

                                          {comboDiseaseCodesList.length == 0 ? (
                                            <div className="card combo-card">
                                              <div className="col-xl-12">
                                                <div>
                                                  <span className="no-patient-data">
                                                    NO PATIENT DATA
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>

                                      <div className="col-xl-6">
                                        <div className="invalid-combo">
                                          <span>
                                            Invalid Codes{" "}
                                          </span>
                                        </div>
                                        <div className="my-post-content pt-3">
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
                                          {invalidComboDiseaseCodesList.length !=
                                            0 ? (
                                            <>

                                              {invalidComboDiseaseCodesList?.map(
                                                (item) => {
                                                  return (
                                                    <div className="card combo-card">
                                                      <div className="row">
                                                        <div className="col-xl-3">
                                                          <span className="font-bold">
                                                            {
                                                              item.diagnosisCodeCombo
                                                            }
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-3">
                                                          <span className="font-bold">
                                                            {item.addOnCode}
                                                          </span>
                                                        </div>
                                                        <div
                                                          className="col-xl-5 cr-pointer"
                                                          onClick={() =>
                                                            handleOpenModalCombinationCode(
                                                              item.diagnosisCodeCombo,
                                                              item.diseaseName
                                                            )
                                                          }
                                                        >
                                                          <span>
                                                            {item.diseaseName}
                                                          </span>
                                                        </div>
                                                        <div className="col-xl-1 comboclose">
                                                          <Popconfirm
                                                            title="You want move to Valid?"
                                                            description={
                                                              item.diseaseName
                                                            }
                                                            onConfirm={
                                                              confirmComboValid
                                                            }
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
                                                }
                                              )}
                                            </>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>

                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="meatCriteria"
                                  >
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
                                      {meatCriteriaList?.map((item) => {
                                        return (
                                          <div
                                            className={
                                              item.isMeatCriteriaPresent ===
                                                true
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
                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.monitorCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.monitorCapturedFromHeader,
                                                      item.monitor
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.monitorCapturedFromHeader
                                                  }
                                                </Badge>
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
                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.evaluateCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.evaluateCapturedFromHeader,
                                                      item.evaluate
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.evaluateCapturedFromHeader
                                                  }
                                                </Badge>
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
                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.assessmentCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.assessmentCapturedFromHeader,
                                                      item.assessment
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.assessmentCapturedFromHeader
                                                  }
                                                </Badge>
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

                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.treatmentCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.treatmentCapturedFromHeader,
                                                      item.treatment
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.treatmentCapturedFromHeader
                                                  }
                                                </Badge>
                                              </div>
                                              <div className="col-xl-1 meatclose">
                                                {/* {item.isMeatCriteriaPresent === true ?
                                             <span  className="badge badge-rounded badge-warning badge-meat">
                                             True
                                           </span>:
                                            <Badge  bg="success badge-circle mt-2">{item.isMeatCriteriaPresent}</Badge>} */}
                                                <Popconfirm
                                                  title="You want move to Invalid?"
                                                  description={
                                                    item.diseaseName
                                                  }
                                                  onConfirm={
                                                    confirmInvalidMeat
                                                  }
                                                  placement="leftTop"
                                                  okText="Yes"
                                                  cancelText="No"
                                                  onOpenChange={() =>
                                                    onchangeMeat(
                                                      item.diseaseName,
                                                      item.diagnosisCode
                                                    )
                                                  }
                                                >
                                                  <div className="icon-box  bg-danger-light me-1">
                                                    <FontAwesomeIcon
                                                      icon={faClose}
                                                      style={{ color: "red" }}
                                                    />
                                                  </div>
                                                </Popconfirm>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      {meatCriteriaList.length == 0 ? (
                                        <div className="card combo-card">
                                          <div className="col-xl-12">
                                            <div>
                                              <span className="no-patient-data">
                                                NO PATIENT DATA
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}
                                      {invalidMeatCriteriaList.length != 0 ? (
                                        <>
                                          <div className="invalid-combo">
                                            <span>Invalid MeatCriteria</span>
                                          </div>

                                          {invalidMeatCriteriaList?.map(
                                            (item) => {
                                              return (
                                                <div className={visitStyles.meat_details_card}>
                                                  <div className="row">
                                                    <div className="col-xl-1">
                                                      <span className="font-bold">
                                                        {item.diagnosisCode}
                                                      </span>
                                                    </div>
                                                    <div className="col-xl-2">
                                                      <Popover
                                                        placement="topLeft"
                                                        title="Description"
                                                        content={
                                                          item.diseaseName
                                                        }
                                                      >
                                                        <span className="meat-name-details">
                                                          {item.diseaseName}
                                                        </span>
                                                      </Popover>
                                                    </div>
                                                    <div className="col-xl-2 d-grid">
                                                      <Popover
                                                        placement="topLeft"
                                                        title="Monitor"
                                                        content={item.monitor}
                                                      >
                                                        <span className="meat-name-details">
                                                          {item.monitor}
                                                        </span>
                                                      </Popover>
                                                      <Badge
                                                        className="badge-meat cr-pointer"
                                                        bg={
                                                          item.monitorCapturedFromHeader ===
                                                            "HPI" ||
                                                            item.monitorCapturedFromHeader ===
                                                            "Plan: Hypertensive heart disease without heart failure" ||
                                                            item.monitorCapturedFromHeader ===
                                                            "Vital Signs"
                                                            ? "third badge-circle mt-2"
                                                            : item.monitorCapturedFromHeader ===
                                                              "Impression" ||
                                                              item.monitorCapturedFromHeader ===
                                                              "Plan: COPD" ||
                                                              item.monitorCapturedFromHeader ===
                                                              "Assessments" ||
                                                              item.monitorCapturedFromHeader ===
                                                              "Assessment"
                                                              ? "bg-eight badge-circle mt-2"
                                                              : item.monitorCapturedFromHeader ===
                                                                "Recommendations" ||
                                                                item.monitorCapturedFromHeader ===
                                                                "Plan: GERD without esophagitis" ||
                                                                item.monitorCapturedFromHeader ===
                                                                "Treatment"
                                                                ? "bgshodowcolor badge-circle mt-2"
                                                                : item.monitorCapturedFromHeader ===
                                                                  "Plan / Discussion" ||
                                                                  item.monitorCapturedFromHeader ===
                                                                  "Plan: Arteriosclerotic cardiovascular disease"
                                                                  ? "bg-four badge-circle mt-2"
                                                                  : item.monitorCapturedFromHeader ===
                                                                    "Patient Instructions" ||
                                                                    item.monitorCapturedFromHeader ===
                                                                    "Plan: Hyperlipidemia, acquired"
                                                                    ? "bg-five badge-circle mt-2"
                                                                    : item.monitorCapturedFromHeader ===
                                                                      "N/A"
                                                                      ? "bg-six badge-circle mt-2"
                                                                      : item.monitorCapturedFromHeader ===
                                                                        "Plan"
                                                                        ? "bg-seven badge-circle mt-2"
                                                                        : "primary badge-circle mt-2"
                                                        }
                                                        onClick={() =>
                                                          handleOpenModal(
                                                            item.monitorCapturedFromHeader,
                                                            item.monitor
                                                          )
                                                        }
                                                      >
                                                        {
                                                          item.monitorCapturedFromHeader
                                                        }
                                                      </Badge>
                                                    </div>
                                                    <div className="col-xl-2 d-grid">
                                                      <Popover
                                                        placement="topLeft"
                                                        title="Evaluation"
                                                        content={
                                                          item.evaluate
                                                        }
                                                      >
                                                        <span className="meat-name-details">
                                                          {item.evaluate}
                                                        </span>
                                                      </Popover>
                                                      <Badge
                                                        className="badge-meat cr-pointer"
                                                        bg={
                                                          item.evaluateCapturedFromHeader ===
                                                            "HPI" ||
                                                            item.evaluateCapturedFromHeader ===
                                                            "Plan: Hypertensive heart disease without heart failure" ||
                                                            item.evaluateCapturedFromHeader ===
                                                            "Vital Signs"
                                                            ? "third badge-circle mt-2"
                                                            : item.evaluateCapturedFromHeader ===
                                                              "Impression" ||
                                                              item.evaluateCapturedFromHeader ===
                                                              "Plan: COPD" ||
                                                              item.evaluateCapturedFromHeader ===
                                                              "Assessments" ||
                                                              item.evaluateCapturedFromHeader ===
                                                              "Assessment"
                                                              ? "bg-eight badge-circle mt-2"
                                                              : item.evaluateCapturedFromHeader ===
                                                                "Recommendations" ||
                                                                item.evaluateCapturedFromHeader ===
                                                                "Plan: GERD without esophagitis" ||
                                                                item.evaluateCapturedFromHeader ===
                                                                "Treatment"
                                                                ? "bgshodowcolor badge-circle mt-2"
                                                                : item.evaluateCapturedFromHeader ===
                                                                  "Plan / Discussion" ||
                                                                  item.evaluateCapturedFromHeader ===
                                                                  "Plan: Arteriosclerotic cardiovascular disease"
                                                                  ? "bg-four badge-circle mt-2"
                                                                  : item.evaluateCapturedFromHeader ===
                                                                    "Patient Instructions" ||
                                                                    item.evaluateCapturedFromHeader ===
                                                                    "Plan: Hyperlipidemia, acquired"
                                                                    ? "bg-five badge-circle mt-2"
                                                                    : item.evaluateCapturedFromHeader ===
                                                                      "N/A"
                                                                      ? "bg-six badge-circle mt-2"
                                                                      : item.evaluateCapturedFromHeader ===
                                                                        "Plan"
                                                                        ? "bg-seven badge-circle mt-2"
                                                                        : "primary badge-circle mt-2"
                                                        }
                                                        onClick={() =>
                                                          handleOpenModal(
                                                            item.evaluateCapturedFromHeader,
                                                            item.evaluate
                                                          )
                                                        }
                                                      >
                                                        {
                                                          item.evaluateCapturedFromHeader
                                                        }
                                                      </Badge>
                                                    </div>
                                                    <div className="col-xl-2 d-grid">
                                                      <Popover
                                                        placement="topLeft"
                                                        title="Assessment"
                                                        content={
                                                          item.assessment
                                                        }
                                                      >
                                                        <span className="meat-name-details">
                                                          {item.assessment}
                                                        </span>
                                                      </Popover>
                                                      <Badge
                                                        className="badge-meat cr-pointer"
                                                        bg={
                                                          item.assessmentCapturedFromHeader ===
                                                            "HPI" ||
                                                            item.assessmentCapturedFromHeader ===
                                                            "Plan: Hypertensive heart disease without heart failure" ||
                                                            item.assessmentCapturedFromHeader ===
                                                            "Vital Signs"
                                                            ? "third badge-circle mt-2"
                                                            : item.assessmentCapturedFromHeader ===
                                                              "Impression" ||
                                                              item.assessmentCapturedFromHeader ===
                                                              "Plan: COPD" ||
                                                              item.assessmentCapturedFromHeader ===
                                                              "Assessments" ||
                                                              item.assessmentCapturedFromHeader ===
                                                              "Assessment"
                                                              ? "bg-eight badge-circle mt-2"
                                                              : item.assessmentCapturedFromHeader ===
                                                                "Recommendations" ||
                                                                item.assessmentCapturedFromHeader ===
                                                                "Plan: GERD without esophagitis" ||
                                                                item.assessmentCapturedFromHeader ===
                                                                "Treatment"
                                                                ? "bgshodowcolor badge-circle mt-2"
                                                                : item.assessmentCapturedFromHeader ===
                                                                  "Plan / Discussion" ||
                                                                  item.assessmentCapturedFromHeader ===
                                                                  "Plan: Arteriosclerotic cardiovascular disease"
                                                                  ? "bg-four badge-circle mt-2"
                                                                  : item.assessmentCapturedFromHeader ===
                                                                    "Patient Instructions" ||
                                                                    item.assessmentCapturedFromHeader ===
                                                                    "Plan: Hyperlipidemia, acquired"
                                                                    ? "bg-five badge-circle mt-2"
                                                                    : item.assessmentCapturedFromHeader ===
                                                                      "N/A"
                                                                      ? "bg-six badge-circle mt-2"
                                                                      : item.assessmentCapturedFromHeader ===
                                                                        "Plan"
                                                                        ? "bg-seven badge-circle mt-2"
                                                                        : "primary badge-circle mt-2"
                                                        }
                                                        onClick={() =>
                                                          handleOpenModal(
                                                            item.assessmentCapturedFromHeader,
                                                            item.assessment
                                                          )
                                                        }
                                                      >
                                                        {
                                                          item.assessmentCapturedFromHeader
                                                        }
                                                      </Badge>
                                                    </div>
                                                    <div className="col-xl-2 d-grid">
                                                      <Popover
                                                        placement="topLeft"
                                                        title="Treatment"
                                                        content={
                                                          item.treatment
                                                        }
                                                      >
                                                        <span className="meat-name-details">
                                                          {item.treatment}
                                                        </span>
                                                      </Popover>

                                                      <Badge
                                                        className="badge-meat cr-pointer"
                                                        bg={
                                                          item.treatmentCapturedFromHeader ===
                                                            "HPI" ||
                                                            item.treatmentCapturedFromHeader ===
                                                            "Plan: Hypertensive heart disease without heart failure" ||
                                                            item.treatmentCapturedFromHeader ===
                                                            "Vital Signs"
                                                            ? "third badge-circle mt-2"
                                                            : item.treatmentCapturedFromHeader ===
                                                              "Impression" ||
                                                              item.treatmentCapturedFromHeader ===
                                                              "Plan: COPD" ||
                                                              item.treatmentCapturedFromHeader ===
                                                              "Assessments" ||
                                                              item.treatmentCapturedFromHeader ===
                                                              "Assessment"
                                                              ? "bg-eight badge-circle mt-2"
                                                              : item.treatmentCapturedFromHeader ===
                                                                "Recommendations" ||
                                                                item.treatmentCapturedFromHeader ===
                                                                "Plan: GERD without esophagitis" ||
                                                                item.treatmentCapturedFromHeader ===
                                                                "Treatment"
                                                                ? "bgshodowcolor badge-circle mt-2"
                                                                : item.treatmentCapturedFromHeader ===
                                                                  "Plan / Discussion" ||
                                                                  item.treatmentCapturedFromHeader ===
                                                                  "Plan: Arteriosclerotic cardiovascular disease"
                                                                  ? "bg-four badge-circle mt-2"
                                                                  : item.treatmentCapturedFromHeader ===
                                                                    "Patient Instructions" ||
                                                                    item.treatmentCapturedFromHeader ===
                                                                    "Plan: Hyperlipidemia, acquired"
                                                                    ? "bg-five badge-circle mt-2"
                                                                    : item.treatmentCapturedFromHeader ===
                                                                      "N/A"
                                                                      ? "bg-six badge-circle mt-2"
                                                                      : item.treatmentCapturedFromHeader ===
                                                                        "Plan"
                                                                        ? "bg-seven badge-circle mt-2"
                                                                        : "primary badge-circle mt-2"
                                                        }
                                                        onClick={() =>
                                                          handleOpenModal(
                                                            item.treatmentCapturedFromHeader,
                                                            item.treatment
                                                          )
                                                        }
                                                      >
                                                        {
                                                          item.treatmentCapturedFromHeader
                                                        }
                                                      </Badge>
                                                    </div>
                                                    <div className="col-xl-1 meatclose">
                                                      <Popconfirm
                                                        title="You want move to Valid?"
                                                        description={
                                                          item.diseaseName
                                                        }
                                                        onConfirm={
                                                          confirmValidMeat
                                                        }
                                                        placement="leftTop"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onOpenChange={() =>
                                                          onchangeMeat(
                                                            item.diseaseName,
                                                            item.diagnosisCode
                                                          )
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
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : null}
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="RafScore">
                                    <div className="my-post-content pt-3">
                                      <div className="row">
                                        <div className="col-xl-3">                                          
                                        </div>
                                        {rafScore != null ? (
                                          <div className="col-xl-12">
                                            {rafScore.scoreOutputDTOList !=
                                              null ? (
                                              <>
                                                {rafScore.scoreOutputDTOList.map(
                                                  (rafScoreMapResult) => {
                                                    return (
                                                      <div className="row raf-main-card">
                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head text-center">
                                                                <div className="col-xl-12">
                                                                  <label className="text-white">
                                                                    Summary
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <div className="row raf-details">
                                                                <div className="col-xl-6">
                                                                  <span>
                                                                    {
                                                                      rafScoreMapResult
                                                                        .hcc_model
                                                                        .model
                                                                    }
                                                                  </span>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                  <span>
                                                                    {
                                                                      rafScoreMapResult
                                                                        .hcc_model
                                                                        .version
                                                                    }
                                                                  </span>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head">
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    DX Code
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    DX
                                                                    Description
                                                                  </label>
                                                                </div>
                                                              </div>

                                                              {rafScoreMapResult.dx_hccs.map(
                                                                (item) => {
                                                                  return (
                                                                    <div className="row raf-details">
                                                                      <div className="col-xl-6">
                                                                        <span>
                                                                          {
                                                                            item.dx_name
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                      <div className="col-xl-6">
                                                                        <span>
                                                                          {
                                                                            item.dx_desc
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head">
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    HCC
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    HCC
                                                                    Description
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              {rafScoreMapResult.dx_hccs.map(
                                                                (res) => {
                                                                  return res.hcc_list.map(
                                                                    (
                                                                      res1
                                                                    ) => {
                                                                      return (
                                                                        <div className="row raf-details">
                                                                          <div className="col-xl-6">
                                                                            <span>
                                                                              {
                                                                                res1.hcc_name
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                          <div className="col-xl-6">
                                                                            <span>
                                                                              {
                                                                                res1.hcc_desc
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                        </div>
                                                                      );
                                                                    }
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head">
                                                                <div className="col-xl-4">
                                                                  <label className="text-white">
                                                                    Trumped By
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-4">
                                                                  <label className="text-white">
                                                                    RAF
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-4">
                                                                  <label className="text-white">
                                                                    Monthly
                                                                    Premium
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              {rafScoreMapResult.dx_hccs.map(
                                                                (res) => {
                                                                  return res.hcc_list.map(
                                                                    (
                                                                      res1
                                                                    ) => {
                                                                      return (
                                                                        <div className="row  raf-details">
                                                                          <div className="col-xl-4">
                                                                            <span>
                                                                              -
                                                                            </span>
                                                                          </div>
                                                                          <div className="col-xl-4">
                                                                            <span>
                                                                              {
                                                                                res1.hcc_raf
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                          <div className="col-xl-4">
                                                                            <span>
                                                                              $
                                                                              {
                                                                                res1.premium
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                        </div>
                                                                      );
                                                                    }
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </>
                                            ) : null}

                                            <div className="row raf-main-card">
                                              <div className="raf-name-head">
                                                <h5 className="raf-model-version">
                                                  SCORE DETAILS
                                                </h5>
                                              </div>

                                              <div className="col-xl-12">
                                                <div className="card">
                                                  <div className="raf-card">
                                                    <div className="row raf-head">
                                                      <div className="col-xl-2">
                                                        <label className="text-white">
                                                          v24Score
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <label className="text-white">
                                                          v24Score70Percent
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <label className="text-white">
                                                          v28Score
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <label className="text-white">
                                                          v28Score30Percent
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <label className="text-white">
                                                          Score
                                                        </label>
                                                      </div>
                                                    </div>
                                                    <div className="row  raf-details">
                                                      <div className="col-xl-2">
                                                        <span>
                                                          {rafScore.v24Score}
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <span>
                                                          {
                                                            rafScore.v24Score70Percent
                                                          }
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <span>
                                                          {rafScore.v28Score}
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <span>
                                                          {
                                                            rafScore.v28Score30Percent
                                                          }
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <span>
                                                          {rafScore.score}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                        {rafScore == null ? (
                                          <div className="card box-shadow-none">
                                            <div className="card combo-card">
                                              <div className="col-xl-12">
                                                <span className="no-patient-data">
                                                  NO PATIENT DATA
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                      {/* <div className="">

                                      <div className="compete-card">
                                        <Button
                                          className="btn btn-primary btn-sm me-1"
                                        >
                                          Compete
                                        </Button>
                                      </div>


                                    </div> */}
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="file">
                                    <div className="my-post-content pt-3">
                                      <div className="card">
                                        <div>
                                          <button
                                            onClick={() =>
                                              openNewTabDownloadPdf()
                                            }
                                            className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                          >
                                            Open New Tab
                                          </button>
                                        </div>
                                        <div className="card-body p-0">
                                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                            <div
                                              style={{
                                                height: "600px",
                                                maxWidth: "900px",
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                              }}
                                            >
                                              {" "}
                                              <Viewer
                                                fileUrl={selectFileURL}
                                                plugins={[
                                                  defaultLayoutPluginInstance,
                                                ]}
                                                onDocumentLoad={
                                                  handleDocumentLoad
                                                }
                                                renderLoader={(
                                                  percentages
                                                ) => (
                                                  <div
                                                    style={{ width: "240px" }}
                                                  >
                                                    <ProgressBar
                                                      progress={Math.round(
                                                        percentages
                                                      )}
                                                    />
                                                  </div>
                                                )}
                                              />
                                            </div>
                                          </Worker>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                </Tab.Content>
                              </Tab.Container>
                            </div>
                          </div>
                        </div>
                      ) : activeTab == 2 ? (
                        <div className={visitStyles.visitdata_tab_body}>
                          <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
                            <div className="custom-tab-1">
                              <Tab.Container defaultActiveKey={activeTabHead}>
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="file">
                                      File
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="validDiseases"
                                    >
                                      Visit Data
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="comboDiseases"
                                    >
                                      Combination Codes
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="meatCriteria"
                                    >
                                      MEAT Criteria
                                    </Nav.Link>
                                  </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="validDiseases"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`} >
                                                <span
                                                  className={`${visitStyles.hcc_title_name}`}
                                                >
                                                  NON-HCC
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.hcc_title_badge}`}>
                                                    {newInValidDiseaseList.length}
                                                  </span>
                                                </div>
                                              </div>
                                              {newInValidDiseaseList.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className={`${visitStyles.hcc_card}`}>
                                                      <div className="timeline-panel">
                                                        <div
                                                          className="media-body"
                                                          onClick={() =>
                                                            handleOpenModalCombinationCode(
                                                              data.diagnosisCode,
                                                              data.actualDescription,
                                                              "valid2",
                                                              "nonHcc"
                                                            )
                                                          }
                                                        >
                                                          <span className="mb-1 disease-name d-flex">
                                                            <span className="valid-dis-name">
                                                              {
                                                                data.diagnosisCode
                                                              }
                                                            </span>{" "}
                                                            -{" "}
                                                            {
                                                              data.actualDescription
                                                            }
                                                          </span>
                                                        </div>

                                                        <Popconfirm
                                                          title="You want move to valid?"
                                                          description={
                                                            data.diagnosisCode
                                                          }
                                                          onConfirm={
                                                            confirmInvalid
                                                          }
                                                          placement="leftTop"
                                                          okText="Yes"
                                                          cancelText="No"
                                                          onOpenChange={() =>
                                                            onchangeValid(
                                                              data.diagnosisCode,
                                                              data
                                                            )
                                                          }
                                                        >
                                                          <div className={visitStyles.close_icon}>
                                                            {SVGICON.closeIcon}
                                                          </div>
                                                        </Popconfirm>
                                                      </div>
                                                      <div className="d-flex justify-content-sm-between valid-providerdocument ">
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.encounterDate
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                            <i>{SVGICON.DatebirthIcon}</i>
                                                            {replaceString(
                                                              data.encounterDate
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.capturedSections
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`} onClick={() =>
                                                            handleOpenModalCombinationCode(
                                                              data.diagnosisCode,
                                                              data.capturedSections,
                                                              "valid"
                                                            )
                                                          }>
                                                            {replaceCaptureSection(
                                                              data.capturedSections
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                      </div>
                                                    </div>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>

                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`} >
                                                <span
                                                  className={`${visitStyles.suggested_title_name}`}
                                                >
                                                  Suggested Codes
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.suggested_title_badge}`}>
                                                    {suggestedNonHccList.length}
                                                  </span>
                                                </div>
                                              </div>
                                              {suggestedNonHccList?.map(
                                                (data) => {
                                                  return (
                                                    <>
                                                      {data.isHccValid ==
                                                        false ||
                                                        data.isHccValid ==
                                                        null ? (
                                                        <li>
                                                          <div className="new_valid-dis">
                                                            <div className="timeline-panel">
                                                              <div
                                                                className="media-body"
                                                                onClick={() =>
                                                                  handleOpenModalCombinationCode(
                                                                    data.diagnosisCode,
                                                                    data.actualDescription,
                                                                    "valid2",
                                                                    "nonHcc"
                                                                  )
                                                                }
                                                              >
                                                                <span className="mb-1 disease-name d-flex">
                                                                  <span className="valid-dis-name">
                                                                    {
                                                                      data.diagnosisCode
                                                                    }
                                                                  </span>{" "}
                                                                  -{" "}
                                                                  {
                                                                    data.actualDescription
                                                                  }
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
                                                                cancelText="Move to Valid"
                                                                onCancel={
                                                                  suggestedToValid
                                                                }
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
                                                                description={
                                                                  data.diagnosisCode
                                                                }
                                                                onConfirm={
                                                                  suggestedToDeleted
                                                                }
                                                                placement="leftTop"
                                                                onOpenChange={() =>
                                                                  onchangeValid(
                                                                    data.diagnosisCode,
                                                                    data
                                                                  )
                                                                }
                                                              >
                                                                <div className="icon-box  bg-danger-light me-1">
                                                                  <FontAwesomeIcon
                                                                    icon={faCheck}
                                                                    style={{
                                                                      color:
                                                                        "orange",
                                                                    }}
                                                                  />
                                                                </div>
                                                              </Popconfirm>


                                                            </div>
                                                            <div className="d-flex justify-content-sm-between valid-providerdocument ">
                                                              <Popover
                                                                placement="topLeft"
                                                                content={
                                                                  data.encounterDate
                                                                }
                                                              >
                                                                <Badge
                                                                  bg=" badge-rounded"
                                                                  className="badge-outline-info  mt-2"
                                                                >
                                                                  <FontAwesomeIcon
                                                                    icon={
                                                                      faCalendar
                                                                    }
                                                                    style={{
                                                                      color:
                                                                        "#918585",
                                                                    }}
                                                                  />
                                                                  {replaceString(
                                                                    data.encounterDate
                                                                  )}
                                                                </Badge>
                                                              </Popover>
                                                              <Popover
                                                                placement="topLeft"
                                                                content={
                                                                  data.capturedSections
                                                                }
                                                              >
                                                                <Badge
                                                                  bg=" badge-rounded"
                                                                  className="badge-outline-info  mt-2 cr-pointer"
                                                                  onClick={() =>
                                                                    handleOpenModalCombinationCode(
                                                                      data.diagnosisCode,
                                                                      data.capturedSections,
                                                                      "valid"
                                                                    )
                                                                  }
                                                                >
                                                                  {
                                                                    data.capturedSections
                                                                  }
                                                                </Badge>
                                                              </Popover>
                                                            </div>
                                                          </div>
                                                        </li>
                                                        // <li>
                                                        //   <div className="timeline-panel d-block invalid-disease">
                                                        //     <div
                                                        //       className="media-body"
                                                        //       onClick={() =>
                                                        //         handleOpenModalCombinationCode(
                                                        //           data.diagnosisCodeFinding,
                                                        //           data.actualDescription
                                                        //         )
                                                        //       }
                                                        //     >
                                                        //       <span className="mb-1 disease-name">
                                                        //         {
                                                        //           data.actualDescription
                                                        //         }
                                                        //       </span>
                                                        //     </div>

                                                        //     <div className="media-body d-flex">

                                                        //       {data.diagnosisCodeFinding !=
                                                        //         null &&
                                                        //         data.diagnosisCodeFinding !=
                                                        //         "" ? (
                                                        //         <div className="form-check custom-checkbox unmatch-check ms-3">
                                                        //           <div>
                                                        //             <Popconfirm
                                                        //               title="You want move to valid?"
                                                        //               description={
                                                        //                 data.diagnosisCodeDocument
                                                        //               }
                                                        //               onConfirm={
                                                        //                 onchangeSuggested
                                                        //               }
                                                        //               placement="rightTop"
                                                        //               okText="Yes"
                                                        //               cancelText="No"
                                                        //             >
                                                        //               <input
                                                        //                 onChange={(
                                                        //                   e
                                                        //                 ) => {
                                                        //                   handleMatchHcc(
                                                        //                     e,
                                                        //                     data,
                                                        //                     data.diagnosisCodeFinding
                                                        //                   );
                                                        //                 }}
                                                        //                 type="checkbox"
                                                        //                 id={`customCheckBox ${data.diagnosisCodeFinding}`}
                                                        //                 className="form-check-input unmatach-checkbox"
                                                        //                 required
                                                        //               />
                                                        //             </Popconfirm>
                                                        //           </div>
                                                        //           <Popover
                                                        //             placement="topLeft"
                                                        //             title="Finding Code"
                                                        //             content={
                                                        //               data.diagnosisCodeFinding
                                                        //             }
                                                        //           >
                                                        //             <span className="disease-name">
                                                        //               {
                                                        //                 data.diagnosisCodeFinding
                                                        //               }
                                                        //             </span>
                                                        //           </Popover>
                                                        //         </div>
                                                        //       ) : null}
                                                        //     </div>
                                                        //   </div>
                                                        // </li>
                                                      ) : null}
                                                    </>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="nonhcc">
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          <div className="col-xl-6">
                                            <ul className="timeline">
                                              <div className="invalid-text d-flex justify-content-sm-between">
                                                <span
                                                  className={`dang d-block`}
                                                >
                                                  {" "}
                                                  NON-HCC{" "}
                                                  <Badge
                                                    as="a"
                                                    href=""
                                                    bg="badge-circle invalid-bange"
                                                  >
                                                    {
                                                      newInValidDiseaseList.length
                                                    }
                                                  </Badge>
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <button
                                                    onClick={() =>
                                                      addValidDiseases()
                                                    }
                                                    className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faAdd}
                                                      fontSize={11}
                                                    />
                                                  </button>
                                                </div>
                                              </div>
                                              {newInValidDiseaseList.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className="timeline-panel invalid-disease">
                                                      <div className="media-body">
                                                        <span className="mb-1 disease-name d-flex">
                                                          <span className="valid-dis-name">
                                                            {
                                                              data.diagnosisCode
                                                            }
                                                          </span>{" "}
                                                          -{" "}
                                                          {
                                                            data.actualDescription
                                                          }
                                                        </span>
                                                      </div>
                                                      <Popconfirm
                                                        title="You want move to valid?"
                                                        description={
                                                          data.diagnosisCode
                                                        }
                                                        onConfirm={
                                                          confirmInvalid
                                                        }
                                                        placement="leftTop"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onOpenChange={() =>
                                                          onchangeValid(
                                                            data.diagnosisCode
                                                          )
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
                                                )
                                              )}
                                            </ul>
                                          </div>
                                          {validDiseasesList.length == 0 ? (
                                            <div className="card box-shadow-none">
                                              <div className="card combo-card">
                                                <div className="col-xl-12">
                                                  <span className="no-patient-data">
                                                    NO PATIENT DATA
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="comboDiseases"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="card combo-head-card">
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
                                                onClick={() =>
                                                  addValidDiseases()
                                                }
                                                className="btn bg-white hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                              >
                                                <FontAwesomeIcon
                                                  icon={faAdd}
                                                  fontSize={11}
                                                  color="blue"
                                                />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {comboDiseaseCodesListNonHcc?.map(
                                        (item) => {
                                          return (
                                            <div className="card combo-card">
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
                                                <div
                                                  className="col-xl-5 cr-pointer"
                                                  onClick={() =>
                                                    handleOpenModalCombinationCode(
                                                      item.diagnosisCodeCombo,
                                                      item.diseaseName
                                                    )
                                                  }
                                                >
                                                  <span>
                                                    {item.diseaseName}
                                                  </span>
                                                </div>
                                                <div className="col-xl-1 comboclose">
                                                  <Popconfirm
                                                    title="You want move to Invalid?"
                                                    description={
                                                      item.diseaseName
                                                    }
                                                    onConfirm={
                                                      confirmComboInvalid
                                                    }
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
                                                    <div className="icon-box  bg-danger-light me-1">
                                                      <FontAwesomeIcon
                                                        icon={faClose}
                                                        style={{
                                                          color: "red",
                                                        }}
                                                      />
                                                    </div>
                                                  </Popconfirm>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}

                                      {comboDiseaseCodesListNonHcc.length ==
                                        0 ? (
                                        <div className="card combo-card">
                                          <div className="col-xl-12">
                                            <div>
                                              <span className="no-patient-data">
                                                NO PATIENT DATA
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}

                                      {invalidComboDiseaseCodesList.length !=
                                        0 ? (
                                        <>
                                          <div className="invalid-combo">
                                            <span>
                                              Invalid Combo Diseases{" "}
                                            </span>
                                          </div>

                                          {invalidComboDiseaseCodesList?.map(
                                            (item) => {
                                              return (
                                                <div className="card combo-card">
                                                  <div className="row">
                                                    <div className="col-xl-3">
                                                      <span className="font-bold">
                                                        {
                                                          item.diagnosisCodeCombo
                                                        }
                                                      </span>
                                                    </div>
                                                    <div className="col-xl-3">
                                                      <span className="font-bold">
                                                        {item.addOnCode}
                                                      </span>
                                                    </div>
                                                    <div
                                                      className="col-xl-5 cr-pointer"
                                                      onClick={() =>
                                                        handleOpenModalCombinationCode(
                                                          item.diagnosisCodeCombo,
                                                          item.diseaseName
                                                        )
                                                      }
                                                    >
                                                      <span>
                                                        {item.diseaseName}
                                                      </span>
                                                    </div>
                                                    <div className="col-xl-1 comboclose">
                                                      <Popconfirm
                                                        title="You want move to Valid?"
                                                        description={
                                                          item.diseaseName
                                                        }
                                                        onConfirm={
                                                          confirmComboValid
                                                        }
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
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : null}
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="meatCriteria"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="card meat-head-card">
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
                                      {meatCriteriaListNonHcc?.map((item) => {
                                        return (
                                          <div
                                            className={
                                              item.isMeatCriteriaPresent ===
                                                true
                                                ? "card meat-card"
                                                : "card meat-card-false"
                                            }
                                          >
                                            <div className="row">
                                              <div className="col-xl-1">
                                                <span className="font-bold">
                                                  {item.diagnosisCode}
                                                </span>
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
                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.monitorCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.monitorCapturedFromHeader,
                                                      item.monitor
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.monitorCapturedFromHeader
                                                  }
                                                </Badge>
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
                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.evaluateCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.evaluateCapturedFromHeader,
                                                      item.evaluate
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.evaluateCapturedFromHeader
                                                  }
                                                </Badge>
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
                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.assessmentCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.assessmentCapturedFromHeader,
                                                      item.assessment
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.assessmentCapturedFromHeader
                                                  }
                                                </Badge>
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

                                                <Badge
                                                  className="badge-meat cr-pointer badge-circle mt-2"
                                                  bg={` badge-circle mt-2 ${item.treatmentCapturedFromHeaderColor} `}
                                                  onClick={() =>
                                                    handleOpenModal(
                                                      item.treatmentCapturedFromHeader,
                                                      item.treatment
                                                    )
                                                  }
                                                >
                                                  {
                                                    item.treatmentCapturedFromHeader
                                                  }
                                                </Badge>
                                              </div>
                                              <div className="col-xl-1 meatclose">
                                                <Popconfirm
                                                  title="You want move to Invalid?"
                                                  description={
                                                    item.diseaseName
                                                  }
                                                  onConfirm={
                                                    confirmInvalidMeat
                                                  }
                                                  placement="leftTop"
                                                  okText="Yes"
                                                  cancelText="No"
                                                  onOpenChange={() =>
                                                    onchangeMeat(
                                                      item.diseaseName,
                                                      item.diagnosisCode
                                                    )
                                                  }
                                                >
                                                  <div className="icon-box  bg-danger-light me-1">
                                                    <FontAwesomeIcon
                                                      icon={faClose}
                                                      style={{ color: "red" }}
                                                    />
                                                  </div>
                                                </Popconfirm>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      {meatCriteriaListNonHcc.length == 0 ? (
                                        <div className="card combo-card">
                                          <div className="col-xl-12">
                                            <div>
                                              <span className="no-patient-data">
                                                NO PATIENT DATA
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}

                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="RafScore">
                                    <div className="my-post-content pt-3">
                                      <div className="row">
                                        <div className="col-xl-3">
                                          {/* <div className="card raf-file-head">

                                        <div className="row">
                                          <div className="col-xl-12 mb-3 text-center">
                                            <Button
                                              className="btn btn-primary btn-sm me-1"
                                            >
                                              Uplaod File
                                            </Button>

                                          </div>
                                          <div className="col-xl-12 mb-3">
                                            <Form.Control
                                              required
                                              type="file"
                                              accept="application/pdf,text/plain"

                                            />
                                          </div>
                                          <div className="col-xl-12 mb-3">
                                            <Form.Control
                                              required
                                              type="date"

                                            />
                                          </div>
                                        </div>

                                      </div> */}
                                        </div>
                                        {rafScore != null ? (
                                          <div className="col-xl-12">
                                            {rafScore.scoreOutputDTOList !=
                                              null ? (
                                              <>
                                                {rafScore.scoreOutputDTOList.map(
                                                  (rafScoreMapResult) => {
                                                    return (
                                                      <div className="row raf-main-card">
                                                        {/* <div className="raf-name-head">
                                                  <h5 className="raf-model-version">{rafScoreMapResult.hcc_model.model} - {rafScoreMapResult.hcc_model.version}</h5>
                                                </div> */}

                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head text-center">
                                                                <div className="col-xl-12">
                                                                  <label className="text-white">
                                                                    Summary
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <div className="row raf-details">
                                                                <div className="col-xl-6">
                                                                  <span>
                                                                    {
                                                                      rafScoreMapResult
                                                                        .hcc_model
                                                                        .model
                                                                    }
                                                                  </span>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                  <span>
                                                                    {
                                                                      rafScoreMapResult
                                                                        .hcc_model
                                                                        .version
                                                                    }
                                                                  </span>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head">
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    DX Code
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    DX
                                                                    Description
                                                                  </label>
                                                                </div>
                                                              </div>

                                                              {rafScoreMapResult.dx_hccs.map(
                                                                (item) => {
                                                                  return (
                                                                    <div className="row raf-details">
                                                                      <div className="col-xl-6">
                                                                        <span>
                                                                          {
                                                                            item.dx_name
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                      <div className="col-xl-6">
                                                                        <span>
                                                                          {
                                                                            item.dx_desc
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head">
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    HCC
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-6">
                                                                  <label className="text-white">
                                                                    HCC
                                                                    Description
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              {rafScoreMapResult.dx_hccs.map(
                                                                (res) => {
                                                                  return res.hcc_list.map(
                                                                    (
                                                                      res1
                                                                    ) => {
                                                                      return (
                                                                        <div className="row raf-details">
                                                                          <div className="col-xl-6">
                                                                            <span>
                                                                              {
                                                                                res1.hcc_name
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                          <div className="col-xl-6">
                                                                            <span>
                                                                              {
                                                                                res1.hcc_desc
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                        </div>
                                                                      );
                                                                    }
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="col-xl-6">
                                                          <div className="card">
                                                            <div className="raf-card">
                                                              <div className="row raf-head">
                                                                <div className="col-xl-4">
                                                                  <label className="text-white">
                                                                    Trumped By
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-4">
                                                                  <label className="text-white">
                                                                    RAF
                                                                  </label>
                                                                </div>
                                                                <div className="col-xl-4">
                                                                  <label className="text-white">
                                                                    Monthly
                                                                    Premium
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              {rafScoreMapResult.dx_hccs.map(
                                                                (res) => {
                                                                  return res.hcc_list.map(
                                                                    (
                                                                      res1
                                                                    ) => {
                                                                      return (
                                                                        <div className="row  raf-details">
                                                                          <div className="col-xl-4">
                                                                            <span>
                                                                              -
                                                                            </span>
                                                                          </div>
                                                                          <div className="col-xl-4">
                                                                            <span>
                                                                              {
                                                                                res1.hcc_raf
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                          <div className="col-xl-4">
                                                                            <span>
                                                                              $
                                                                              {
                                                                                res1.premium
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                        </div>
                                                                      );
                                                                    }
                                                                  );
                                                                }
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </>
                                            ) : null}

                                            <div className="row raf-main-card">
                                              <div className="raf-name-head">
                                                <h5 className="raf-model-version">
                                                  SCORE DETAILS
                                                </h5>
                                              </div>

                                              <div className="col-xl-12">
                                                <div className="card">
                                                  <div className="raf-card">
                                                    <div className="row raf-head">
                                                      <div className="col-xl-2">
                                                        <label className="text-white">
                                                          v24Score
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <label className="text-white">
                                                          v24Score70Percent
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <label className="text-white">
                                                          v28Score
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <label className="text-white">
                                                          v28Score30Percent
                                                        </label>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <label className="text-white">
                                                          Score
                                                        </label>
                                                      </div>
                                                    </div>
                                                    <div className="row  raf-details">
                                                      <div className="col-xl-2">
                                                        <span>
                                                          {rafScore.v24Score}
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <span>
                                                          {
                                                            rafScore.v24Score70Percent
                                                          }
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <span>
                                                          {rafScore.v28Score}
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-3">
                                                        <span>
                                                          {
                                                            rafScore.v28Score30Percent
                                                          }
                                                        </span>
                                                      </div>
                                                      <div className="col-xl-2">
                                                        <span>
                                                          {rafScore.score}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                        {rafScore == null ? (
                                          <div className="card box-shadow-none">
                                            <div className="card combo-card">
                                              <div className="col-xl-12">
                                                <span className="no-patient-data">
                                                  NO PATIENT DATA
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                      {/* <div className="">

                                    <div className="compete-card">
                                      <Button
                                        className="btn btn-primary btn-sm me-1"
                                      >
                                        Compete
                                      </Button>
                                    </div>


                                  </div> */}
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="file">
                                    <div className="my-post-content pt-3">
                                      <div className="card">
                                        <div>
                                          <button
                                            onClick={() =>
                                              openNewTabDownloadPdf()
                                            }
                                            className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                          >
                                            Open New Tab
                                          </button>
                                        </div>
                                        <div className="card-body p-0">
                                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                            <div
                                              style={{
                                                height: "600px",
                                                maxWidth: "900px",
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                              }}
                                            >
                                              {" "}
                                              <Viewer
                                                fileUrl={selectFileURL}
                                                plugins={[
                                                  defaultLayoutPluginInstance,
                                                ]}
                                                onDocumentLoad={
                                                  handleDocumentLoad
                                                }
                                                renderLoader={(
                                                  percentages
                                                ) => (
                                                  <div
                                                    style={{ width: "240px" }}
                                                  >
                                                    <ProgressBar
                                                      progress={Math.round(
                                                        percentages
                                                      )}
                                                    />
                                                  </div>
                                                )}
                                              />
                                            </div>
                                          </Worker>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                </Tab.Content>
                              </Tab.Container>
                            </div>
                          </div>
                        </div>
                      ) : activeTab == 3 ? (
                        <div className={visitStyles.visitdata_tab_body}>
                          <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
                            <div className="custom-tab-1">
                              <Tab.Container defaultActiveKey={activeTabHead}>
                                <Nav as="ul" className="nav nav-tabs">
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="validDiseases"
                                    >
                                      Visit Data
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="comboDiseases"
                                    >
                                      Combination Codes
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="meatCriteria"
                                    >
                                      MEAT Criteria
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="file">
                                      File
                                    </Nav.Link>
                                  </Nav.Item>

                                  {/* {activeTab == 3 ? (
                                        <div>
                                          <Button
                                            onClick={addPatientFile}
                                            className="btn btn-primary btn-sm ms-2 flr radiologyBtn"
                                          >
                                            + Add Patient Radiology
                                          </Button>
                                        </div>
                                      ) : null} */}
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="validDiseases"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`} >
                                                <span
                                                  className={`${visitStyles.hcc_title_name}`}
                                                >
                                                  HCC
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.hcc_title_badge}`}>
                                                    {newValidDiseaseListRadiology.length}
                                                  </span>
                                                </div>
                                              </div>

                                              {newValidDiseaseListRadiology.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className={`${visitStyles.hcc_card}`}>
                                                      <div className="timeline-panel">
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
                                                              {
                                                                data.diagnosisCode
                                                              }
                                                            </span>{" "}
                                                            -{" "}
                                                            {
                                                              data.actualDescription
                                                            }
                                                          </span>
                                                        </div>

                                                        {/* <Popover
                                                              className="info-hcc-details"
                                                              onClick={() =>
                                                                getValidHccDetails(
                                                                  data.actualDescription,
                                                                  data.diagnosisCode
                                                                )
                                                              }
                                                              content={
                                                                validHccDetails
                                                              }
                                                              title={
                                                                data.diagnosisCode
                                                              }
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
                                                            </Popover> */}

                                                        <Popconfirm
                                                          title="You want to delete?"
                                                          description={
                                                            data.diagnosisCode
                                                          }
                                                          onConfirm={
                                                            confirmvalid
                                                          }
                                                          placement="leftTop"
                                                          okText="Yes"
                                                          cancelText="No"
                                                          onOpenChange={() =>
                                                            onchangeValid(
                                                              data.diagnosisCode
                                                            )
                                                          }
                                                        ><div className={visitStyles.close_icon}>
                                                            {SVGICON.closeIcon}
                                                          </div>
                                                        </Popconfirm>
                                                      </div>
                                                      <div className="d-flex justify-content-sm-between valid-providerdocument ">
                                                        <Popover
                                                          placement="topLeft"
                                                          title=""
                                                          content={
                                                            patientDocumentResult.patientName
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                            <i>{SVGICON.patientNameIcon}</i>
                                                            {
                                                              patientDocumentResult.patientName
                                                            }
                                                          </Badge>

                                                        </Popover>
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.encounterDate
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                            <i>{SVGICON.DatebirthIcon}</i>
                                                            {replaceString(
                                                              data.encounterDate
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.capturedSections
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`} onClick={() =>
                                                            handleOpenModalCombinationCode(
                                                              data.diagnosisCode,
                                                              data.capturedSections,
                                                              "valid"
                                                            )
                                                          }>
                                                            {replaceCaptureSection(
                                                              data.capturedSections
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                      </div>
                                                    </div>
                                                  </li>
                                                )
                                              )}
                                            </ul>

                                          </div>

                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`} >
                                                <span
                                                  className={`${visitStyles.suggested_title_name}`}
                                                >
                                                  NON-HCC
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.suggested_title_badge}`}>
                                                    {newInValidDiseaseListRadiology.length}
                                                  </span>
                                                </div>
                                              </div>
                                              {newInValidDiseaseListRadiology.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className={`${visitStyles.hcc_card}`}>
                                                      <div className="timeline-panel">
                                                        <div className="media-body">
                                                          <span className="mb-1 disease-name d-flex">
                                                            <span className="valid-dis-name">
                                                              {
                                                                data.diagnosisCode
                                                              }
                                                            </span>{" "}
                                                            -{" "}
                                                            {
                                                              data.actualDescription
                                                            }
                                                          </span>
                                                        </div>
                                                        <Popconfirm
                                                          title="You want move to valid?"
                                                          description={
                                                            data.diagnosisCode
                                                          }
                                                          onConfirm={
                                                            confirmInvalid
                                                          }
                                                          placement="leftTop"
                                                          okText="Yes"
                                                          cancelText="No"
                                                          onOpenChange={() =>
                                                            onchangeValid(
                                                              data.diagnosisCode
                                                            )
                                                          }
                                                        >

                                                          <div className={visitStyles.close_icon}>
                                                            {SVGICON.closeIcon}
                                                          </div>
                                                        </Popconfirm>
                                                      </div>
                                                    </div>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>

                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.deleted_title_card}`} >
                                                <span
                                                  className={`${visitStyles.deleted_title_name}`}
                                                >
                                                  Deleted Codes
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.deleted_title_badge}`}>
                                                    {invalidMoveDiseasesList.length}
                                                  </span>
                                                </div>
                                              </div>
                                              {invalidMoveDiseasesList.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className="timeline-panel invalid-disease">
                                                      <div className="media-body">
                                                        <span className="mb-1 disease-name d-flex">
                                                          <span className="valid-dis-name">
                                                            {
                                                              data.diagnosisCode
                                                            }
                                                          </span>{" "}
                                                          -{" "}
                                                          {
                                                            data.actualDescription
                                                          }
                                                        </span>
                                                      </div>
                                                      <Popover
                                                        content={
                                                          data.dbDescription
                                                        }
                                                        title={
                                                          data.diagnosisCode
                                                        }
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
                                                        description={
                                                          data.diagnosisCode
                                                        }
                                                        onConfirm={
                                                          confirmInvalidMoveDis
                                                        }
                                                        placement="leftTop"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onOpenChange={() =>
                                                          onchangeValid(
                                                            data.diagnosisCode
                                                          )
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
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="nonhcc">
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          <div className="col-xl-6">
                                            <ul className="timeline">
                                              <div className="invalid-text d-flex justify-content-sm-between">
                                                <span
                                                  className={`dang d-block`}
                                                >
                                                  {" "}
                                                  NON-HCC{" "}
                                                  <Badge
                                                    as="a"
                                                    href=""
                                                    bg="badge-circle invalid-bange"
                                                  >
                                                    {
                                                      newInValidDiseaseListRadiology.length
                                                    }
                                                  </Badge>
                                                </span>
                                              </div>
                                              {newInValidDiseaseListRadiology.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className="timeline-panel invalid-disease">
                                                      <div className="media-body">
                                                        <span className="mb-1 disease-name d-flex">
                                                          <span className="valid-dis-name">
                                                            {
                                                              data.diagnosisCode
                                                            }
                                                          </span>{" "}
                                                          -{" "}
                                                          {
                                                            data.actualDescription
                                                          }
                                                        </span>
                                                      </div>
                                                      <Popconfirm
                                                        title="You want move to valid?"
                                                        description={
                                                          data.diagnosisCode
                                                        }
                                                        onConfirm={
                                                          confirmInvalid
                                                        }
                                                        placement="leftTop"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onOpenChange={() =>
                                                          onchangeValid(
                                                            data.diagnosisCode
                                                          )
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
                                                )
                                              )}
                                            </ul>
                                          </div>
                                          {validDiseasesList.length == 0 ? (
                                            <div className="card box-shadow-none">
                                              <div className="card combo-card">
                                                <div className="col-xl-12">
                                                  <span className="no-patient-data">
                                                    NO PATIENT DATA
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="comboDiseases"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="card combo-head-card">
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
                                                onClick={() =>
                                                  addValidDiseases()
                                                }
                                                className="btn bg-white hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                              >
                                                <FontAwesomeIcon
                                                  icon={faAdd}
                                                  fontSize={11}
                                                  color="blue"
                                                />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {comboDiseaseCodesListRadiology?.map(
                                        (item) => {
                                          return (
                                            <div className="card combo-card">
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
                                                  <span>
                                                    {item.diseaseName}
                                                  </span>
                                                </div>
                                                <div className="col-xl-1 comboclose">
                                                  <Popconfirm
                                                    title="You want move to Invalid?"
                                                    description={
                                                      item.diseaseName
                                                    }
                                                    onConfirm={
                                                      confirmComboInvalid
                                                    }
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
                                                    <div className="icon-box  bg-danger-light me-1">
                                                      <FontAwesomeIcon
                                                        icon={faClose}
                                                        style={{
                                                          color: "red",
                                                        }}
                                                      />
                                                    </div>
                                                  </Popconfirm>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}

                                      {comboDiseaseCodesListRadiology.length ==
                                        0 ? (
                                        <div className="card combo-card">
                                          <div className="col-xl-12">
                                            <div>
                                              <span className="no-patient-data">
                                                NO PATIENT DATA
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}

                                      {invalidComboDiseaseCodesList.length !=
                                        0 ? (
                                        <>
                                          <div className="invalid-combo">
                                            <span>
                                              Invalid Combo Diseases{" "}
                                            </span>
                                          </div>

                                          {invalidComboDiseaseCodesList?.map(
                                            (item) => {
                                              return (
                                                <div className="card combo-card">
                                                  <div className="row">
                                                    <div className="col-xl-3">
                                                      <span className="font-bold">
                                                        {
                                                          item.diagnosisCodeCombo
                                                        }
                                                      </span>
                                                    </div>
                                                    <div className="col-xl-3">
                                                      <span className="font-bold">
                                                        {item.addOnCode}
                                                      </span>
                                                    </div>
                                                    <div className="col-xl-5">
                                                      <span>
                                                        {item.diseaseName}
                                                      </span>
                                                    </div>
                                                    <div className="col-xl-1 comboclose">
                                                      <Popconfirm
                                                        title="You want move to Valid?"
                                                        description={
                                                          item.diseaseName
                                                        }
                                                        onConfirm={
                                                          confirmComboValid
                                                        }
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
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : null}
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="meatCriteria"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="card meat-head-card">
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
                                      {meatCriteriaListRadiology?.map(
                                        (item) => {
                                          return (
                                            <div
                                              className={
                                                item.isMeatCriteriaPresent ===
                                                  true
                                                  ? "card meat-card"
                                                  : "card meat-card-false"
                                              }
                                            >
                                              <div className="row">
                                                <div className="col-xl-1">
                                                  <span className="font-bold">
                                                    {item.diagnosisCode}
                                                  </span>
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
                                                  <Badge
                                                    className="badge-meat cr-pointer badge-circle mt-2"
                                                    bg={` badge-circle mt-2 ${item.monitorCapturedFromHeaderColor} `}
                                                    onClick={() =>
                                                      handleOpenModalRadiology(
                                                        item.monitorCapturedFromHeader,
                                                        item.monitor
                                                      )
                                                    }
                                                  >
                                                    {
                                                      item.monitorCapturedFromHeader
                                                    }
                                                  </Badge>
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
                                                  <Badge
                                                    className="badge-meat cr-pointer badge-circle mt-2"
                                                    bg={` badge-circle mt-2 ${item.evaluateCapturedFromHeaderColor} `}
                                                    onClick={() =>
                                                      handleOpenModalRadiology(
                                                        item.evaluateCapturedFromHeader,
                                                        item.evaluate
                                                      )
                                                    }
                                                  >
                                                    {
                                                      item.evaluateCapturedFromHeader
                                                    }
                                                  </Badge>
                                                </div>
                                                <div className="col-xl-2 d-grid">
                                                  {item.assessment != "" ? (
                                                    <Popover
                                                      placement="topLeft"
                                                      title="Assessment"
                                                      content={
                                                        item.assessment
                                                      }
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
                                                  <Badge
                                                    className="badge-meat cr-pointer badge-circle mt-2"
                                                    bg={` badge-circle mt-2 ${item.assessmentCapturedFromHeaderColor} `}
                                                    onClick={() =>
                                                      handleOpenModalRadiology(
                                                        item.assessmentCapturedFromHeader,
                                                        item.assessment
                                                      )
                                                    }
                                                  >
                                                    {
                                                      item.assessmentCapturedFromHeader
                                                    }
                                                  </Badge>
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

                                                  <Badge
                                                    className="badge-meat cr-pointer badge-circle mt-2"
                                                    bg={` badge-circle mt-2 ${item.treatmentCapturedFromHeaderColor} `}
                                                    onClick={() =>
                                                      handleOpenModalRadiology(
                                                        item.treatmentCapturedFromHeader,
                                                        item.treatment
                                                      )
                                                    }
                                                  >
                                                    {
                                                      item.treatmentCapturedFromHeader
                                                    }
                                                  </Badge>
                                                </div>
                                                {/* <div className="col-xl-2 d-grid">
                                                {item.monitor != "" ?                                 
                                                <Popover placement="topLeft" title="Monitor" content={item.monitor}>
                                                  <span className="meat-name-details">{item.monitor}</span>
                                                </Popover>:<span className="meat-name-details text-center font-bold">-</span>}
                                                <Badge  className="badge-meat cr-pointer" bg={(item.monitorCapturedFromHeader === "HPI" || item.monitorCapturedFromHeader === "Plan: Hypertensive heart disease without heart failure" || item.monitorCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.monitorCapturedFromHeader === "Impression" || item.monitorCapturedFromHeader === "Plan: COPD" || item.monitorCapturedFromHeader === "Assessments" || item.monitorCapturedFromHeader === "Assessment") ? "bg-eight badge-circle mt-2" : (item.monitorCapturedFromHeader === "Recommendations" || item.monitorCapturedFromHeader === "Plan: GERD without esophagitis" || item.monitorCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : (item.monitorCapturedFromHeader === "Plan / Discussion" || item.monitorCapturedFromHeader === "Plan: Arteriosclerotic cardiovascular disease") ? "bg-four badge-circle mt-2" : (item.monitorCapturedFromHeader === "Patient Instructions" || item.monitorCapturedFromHeader === "Plan: Hyperlipidemia, acquired") ? "bg-five badge-circle mt-2" : item.monitorCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : item.monitorCapturedFromHeader === "Plan" ? "bg-seven badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.monitorCapturedFromHeader,item.monitor)}>{item.monitorCapturedFromHeader}</Badge>
                                              </div>
                                              <div className="col-xl-2 d-grid">
                                              {item.evaluate != "" ?        
                                                <Popover placement="topLeft" title="Evaluation" content={item.evaluate}>
                                                  <span className="meat-name-details">{item.evaluate}</span>
                                                  </Popover>:<span className="meat-name-details text-center font-bold">-</span>}
                                                <Badge className="badge-meat cr-pointer" bg={(item.evaluateCapturedFromHeader === "HPI" || item.evaluateCapturedFromHeader === "Plan: Hypertensive heart disease without heart failure" || item.evaluateCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.evaluateCapturedFromHeader === "Impression" || item.evaluateCapturedFromHeader === "Plan: COPD" || item.evaluateCapturedFromHeader === "Assessments" || item.evaluateCapturedFromHeader === "Assessment") ? "bg-eight badge-circle mt-2" : (item.evaluateCapturedFromHeader === "Recommendations" || item.evaluateCapturedFromHeader === "Plan: GERD without esophagitis" || item.evaluateCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : (item.evaluateCapturedFromHeader === "Plan / Discussion" || item.evaluateCapturedFromHeader === "Plan: Arteriosclerotic cardiovascular disease") ? "bg-four badge-circle mt-2" : (item.evaluateCapturedFromHeader === "Patient Instructions" || item.evaluateCapturedFromHeader === "Plan: Hyperlipidemia, acquired") ? "bg-five badge-circle mt-2" : item.evaluateCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : item.evaluateCapturedFromHeader === "Plan" ? "bg-seven badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.evaluateCapturedFromHeader,item.evaluate)}>{item.evaluateCapturedFromHeader}</Badge>
                                              </div>
                                              <div className="col-xl-2 d-grid">
                                              {item.assessment != "" ?     
                                                <Popover placement="topLeft" title="Assessment" content={item.assessment}>
                                                  <span className="meat-name-details">{item.assessment}</span>
                                                  </Popover>:<span className="meat-name-details text-center font-bold">-</span>}
                                                <Badge className="badge-meat cr-pointer" bg={(item.assessmentCapturedFromHeader === "HPI" || item.assessmentCapturedFromHeader === "Plan: Hypertensive heart disease without heart failure" || item.assessmentCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.assessmentCapturedFromHeader === "Impression" || item.assessmentCapturedFromHeader === "Plan: COPD" || item.assessmentCapturedFromHeader === "Assessments" || item.assessmentCapturedFromHeader === "Assessment") ? "bg-eight badge-circle mt-2" : (item.assessmentCapturedFromHeader === "Recommendations" || item.assessmentCapturedFromHeader === "Plan: GERD without esophagitis" || item.assessmentCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : (item.assessmentCapturedFromHeader === "Plan / Discussion" || item.assessmentCapturedFromHeader === "Plan: Arteriosclerotic cardiovascular disease") ? "bg-four badge-circle mt-2" : (item.assessmentCapturedFromHeader === "Patient Instructions" || item.assessmentCapturedFromHeader === "Plan: Hyperlipidemia, acquired") ? "bg-five badge-circle mt-2" : item.assessmentCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : item.assessmentCapturedFromHeader === "Plan" ? "bg-seven badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.assessmentCapturedFromHeader,item.assessment)}>{item.assessmentCapturedFromHeader}</Badge>
                                              </div>
                                              <div className="col-xl-2 d-grid">
                                                  {item.treatment != "" ?     
                                                <Popover placement="topLeft" title="Treatment" content={item.treatment}>
                                                  <span className="meat-name-details">{item.treatment}</span>
                                                  </Popover>:<span className="meat-name-details text-center font-bold">-</span>}

                                                <Badge className="badge-meat cr-pointer" bg={(item.treatmentCapturedFromHeader === "HPI" || item.treatmentCapturedFromHeader === "Plan: Hypertensive heart disease without heart failure" || item.treatmentCapturedFromHeader === "Vital Signs") ? "third badge-circle mt-2" : (item.treatmentCapturedFromHeader === "Impression" || item.treatmentCapturedFromHeader === "Plan: COPD" || item.treatmentCapturedFromHeader === "Assessments" || item.treatmentCapturedFromHeader === "Assessment") ? "bg-eight badge-circle mt-2" : (item.treatmentCapturedFromHeader === "Recommendations" || item.treatmentCapturedFromHeader === "Plan: GERD without esophagitis" || item.treatmentCapturedFromHeader === "Treatment") ? "bgshodowcolor badge-circle mt-2" : (item.treatmentCapturedFromHeader === "Plan / Discussion" || item.treatmentCapturedFromHeader === "Plan: Arteriosclerotic cardiovascular disease") ? "bg-four badge-circle mt-2" : (item.treatmentCapturedFromHeader === "Patient Instructions" || item.treatmentCapturedFromHeader === "Plan: Hyperlipidemia, acquired") ? "bg-five badge-circle mt-2" : item.treatmentCapturedFromHeader === "N/A" ? "bg-six badge-circle mt-2" : item.treatmentCapturedFromHeader === "Plan" ? "bg-seven badge-circle mt-2" : "primary badge-circle mt-2"} onClick={() => handleOpenModal(item.treatmentCapturedFromHeader,item.treatment)} >{item.treatmentCapturedFromHeader}</Badge>
                                              </div> */}
                                                <div className="col-xl-1 meatclose">
                                                  {/* {item.isMeatCriteriaPresent === true ?
                                             <span  className="badge badge-rounded badge-warning badge-meat">
                                             True
                                           </span>:
                                            <Badge  bg="success badge-circle mt-2">{item.isMeatCriteriaPresent}</Badge>} */}
                                                  <Popconfirm
                                                    title="You want move to Invalid?"
                                                    description={
                                                      item.diseaseName
                                                    }
                                                    onConfirm={
                                                      confirmInvalidMeat
                                                    }
                                                    placement="leftTop"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onOpenChange={() =>
                                                      onchangeMeat(
                                                        item.diseaseName,
                                                        item.diagnosisCode
                                                      )
                                                    }
                                                  >
                                                    <div className="icon-box  bg-danger-light me-1">
                                                      <FontAwesomeIcon
                                                        icon={faClose}
                                                        style={{
                                                          color: "red",
                                                        }}
                                                      />
                                                    </div>
                                                  </Popconfirm>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                      {meatCriteriaListRadiology.length ==
                                        0 ? (
                                        <div className="card combo-card">
                                          <div className="col-xl-12">
                                            <div>
                                              <span className="no-patient-data">
                                                NO PATIENT DATA
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}

                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="file">
                                    <div className="my-post-content pt-3">
                                      <div className="card">
                                        <div className="radiology-select-dos">
                                          {radiologyResultStatus ? (
                                            <Select
                                              onChange={(e) =>
                                                dosOnChangeRadiologyFile(e)
                                              }
                                              options={
                                                radiologyFileDateofServieList
                                              }
                                              className="custom-react-select"
                                              defaultValue={
                                                radiologyFileDateDefaulteSelect
                                              }
                                              isSearchable={false}
                                            />
                                          ) : null}
                                          <button
                                            onClick={() =>
                                              openNewTabDownloadPdfradiology()
                                            }
                                            className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                          >
                                            Open New Tab
                                          </button>
                                        </div>
                                        <div className="card-body p-0 z-index-low">
                                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                            <div
                                              style={{
                                                height: "600px",
                                                maxWidth: "900px",
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                              }}
                                            >
                                              {" "}
                                              <Viewer
                                                fileUrl={
                                                  selectFileURLRadiology
                                                }
                                                plugins={[
                                                  defaultLayoutPluginInstance,
                                                ]}
                                                onDocumentLoad={
                                                  handleDocumentLoad
                                                }
                                                renderLoader={(
                                                  percentages
                                                ) => (
                                                  <div
                                                    style={{ width: "240px" }}
                                                  >
                                                    <ProgressBar
                                                      progress={Math.round(
                                                        percentages
                                                      )}
                                                    />
                                                  </div>
                                                )}
                                              />
                                            </div>
                                          </Worker>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                </Tab.Content>
                              </Tab.Container>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={visitStyles.visitdata_tab_body}>
                          <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>

                            <div className="custom-tab-1">
                              <Tab.Container defaultActiveKey={activeTabHead}>
                                <Nav as="ul" className="nav nav-tabs">

                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link
                                      to="#my-posts"
                                      eventKey="validDiseases"
                                    >
                                      Visit Data
                                    </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item as="li" className="nav-item">
                                    <Nav.Link to="#my-posts" eventKey="file">
                                      File
                                    </Nav.Link>
                                  </Nav.Item>
                                  {/* <div>
                                      <Button
                                        onClick={addLabReport}
                                        className="btn btn-primary btn-sm ms-2 flr radiologyBtn"
                                      >
                                        + Add Lab Report
                                      </Button>
                                    </div> */}
                                </Nav>
                                <Tab.Content>
                                  <Tab.Pane
                                    id="my-posts"
                                    eventKey="validDiseases"
                                  >
                                    <div className="my-post-content pt-3">
                                      <div className="widget-media   ps--active-y">
                                        <div className="row">
                                          <div className="col-xl-4">
                                            <ul className="timeline">
                                              <div className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`} >
                                                <span
                                                  className={`${visitStyles.hcc_title_name}`}
                                                >
                                                  HCC
                                                </span>
                                                <div className="d-flex justify-content-center">
                                                  <span className={`${visitStyles.hcc_title_badge}`}>
                                                    {labReportValidList.length}
                                                  </span>
                                                </div>
                                              </div>

                                              {labReportValidList.map(
                                                (data, i) => (
                                                  <li>
                                                    <div className={`${visitStyles.hcc_card}`}>
                                                      <div className="timeline-panel">
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
                                                              {
                                                                data.diagnosisCode
                                                              }
                                                            </span>{" "}
                                                            -{" "}
                                                            {
                                                              data.actualDescription
                                                            }
                                                          </span>
                                                        </div>
                                                      </div>
                                                      <div className="d-flex justify-content-sm-between valid-providerdocument ">
                                                        <Popover
                                                          placement="topLeft"
                                                          title=""
                                                          content={
                                                            patientDocumentResult.patientName
                                                          }
                                                        >
                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                            <i>{SVGICON.patientNameIcon}</i>
                                                            {
                                                              patientDocumentResult.patientName
                                                            }
                                                          </Badge>
                                                        </Popover>
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.encounterDate
                                                          }
                                                        >

                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`}>
                                                            <i>{SVGICON.DatebirthIcon}</i>
                                                            {replaceString(
                                                              data.encounterDate
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                        <Popover
                                                          placement="topLeft"
                                                          content={
                                                            data.capturedSections
                                                          }
                                                        >


                                                          <Badge className={`mt-2 text-start ${visitStyles.provider_name}`} onClick={() =>
                                                            handleOpenModalCombinationCode(
                                                              data.diagnosisCode,
                                                              data.capturedSections,
                                                              "valid"
                                                            )
                                                          }>
                                                            {replaceCaptureSection(
                                                              data.capturedSections
                                                            )}
                                                          </Badge>
                                                        </Popover>
                                                      </div>
                                                    </div>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane id="my-posts" eventKey="file">
                                    <div className="my-post-content pt-3">
                                      <div className="card">
                                        <div className="radiology-select-dos">
                                          {labResultStatus ? (
                                            <Select
                                              onChange={(e) =>
                                                dosOnChangeLabFile(e)
                                              }
                                              options={
                                                labFileDateofServieList
                                              }
                                              className="custom-react-select"
                                              defaultValue={
                                                labFileDateDefaulteSelect
                                              }
                                              isSearchable={false}
                                            />
                                          ) : null}
                                          <button
                                            onClick={() =>
                                              openNewTabDownloadPdfradiology()
                                            }
                                            className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn newtab-btn flr"
                                          >
                                            Open New Tab
                                          </button>
                                        </div>
                                        <div className="card-body p-0 z-index-low">
                                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                                            <div
                                              style={{
                                                height: "600px",
                                                maxWidth: "900px",
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                              }}
                                            >
                                              {" "}
                                              <Viewer
                                                fileUrl={labReportFile}
                                                plugins={[
                                                  defaultLayoutPluginInstance,
                                                ]}
                                                onDocumentLoad={
                                                  handleDocumentLoad
                                                }
                                                renderLoader={(
                                                  percentages
                                                ) => (
                                                  <div
                                                    style={{ width: "240px" }}
                                                  >
                                                    <ProgressBar
                                                      progress={Math.round(
                                                        percentages
                                                      )}
                                                    />
                                                  </div>
                                                )}
                                              />
                                            </div>
                                          </Worker>
                                        </div>
                                      </div>
                                    </div>
                                  </Tab.Pane>
                                </Tab.Content>
                              </Tab.Container>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>



                    <div className={`col-xl-1`}>
                      <div className={`${visitStyles.flag_container}`}>
                        <ul className="">
                          {flagList?.map((data) => {
                            return (
                              <>
                                <li className={flagContainerActive == data.name
                                  ? `${visitStyles.commentsTagActive}`
                                  : `${visitStyles.commentsTag}`
                                } onClick={() => addComments(data.name)}>
                                  <i>{data.icon}</i>
                                </li>
                                {/* <li >
                            <i>{SVGICON.filterIcon}</i>
                          </li>
                          <li>
                            <i>{SVGICON.commentIcon}</i>
                          </li>
                          <li>
                            <i>{SVGICON.notsIcon}</i>
                          </li> */}
                              </>
                            );
                          })}
                        </ul>
                      </div>





                    </div>
                  </div>
                </div>
                {isModalOpen && (
                  <Modal
                    title={selectMeatName}
                    // title="Pdf Test"
                    centered
                    open={isModalOpen}
                    // style={{ top: 5 }}
                    onOk={handleCloseModal}
                    onCancel={handleCloseModal}
                    width={1000}
                    height={400}
                  >
                    <div className="section-container">
                      <div className="row">
                        <div className="col-xl-12">
                          <div
                            className="rpv-core__viewer"
                            style={{
                              border: "1px solid rgba(0, 0, 0, 0.3)",
                              display: "flex",
                              flexDirection: "column",
                              margin: "0 82px 10px 73px",
                            }}
                          >
                            <div
                              style={{
                                alignItems: "center",
                                backgroundColor: "#eeeeee",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                padding: "4px",
                              }}
                            >
                              <Search>
                                {(renderSearchProps) => {
                                  const [readyToSearch, setReadyToSearch] =
                                    useState(false);
                                  return (
                                    <>
                                      <div
                                        style={{
                                          border:
                                            "1px solid rgba(0, 0, 0, 0.3)",
                                          display: "flex",
                                          padding: "0 2px",
                                        }}
                                      >
                                        <input
                                          style={{
                                            border: "none",
                                            padding: "8px",
                                            width: "200px",
                                          }}
                                          placeholder="Enter to search"
                                          type="text"
                                          value={renderSearchProps.keyword}
                                          onChange={(e) => {
                                            setReadyToSearch(false);
                                            renderSearchProps.setKeyword(
                                              e.target.value
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.keyCode === 13 &&
                                              renderSearchProps.keyword
                                            ) {
                                              setReadyToSearch(true);
                                              renderSearchProps.search();
                                            }
                                          }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.matchCase
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeMatchCase(
                                                  !renderSearchProps.matchCase
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                <path d="M4.383 14.725L13.59 14.725" />
                                                <path d="M0.5 21.725L3.52 21.725" />
                                                <path d="M14.479 21.725L17.5 21.725" />
                                                <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                <path d="M16.92 16.725L20.794 16.725" />
                                                <path d="M21.516 21.725L23.5 21.725" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match case"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.wholeWords
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeWholeWords(
                                                  !renderSearchProps.wholeWords
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                <path d="M3.5 9.498L3.5 14.498" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match whole word"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches ===
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            Not found
                                          </div>
                                        )}
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches >
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            {renderSearchProps.currentMatch} of{" "}
                                            {renderSearchProps.numberOfMatches}
                                          </div>
                                        )}
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToPreviousMatch
                                              }
                                            >
                                              <PreviousIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Previous match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToNextMatch
                                              }
                                            >
                                              <NextIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Next match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                    </>
                                  );
                                }}
                              </Search>
                            </div>
                          </div>
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                            <div
                              style={{
                                height: "400px",
                                // width: "1000px",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              {" "}
                              <Viewer
                                fileUrl={selectFileURL}
                                plugins={[searchPluginInstance]}
                                onDocumentLoad={handleDocumentLoad}
                              />
                            </div>
                          </Worker>
                        </div>
                        {/* <div className="col-xl-4">
                          <ul className="timeline">
                          <div className="modal-valid-container">
                            {newValidDiseaseList.map((data, i) => (
                              <li>
                              

                                
                                <div onClick={() => activeValidDisCode(data.diagnosisCode, data.actualDescription)} className={selectActiveCode == data.diagnosisCode ? "new_valid-dis cr-pointer modal-valid-active" : "new_valid-dis cr-pointer modal-valid" }>
                                  <div className="timeline-panel">
                                    <div className="media-body">
                                      <span className="mb-1 disease-name d-flex" >
                                        <span className="valid-dis-name">{data.diagnosisCode}</span> -  {data.actualDescription}
                                      </span>
                                    </div>
                                  </div>
                                </div>


                              </li>
                            ))}
                                                            </div>
                          </ul>
                        </div> */}
                      </div>
                      {/* <button onClick={changeSearch}>Check
        
        </button> */}
                      {/* {isLoadingSection ?
                      <Spin className='ml-2 ms-1 section-spin' size="medium" />
                      : <>
                        {sectionList?.map((item) => {
                          return (

                            <div className="card meat-card">
                              <span className="combodiseaseText">{item}</span>
                            </div>


                          );
                        })}
                      </>} */}
                      {/* <div
        className="rpv-core__viewer"
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginBottom:"50px"
        }}
    >
        <div
            style={{
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                padding: '4px',
            }}
        >
            <ShowSearchPopoverButton />
        </div>
        </div> */}
                    </div>
                  </Modal>
                )}
                {isModalOpenValidCodes && (
                  <Modal
                    title={selectMeatName}
                    // title="Pdf Test"
                    centered
                    open={isModalOpenValidCodes}
                    // style={{ top: 5 }}
                    onOk={handleCloseModal}
                    onCancel={handleCloseModal}
                    width={1300}
                    height={400}
                  >
                    <div className="section-container">
                      <div class="d-flex justify-content-end m-4">
                        <button
                          class="btn btn-primary"
                          onClick={handleAddButtonClick}
                        >
                          Add
                        </button>
                      </div>

                      <div className="row">
                        <div className="col-xl-8">
                          <div
                            className="rpv-core__viewer"
                            style={{
                              border: "1px solid rgba(0, 0, 0, 0.3)",
                              display: "flex",
                              flexDirection: "column",
                              margin: "0 82px 10px 73px",
                            }}
                          >
                            <div
                              style={{
                                alignItems: "center",
                                backgroundColor: "#eeeeee",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                padding: "4px",
                              }}
                            >
                              <Search>
                                {(renderSearchProps) => {
                                  const [readyToSearch, setReadyToSearch] =
                                    useState(false);
                                  return (
                                    <>
                                      <div
                                        style={{
                                          border:
                                            "1px solid rgba(0, 0, 0, 0.3)",
                                          display: "flex",
                                          padding: "0 2px",
                                        }}
                                      >
                                        <input
                                          style={{
                                            border: "none",
                                            padding: "8px",
                                            width: "200px",
                                          }}
                                          placeholder="Enter to search"
                                          type="text"
                                          value={renderSearchProps.keyword}
                                          onChange={(e) => {
                                            setReadyToSearch(false);
                                            renderSearchProps.setKeyword(
                                              e.target.value
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.keyCode === 13 &&
                                              renderSearchProps.keyword
                                            ) {
                                              setReadyToSearch(true);
                                              renderSearchProps.search();
                                            }
                                          }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.matchCase
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeMatchCase(
                                                  !renderSearchProps.matchCase
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                <path d="M4.383 14.725L13.59 14.725" />
                                                <path d="M0.5 21.725L3.52 21.725" />
                                                <path d="M14.479 21.725L17.5 21.725" />
                                                <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                <path d="M16.92 16.725L20.794 16.725" />
                                                <path d="M21.516 21.725L23.5 21.725" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match case"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.wholeWords
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeWholeWords(
                                                  !renderSearchProps.wholeWords
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                <path d="M3.5 9.498L3.5 14.498" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match whole word"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches ===
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            Not found
                                          </div>
                                        )}
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches >
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            {renderSearchProps.currentMatch} of{" "}
                                            {renderSearchProps.numberOfMatches}
                                          </div>
                                        )}
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToPreviousMatch
                                              }
                                            >
                                              <PreviousIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Previous match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToNextMatch
                                              }
                                            >
                                              <NextIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Next match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                    </>
                                  );
                                }}
                              </Search>
                            </div>
                          </div>
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                            <div
                              style={{
                                height: "400px",
                                // width: "1000px",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              {" "}
                              <Viewer
                                fileUrl={selectFileURL}
                                plugins={[searchPluginInstance]}
                                onDocumentLoad={handleDocumentLoad}
                              />
                            </div>
                          </Worker>
                        </div>
                        {isAddButtonClicked && (
                          <div className="col-xl-4">
                            {/* Input fields */}
                            <form onSubmit={handleFormSubmit}>
                              <div className="form-group">
                                <Form.Label>
                                  Diagnosis code
                                  <span className="text-danger">*</span>{" "}
                                </Form.Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="diagnosisCode"
                                  name="diagnosisCode"
                                  placeholder="Enter Code"
                                  required
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="form-group">
                                <Form.Label>Provider name</Form.Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="providerName"
                                  name="providerName"
                                  placeholder="Enter provider name (Optional)"
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="form-group">
                                <Form.Label>
                                  Section<span className="text-danger">*</span>{" "}
                                </Form.Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="capturedSections"
                                  name="capturedSections"
                                  placeholder="Enter section"
                                  required
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="form-group">
                                <Form.Label>
                                  Encoded date
                                  <span className="text-danger">*</span>{" "}
                                </Form.Label>

                                <input
                                  type="date"
                                  className="form-control"
                                  id="encodedDate"
                                  name="encodedDate"
                                  placeholder="Select encoded date"
                                  required
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="form-group">
                                <Form.Label>
                                  Description
                                  <span className="text-danger">*</span>{" "}
                                </Form.Label>

                                <textarea
                                  className="form-control"
                                  id="actualDescription"
                                  name="actualDescription"
                                  onChange={handleChangeSuggested}
                                  rows="5"
                                ></textarea>
                              </div>
                              <div className="d-flex justify-content-between">
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  Submit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={handleCloseForm}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                        {nonHccActiveCodes == false &&
                          isAddButtonClicked == false ? (
                          <div className="col-xl-4">
                            <ul className="timeline">
                              <div className="modal-valid-container">
                                {newValidDiseaseList.map((data, i) => (
                                  <li>
                                    <div
                                      onClick={() =>
                                        activeValidDisCode(
                                          data.diagnosisCode,
                                          data.actualDescription
                                        )
                                      }
                                      className={
                                        selectActiveCode == data.diagnosisCode
                                          ? "new_valid-dis cr-pointer modal-valid-active"
                                          : "new_valid-dis cr-pointer modal-valid"
                                      }
                                    >
                                      <div className="timeline-panel">
                                        <div className="media-body">
                                          <span className="mb-1 disease-name d-flex">
                                            <span className="valid-dis-name">
                                              {data.diagnosisCode}
                                            </span>{" "}
                                            - {data.actualDescription}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </div>
                            </ul>
                          </div>
                        ) : (
                          <div className="col-xl-4">
                            <ul className="timeline">
                              <div className="modal-valid-container">
                                {newInValidDiseaseList.map((data, i) => (
                                  <li>
                                    <div
                                      onClick={() =>
                                        activeValidDisCode(
                                          data.diagnosisCode,
                                          data.actualDescription
                                        )
                                      }
                                      className={
                                        selectActiveCode == data.diagnosisCode
                                          ? "new_valid-dis cr-pointer modal-valid-active"
                                          : "new_valid-dis cr-pointer modal-valid"
                                      }
                                    >
                                      <div className="timeline-panel">
                                        <div className="media-body">
                                          <span className="mb-1 disease-name d-flex">
                                            <span className="valid-dis-name">
                                              {data.diagnosisCode}
                                            </span>{" "}
                                            - {data.actualDescription}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </div>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Modal>
                )}
                {isModalOpenCaptureSection && (
                  <Modal
                    title={selectMeatName}
                    // title="Pdf Test"
                    centered
                    open={isModalOpenCaptureSection}
                    // style={{ top: 5 }}
                    onOk={handleCloseModal}
                    onCancel={handleCloseModal}
                    width={1000}
                    height={400}
                  >
                    <div className="section-container">
                      <div className="row">
                        <div className="col-xl-12">
                          <div
                            className="rpv-core__viewer"
                            style={{
                              border: "1px solid rgba(0, 0, 0, 0.3)",
                              display: "flex",
                              flexDirection: "column",
                              margin: "0 82px 10px 73px",
                            }}
                          >
                            <div
                              style={{
                                alignItems: "center",
                                backgroundColor: "#eeeeee",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                padding: "4px",
                              }}
                            >
                              <Search>
                                {(renderSearchProps) => {
                                  const [readyToSearch, setReadyToSearch] =
                                    useState(false);
                                  return (
                                    <>
                                      <div
                                        style={{
                                          border:
                                            "1px solid rgba(0, 0, 0, 0.3)",
                                          display: "flex",
                                          padding: "0 2px",
                                        }}
                                      >
                                        <input
                                          style={{
                                            border: "none",
                                            padding: "8px",
                                            width: "200px",
                                          }}
                                          placeholder="Enter to search"
                                          type="text"
                                          value={renderSearchProps.keyword}
                                          onChange={(e) => {
                                            setReadyToSearch(false);
                                            renderSearchProps.setKeyword(
                                              e.target.value
                                            );
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              e.keyCode === 13 &&
                                              renderSearchProps.keyword
                                            ) {
                                              setReadyToSearch(true);
                                              renderSearchProps.search();
                                            }
                                          }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.matchCase
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeMatchCase(
                                                  !renderSearchProps.matchCase
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                                <path d="M4.383 14.725L13.59 14.725" />
                                                <path d="M0.5 21.725L3.52 21.725" />
                                                <path d="M14.479 21.725L17.5 21.725" />
                                                <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                                <path d="M16.92 16.725L20.794 16.725" />
                                                <path d="M21.516 21.725L23.5 21.725" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match case"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <button
                                              style={{
                                                background: "#fff",
                                                border: "none",
                                                borderBottom: `2px solid ${renderSearchProps.wholeWords
                                                  ? "blue"
                                                  : "transparent"
                                                  }`,
                                                height: "100%",
                                                padding: "0 2px",
                                              }}
                                              onClick={() =>
                                                renderSearchProps.changeWholeWords(
                                                  !renderSearchProps.wholeWords
                                                )
                                              }
                                            >
                                              <Icon>
                                                <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                                <path d="M3.5 9.498L3.5 14.498" />
                                              </Icon>
                                            </button>
                                          }
                                          content={() => "Match whole word"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches ===
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            Not found
                                          </div>
                                        )}
                                      {readyToSearch &&
                                        renderSearchProps.keyword &&
                                        renderSearchProps.numberOfMatches >
                                        0 && (
                                          <div style={{ padding: "0 8px" }}>
                                            {renderSearchProps.currentMatch} of{" "}
                                            {renderSearchProps.numberOfMatches}
                                          </div>
                                        )}
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToPreviousMatch
                                              }
                                            >
                                              <PreviousIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Previous match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                      <div style={{ padding: "0 2px" }}>
                                        <Tooltip
                                          position={Position.BottomCenter}
                                          target={
                                            <MinimalButton
                                              onClick={
                                                renderSearchProps.jumpToNextMatch
                                              }
                                            >
                                              <NextIcon />
                                            </MinimalButton>
                                          }
                                          content={() => "Next match"}
                                          offset={{ left: 0, top: 8 }}
                                        />
                                      </div>
                                    </>
                                  );
                                }}
                              </Search>
                            </div>
                          </div>
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                            <div
                              style={{
                                height: "400px",
                                // width: "1000px",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              {" "}
                              <Viewer
                                fileUrl={selectFileURL}
                                plugins={[searchPluginInstance]}
                                onDocumentLoad={handleDocumentLoad}
                              />
                            </div>
                          </Worker>
                        </div>
                        {/* <div className="col-xl-4">
                          <ul className="timeline">
                          <div className="modal-valid-container">
                            {newValidDiseaseList.map((data, i) => (
                              <li>
                              

                                
                                <div >
                                  <div className="timeline-panel">
                                    <div className="media-body">
                                      <span className="mb-1 disease-name d-flex" >
                                        <span className="valid-dis-name">{data.diagnosisCode}</span> -  {data.actualDescription}
                                      </span>
                                      {data.capturedSections.map((data2, i) => (
                                      <span className="mb-1 disease-name"  onClick={() => activeValidDisCode(data.diagnosisCode, data2)} >
                                        <span className={selectActiveCode == data2 ? " valid-dis-name d-flex new_valid-dis cr-pointer modal-valid-active" : "valid-dis-name d-flex new_valid-dis cr-pointer modal-valid" }>{data2}</span>
                                      </span>
                                         ))}
                                    </div>
                                  </div>
                                </div>


                              </li>
                            ))}
                                                            </div>
                          </ul>
                        </div> */}
                      </div>
                    </div>
                  </Modal>
                )}
                {isModalOpenRadiology && (
                  <Modal
                    title={selectMeatName}
                    // title="Pdf Test"
                    centered
                    open={isModalOpenRadiology}
                    // style={{ top: 5 }}
                    onOk={handleCloseModal}
                    onCancel={handleCloseModal}
                    width={1000}
                    height={400}
                  >
                    <div className="section-container">
                      {/* <button onClick={changeSearch}>Check
        
        </button> */}
                      {/* {isLoadingSection ?
                      <Spin className='ml-2 ms-1 section-spin' size="medium" />
                      : <>
                        {sectionList?.map((item) => {
                          return (

                            <div className="card meat-card">
                              <span className="combodiseaseText">{item}</span>
                            </div>


                          );
                        })}
                      </>} */}
                      {/* <div
        className="rpv-core__viewer"
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            marginBottom:"50px"
        }}
    >
        <div
            style={{
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                padding: '4px',
            }}
        >
            <ShowSearchPopoverButton />
        </div>
        </div> */}
                      <div
                        className="rpv-core__viewer"
                        style={{
                          border: "1px solid rgba(0, 0, 0, 0.3)",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          margin: "0 82px 10px 73px",
                        }}
                      >
                        <div
                          style={{
                            alignItems: "center",
                            backgroundColor: "#eeeeee",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            padding: "4px",
                          }}
                        >
                          <Search>
                            {(renderSearchProps) => {
                              const [readyToSearch, setReadyToSearch] =
                                useState(false);
                              return (
                                <>
                                  <div
                                    style={{
                                      border: "1px solid rgba(0, 0, 0, 0.3)",
                                      display: "flex",
                                      padding: "0 2px",
                                    }}
                                  >
                                    <input
                                      style={{
                                        border: "none",
                                        padding: "8px",
                                        width: "200px",
                                      }}
                                      placeholder="Enter to search"
                                      type="text"
                                      value={renderSearchProps.keyword}
                                      onChange={(e) => {
                                        setReadyToSearch(false);
                                        renderSearchProps.setKeyword(
                                          e.target.value
                                        );
                                      }}
                                      onKeyDown={(e) => {
                                        if (
                                          e.keyCode === 13 &&
                                          renderSearchProps.keyword
                                        ) {
                                          setReadyToSearch(true);
                                          renderSearchProps.search();
                                        }
                                      }}
                                    />
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <button
                                          style={{
                                            background: "#fff",
                                            border: "none",
                                            borderBottom: `2px solid ${renderSearchProps.matchCase
                                              ? "blue"
                                              : "transparent"
                                              }`,
                                            height: "100%",
                                            padding: "0 2px",
                                          }}
                                          onClick={() =>
                                            renderSearchProps.changeMatchCase(
                                              !renderSearchProps.matchCase
                                            )
                                          }
                                        >
                                          <Icon>
                                            <path d="M15.979,21.725,9.453,2.612a.5.5,0,0,0-.946,0L2,21.725" />
                                            <path d="M4.383 14.725L13.59 14.725" />
                                            <path d="M0.5 21.725L3.52 21.725" />
                                            <path d="M14.479 21.725L17.5 21.725" />
                                            <path d="M22.5,21.725,18.377,9.647a.5.5,0,0,0-.946,0l-1.888,5.543" />
                                            <path d="M16.92 16.725L20.794 16.725" />
                                            <path d="M21.516 21.725L23.5 21.725" />
                                          </Icon>
                                        </button>
                                      }
                                      content={() => "Match case"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <button
                                          style={{
                                            background: "#fff",
                                            border: "none",
                                            borderBottom: `2px solid ${renderSearchProps.wholeWords
                                              ? "blue"
                                              : "transparent"
                                              }`,
                                            height: "100%",
                                            padding: "0 2px",
                                          }}
                                          onClick={() =>
                                            renderSearchProps.changeWholeWords(
                                              !renderSearchProps.wholeWords
                                            )
                                          }
                                        >
                                          <Icon>
                                            <path d="M0.500 7.498 L23.500 7.498 L23.500 16.498 L0.500 16.498 Z" />
                                            <path d="M3.5 9.498L3.5 14.498" />
                                          </Icon>
                                        </button>
                                      }
                                      content={() => "Match whole word"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                  {readyToSearch &&
                                    renderSearchProps.keyword &&
                                    renderSearchProps.numberOfMatches === 0 && (
                                      <div style={{ padding: "0 8px" }}>
                                        Not found
                                      </div>
                                    )}
                                  {readyToSearch &&
                                    renderSearchProps.keyword &&
                                    renderSearchProps.numberOfMatches > 0 && (
                                      <div style={{ padding: "0 8px" }}>
                                        {renderSearchProps.currentMatch} of{" "}
                                        {renderSearchProps.numberOfMatches}
                                      </div>
                                    )}
                                  <div style={{ padding: "0 2px" }}>
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <MinimalButton
                                          onClick={
                                            renderSearchProps.jumpToPreviousMatch
                                          }
                                        >
                                          <PreviousIcon />
                                        </MinimalButton>
                                      }
                                      content={() => "Previous match"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                  <div style={{ padding: "0 2px" }}>
                                    <Tooltip
                                      position={Position.BottomCenter}
                                      target={
                                        <MinimalButton
                                          onClick={
                                            renderSearchProps.jumpToNextMatch
                                          }
                                        >
                                          <NextIcon />
                                        </MinimalButton>
                                      }
                                      content={() => "Next match"}
                                      offset={{ left: 0, top: 8 }}
                                    />
                                  </div>
                                </>
                              );
                            }}
                          </Search>
                        </div>
                      </div>
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
                        <div
                          style={{
                            height: "400px",
                            maxWidth: "1300px",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        >
                          {" "}
                          <Viewer
                            fileUrl={selectFileURLRadiology}
                            plugins={[searchPluginInstance]}
                            onDocumentLoad={handleDocumentLoad}
                          />
                        </div>
                      </Worker>
                    </div>
                  </Modal>
                )}
                {confirmNotesModalDecline && (
                  <Modal
                    title={selectDiseasesName}
                    centered
                    open={confirmNotesModalDecline}
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
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
                              {isLoading ? "Loding..." : "Submit"}
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
                {confirmNotesModalHold && (
                  <Modal
                    title={selectDiseasesName}
                    centered
                    open={confirmNotesModalHold}
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
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
                              {isLoading ? "Loding..." : "Submit"}
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
                                Notes <span className="text-danger">*</span>{" "}
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
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
                              {isLoading ? "Loding..." : "Submit"}
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
                                Notes <span className="text-danger">*</span>{" "}
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
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
                              {isLoading ? "Loding..." : "Submit"}
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
                {suggestedModal && (
                  <Modal
                    title={selectDiseasesName}
                    centered
                    open={suggestedModal}
                    onOk={handleCloseModal}
                    onCancel={handleCloseModal}
                    footer={null}
                  >
                    <div className="offcanvas-body">
                      <div className="container-fluid">
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleSubmitSuggestedNotes}
                        >
                          <div className="row">
                            <div className="col-xl-12 mb-3">
                              <Form.Label>
                                Notes <span className="text-danger">*</span>{" "}
                              </Form.Label>
                              <textarea
                                className="form-control"
                                id="notes"
                                name="notes"
                                rows="5"
                                onChange={handleChangeSuggested}
                              ></textarea>
                            </div>
                          </div>

                          <div>
                            <Button
                              type="submit"
                              className="btn btn-primary btn-sm me-1"
                            >
                              {isLoading ? "Loding..." : "Submit"}
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
                <Offcanvas
                  onHide={handleCloseModal}
                  show={isModalOpenValid}
                  className="offcanvas-end"
                  placement="end"
                >
                  <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">
                      Add Valid Code
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
                        onSubmit={handleSubmit}
                      >
                        <div className="row">
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Code <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="patientId"
                              required
                              type="text"
                            />
                          </div>
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Description <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <textarea
                              className="form-control"
                              id="val-suggestions"
                              name="val-suggestions"
                              rows="5"
                              required
                            ></textarea>
                          </div>
                        </div>

                        <div>
                          <Button
                            type="submit"
                            className="btn btn-primary btn-sm me-1"
                          >
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

                <Offcanvas
                  onHide={setAddPatient}
                  show={addPatient}
                  className="offcanvas-end"
                  placement="end"
                >
                  <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">
                      Add Patient Radiology
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setAddPatient(false)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div className="offcanvas-body">
                    <div className="container-fluid">
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmitPatientFile}
                      >
                        <div className="row">
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Patient Id <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="patientId"
                              required
                              type="text"
                              value={inputValue.patientId}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Patient Name{" "}
                              <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="name"
                              required
                              type="text"
                              value={inputValue.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Year of Service{" "}
                              <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="year"
                              required
                              type="number"
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-xl-12 mb-3">
                            <Form.Label>File</Form.Label>
                            <Form.Control
                              type="file"
                              accept="application/pdf,text/plain"
                              onChange={(e) =>
                                onChangeFileRadiology(e.target.files)
                              }
                              disabled={isLoadingBtn ? true : false}
                            />
                          </div>
                        </div>

                        <div>
                          <Button
                            type="submit"
                            className="btn btn-primary btn-sm me-1"
                          >
                            {isLoadingBtn ? "Loading..." : "Submit"}
                          </Button>
                          <Button
                            onClick={() => setAddPatient(false)}
                            className="btn btn-danger btn-sm light ms-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </Offcanvas>
                <Offcanvas
                  onHide={setLapReportSlider}
                  show={labReportSlider}
                  className="offcanvas-end"
                  placement="end"
                >
                  <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">
                      Add Patient Lab Report
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setLapReportSlider(false)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div className="offcanvas-body">
                    <div className="container-fluid">
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmitLabReport}
                      >
                        <div className="row">
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Patient Id <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="patientId"
                              required
                              type="text"
                              value={inputValue.patientId}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Patient Name{" "}
                              <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="name"
                              required
                              type="text"
                              value={inputValue.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-xl-12 mb-3">
                            <Form.Label>
                              Year of Service{" "}
                              <span className="text-danger">*</span>{" "}
                            </Form.Label>
                            <Form.Control
                              name="year"
                              required
                              type="number"
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-xl-12 mb-3">
                            <Form.Label>File</Form.Label>
                            <Form.Control
                              type="file"
                              accept="application/pdf,text/plain"
                              onChange={(e) =>
                                onChangeLabReportFile(e.target.files)
                              }
                              disabled={isLoadingBtn ? true : false}
                            />
                          </div>
                        </div>

                        <div>
                          <Button
                            type="submit"
                            className="btn btn-primary btn-sm me-1"
                          >
                            {isLoadingBtn ? "Loading..." : "Submit"}
                          </Button>
                          <Button
                            onClick={() => setLapReportSlider(false)}
                            className="btn btn-danger btn-sm light ms-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </Offcanvas>

                <Offcanvas
                  onHide={handleCloseModal}
                  show={isModalComments}
                  placement="end"
                  className={`offcanvas-end ${visitStyles.commentDrawer}`}
                >
                  <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">
                      Add Comments
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

                      <div className={visitStyles.comments_card}>
                        <span>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </span>
                        <span>
                          18/11/2023    10:00 Am
                        </span>

                      </div>
                      <div className={visitStyles.comments_card}>
                        <span>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </span>
                        <span>
                          18/11/2023    10:00 Am
                        </span>

                      </div>
                      <div className={visitStyles.comments_card}>
                        <span>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </span>
                        <span>
                          18/11/2023    10:00 Am
                        </span>

                      </div>
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                      >
                        <div className="row">
                          <div className="col-xl-12 mb-3">
                            <textarea
                              className={visitStyles.commentsFormControl}

                              rows="5"
                              required
                              placeholder="Add Comments"
                            ></textarea>
                          </div>
                        </div>

                        <div className="text-center">
                          <Button
                            type="submit"
                            className={visitStyles.addPatientBtn}
                          >
                            Save
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </Offcanvas>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
