import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import moment from "moment";
import "react-vertical-timeline-component/style.min.css";

import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faArrowLeft,
  faPlus,
  faArrowsAlt,
  faSitemap,
  faAngleDown,
  faPen,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarOutlined } from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popconfirm, Popover } from "antd";
import { SVGICON } from "../../../../../../jsx/constant/theme";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { notification } from "antd";
import { Tooltip } from "antd";
import Spinner from "../../../../../../components/loadingSpinner";
import styles from "../styles.module.css";
import { getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import CamboTree from "../org";
import PdfViewer from "../../PdfViewerComponent";
import AddHccForm from "../../components/addHccForm";
import EditHccForm from "../../components/editHccForm";
import { pdfUrl } from "../../../../../../stores/authflow/reducers";
import HccCards from "../../components/HCC";
import ModelIndex from "../../components/model/Index";

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

const COLORS2 = [
  "sectionTag1",
  "sectionTag2",
  "sectionTag3",
  "sectionTag4",
  "sectionTag5",
  "sectionTag6",
  "sectionTag7",
  "sectionTag8",
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
  "encounterDateTag9",
  "encounterDateTag10",
];

const File = ({
  popoverVisible,
  setPopoverVisible,
  year,
  setActiveTabHead,
  setActiveMeatTitle,
  setActiveComboTree,
}) => {
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
  const [isFileFormShow, setIsFileFormShow] = useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [confirmNotesModalInValid, setConfirmNotesModalInValid] =
    useState(false);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [localOrgId, setLocalOrgId] = useState("");
  const [localTenantId, setLocalTenantId] = useState("");
  const [selectMeatName, setSelectMeatName] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [selectFileURLRadiology, setSelectFileURLRadiology] = useState([]);
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
  const [isModalOpenLab, setIsModalOpenLab] = useState(false);
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
  const [localUserId, setLocalUserId] = useState("");
  const [localPatientId, setLocalPatientId] = useState("");
  const [selectedDosValue, setSelectedDosValue] = useState("");
  const [selectInvalidDetails, setSelectInvalidDetails] = useState(false);
  const [labReportFile, setLabReportFile] = useState([]);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [isValidAction, setIsValidAction] = useState("");
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [patientFileDTO, setPatientFileDTO] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [findFileKeyword, setFindFileKeyword] = useState("");
  const [fileModalTitle, setFileModalTitle] = useState("");
  const [pageNumberOptions, setPageNumberOptions] = useState([]);
  const [listPageNumber, setListPageNumber] = useState([]);
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  const [fileLoading, setFileLoading] = useState(false);
  const [hccVersionDetails, setHccVersionDetails] = useState(null);
  const [search, setSearch] = useState();
  const [isAddHccForm, setIsAddHccForm] = useState(false);
  const [isEditHccForm, setIsEditHccForm] = useState(false);
  const [formValues, setFormValues] = useState(false);
  const [formEditPlace, setFormEditPlace] = useState("");

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    var uId = localStorage.getItem("userId");
    setLocalUserId(uId);
    setLocalPatientId(patientId);
    setLocalOrgId(orgId);
    setLocalTenantId(tenId);
    getPatientDetails(patientId, orgId, tenId);

  }, [patientDetailsResult]);

  useEffect(() => {
    if (hccFileDetails?.result?.response) {
      // dispatch(pdfUrl(hccFileDetails?.result?.response));
      setSelectFileURL(hccFileDetails?.result?.response);
    }
  }, [hccFileDetails]);

  useEffect(() => {
    getFileDosPageNumber();
  }, [fileDosPageNumberList]);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    var patientId = localStorage.getItem("patientId");
    getPatientDetailsFileLoad(patientId, orgId, tenId);
  }, [activeTabNumber]);

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

  const getPatientDetails = async (
    patientId,
    orgId,
    tenId,
    fileloadCondition
  ) => {
    if (patientDetailsResult?.result?.response) {
      var result = patientDetailsResult?.result?.response;
      console.log(result)
      setPatientDocumentResult(result);
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
       

        var suggestRadiologyList = [];
        var suggestLabList = [];

        var suggestListAll = [];
     
        var deleteHccList = [];

        if (fileloadCondition != "fileNotLoad") {
          setPatientFileDTO(result?.fileDetailDTO);
        }
        // setPatientDocumentResult(result);

        // result.encounterYears.map((res) => {
        //   dosYearArr.push({ value: res, label: res });
        // });

        // const highestDOS = Math.max(...dosYearArr.map((res) => res.value));

        // const highestDosValue = dosYearArr.filter(
        //   (i) => parseInt(i.value) === highestDOS
        // );

        // setSelectedDosValue(highestDosValue[0].value);

        if (result.rafScore != null) {
          rafScore = result.rafScore;
        }

     

        validDis = result.validDisease;
        validDiseaseNewRes = result?.validDisease;
        // invalidDiseaseNewRes =validDisArray;
        var validDisArray = [];
       
        validDiseaseNewRes?.map((res, index) => {
          const encounterDatearray = res?.encounterDate?.split(",");
          var providerList = [];
        
          res.provider?.map((res, index) => {
            providerList.push(res?.providerName);
          });

          if (res.isShow != false) {
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
              dbDescription: res.dbDescription,
              isMostSpecific: res.isMostSpecific,
              children: res.children,
              getPlace: "Hcc",
              dbDescription: res.dbDescription,
              isCmsHcc: res.isCmsHcc,
              isRxHcc: res.isRxHcc,
              providerDeatils: res.provider,
              isComboCode: res.isComboCode,
            });
          }
        });

        if (result?.insulinDisease) {
          const encounterDatearray = result?.insulinDisease?.dos?.split(",");
          validDisArray.push({
            actualDescription: result?.insulinDisease?.description,
            capturedSections: [result?.insulinDisease?.section],
            diagnosisCode: result?.insulinDisease?.code,
            encounterDate: result?.insulinDisease?.dos,
            encounterDateSplit: encounterDatearray,
            getPlace: "Insulin",
            isHccValid: true,
            defaultPosition: null,
            dbDescription: result?.insulinDisease?.dbDescription,
          });
        }

        result?.invalidDisease?.map((res, index) => {
          const encounterDatearray = res?.encounterDate?.split(",");
          invalidDiseaseNewRes.push({
            actualDescription: res.actualDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: encounterDatearray,
            isManuallyAdded: res.isManuallyAdded,
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition,
          });
        });

        if (result.deletedDiseases != null) {
          result.deletedDiseases.map((res, index) => {
            if (res.isShow != false) {
              const encounterDatearray = res?.encounterDate?.split(",");
              var providerList = [];
              res.provider?.map((res, index) => {
                providerList.push(res.providerName);
              });
              deleteHccList.push({
                actualDescription: res.actualDescription,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCode,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                isManuallyAdded: res.isManuallyAdded,
                isHccValid: res.isHccValid,
                defaultPosition: res.defaultPosition,
                providerName: providerList,
                isCmsHcc: res.isCmsHcc,
                isRxHcc: res.isRxHcc,
                isComboCode: res.isComboCode,
              });
            }
          });
        }
        if (result.suggestRadiology != null) {
          suggestRadiologyList = result.suggestRadiology;
          suggestRadiologyList.map((res, index) => {
            const encounterDatearray = res?.encounterDate?.split(",");
            var providerList = [];

            res?.provider?.map((res2, index) => {
              providerList.push(res2.providerName);
            });
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Radio",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
              children: res.children ? res.children : [],
              isMostSpecific: res.isMostSpecific,
              isCmsHcc: res.isCmsHcc,
              isRxHcc: res.isRxHcc,
              isComboCode: res.isComboCode,
              providerDeatils: res.provider,
            });
          });

          if (result.suggestRadiologyCombo != null) {
            result.suggestRadiologyCombo.map((res, index) => {
              var providerList = [];

              res.providers?.map((res2, index) => {
                providerList.push(res2.providerName);
              });
              const encounterDatearray = res?.encounterDate?.split(",");
              suggestListAll.push({
                actualDescription: res.diseaseName,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCodeCombo,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Radio-combo",
                isHccValid: true,
                providerName: providerList,
                isCmsHcc: res.isCmsHcc,
                isRxHcc: res.isRxHcc,
                isComboCode: res.isComboCode,
                providerDeatils: res.provider,
                // defaultPosition:res.defaultPosition
              });
            });
          }
        }

        if (result.suggestLab != null) {
          // getLabReportDetails(orgId,tenId)
          suggestLabList = result.suggestLab;
          suggestLabList.map((res, index) => {
            var providerList = [];

            res?.provider?.map((res2, index) => {
              providerList.push(res2.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Lab",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
              isCmsHcc: res.isCmsHcc,
              isRxHcc: res.isRxHcc,
              isComboCode: res.isComboCode,
              providerDeatils: res.provider,
            });
          });
        }
        if (result.unMatchedDisease != null) {
          unMatchRes = result.unMatchedDisease;
          unMatchRes.map((res, index) => {
            if (res.isShow != false) {
              const encounterDatearray = res?.encounterDate?.split(",");
              var providerList = [];

              res?.provider?.map((res, index) => {
                providerList.push(res.providerName);
              });
              suggestListAll.push({
                actualDescription: res.actualDescription,
                diagnosisCodeFinding: res.diagnosisCode,
                isHccValid: res.isHccValid,
                capturedSections: res.capturedSections,
                diagnosisCode: res.diagnosisCode,
                encounterDate: res.encounterDate,
                encounterDateSplit: encounterDatearray,
                getPlace: "Hcc",
                defaultPosition: res.defaultPosition,
                providerName: providerList,
                children: res.children ? res.children : [],
                isMostSpecific: res.isMostSpecific,
                isCmsHcc: res.isCmsHcc,
                isRxHcc: res.isRxHcc,
                isComboCode: res.isComboCode,
                providerDeatils: res.provider,
              });
            }
          });
        }
        if (result?.suggestLabInReport) {
          result?.suggestLabInReport?.map((res, index) => {
            var providerList = [];

            res?.provider?.map((res2, index) => {
              providerList.push(res2?.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Hcc",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
              isCmsHcc: res.isCmsHcc,
              isRxHcc: res.isRxHcc,
              isComboCode: res.isComboCode,
              providerDeatils: res.provider,
            });
          });
        }
        if (result?.suggestRadiologyInReport) {
          result?.suggestRadiologyInReport?.map((res, index) => {
            var providerList = [];

            res?.provider?.map((res2, index) => {
              providerList.push(res2.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");
            suggestListAll.push({
              actualDescription: res.actualDescription,
              capturedSections: res.capturedSections,
              diagnosisCode: res.diagnosisCode,
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
              getPlace: "Hcc",
              isHccValid: true,
              defaultPosition: res.defaultPosition,
              providerName: providerList,
              isCmsHcc: res.isCmsHcc,
              isRxHcc: res.isRxHcc,
              isComboCode: res.isComboCode,
              providerDeatils: res.provider,
            });
          });
        }

        invalidDis = result.invalidDisease;
        comboDis = result.comboDisease;
        meatCri = result.meatCriteria;

        var combiDisArray = [];
        if (result.comboDisease) {
          comboDis.map((res, index) => {
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

        // validDiseaseNewRes = validDiseaseNew[2019]

        var invalidDiseasesArray = [];
        var validDiseasesArray = [];

        for (var key in invalidDis) {
          invalidDiseasesArray.push({ name: invalidDis[key] });
        }
        for (var key in validDis) {
          validDiseasesArray.push({ name: validDis[key] });
        }

        setNewValidDiseaseList(validDisArray);
        setSuggestedHccList(suggestListAll);
        setDeletedHccList(deleteHccList);

        var capturedSectionsColorsMatching = [];
        var capturedSectionsArr = [];

        validDiseaseNewRes?.map((res) => {
          res.capturedSections?.map((res2, index) => {
            capturedSectionsArr?.push({
              name: res2,
              diagnosisCode: res?.diagnosisCode,
            });
          });
        });

        validDiseaseNewRes?.map((res) => {
          res.provider?.map((res2, index) => {
            capturedSectionsArr?.push({
              name: res2?.providerName,
              diagnosisCode: res?.diagnosisCode,
            });
          });
        });

        invalidDiseaseNewRes.map((res) => {
          res.capturedSections.map((res2, index) => {
            capturedSectionsArr.push({
              name: res2,
              diagnosisCode: res.diagnosisCode,
            });
          });
        });

        suggestListAll?.map((res) => {
          res?.capturedSections?.map((res2, index) => {
            capturedSectionsArr?.push({
              name: res2,
              diagnosisCode: res?.diagnosisCode,
            });
          });

          res.providerName?.map((res2, index) => {
            if (res2) {
              capturedSectionsArr?.push({
                name: res2,
                diagnosisCode: res?.diagnosisCode,
              });
            }
          });
        });

        if (result?.insulinDisease) {
          capturedSectionsArr?.push({
            name: result?.insulinDisease?.section,
            diagnosisCode: result?.insulinDisease?.code,
          });
        }

        var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

        dublicateSectionArr.map((res, index) => {
          capturedSectionsColorsMatching.push({
            name: res.name,
            diagnosisCode: res.diagnosisCode,
            colors: COLORS2[index],
          });
        });

        var sectionColorResult = sectionColorList.result?.response;

        let sectionColorResultMatch = sectionColorResult?.filter((o1) =>
          dublicateSectionArr.some((o2) => o1.sectionName === o2.name)
        );
        let sectionColorResultNotMatch = dublicateSectionArr.filter(
          (o1) => !sectionColorResult?.some((o2) => o1.name === o2.sectionName)
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

        //   var newArrayColorMatchs = [];
        //   newArrayColorMatchs = [
        //     ...sectionColorResultMatch,
        //     ...notMatchColorArray,
        //   ];

        //  setCaptureSectionMatching(newArrayColorMatchs);

        var encounterDateColorsMatching = [];
        var encounterDateArr = [];

        validDiseaseNewRes.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result?.invalidDisease.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result?.unMatchedDisease?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });
        result?.suggestRadiology?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        result?.suggestLab?.map((res) => {
          const array = res?.encounterDate.split(",");
          array.map((res2) => {
            encounterDateArr?.push({
              name: res2,
            });
          });
        });

        result?.suggestLabInReport?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });
        result?.suggestRadiologyInReport?.map((res) => {
          const array = res?.encounterDate?.split(",");
          array?.map((res2) => {
            encounterDateArr.push({
              name: res2,
            });
          });
        });

        if (result?.insulinDisease) {
          encounterDateArr.push({
            name: result?.insulinDisease?.dos,
          });
        }

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

        var meatHeaderList = [];

        meatCri?.map((res, index) => {
          if (
            res.monitorCapturedFromHeader != "" &&
            res.monitorCapturedFromHeader != null
          ) {
            meatMoniterHead.push({
              header: res.monitorCapturedFromHeader.toLowerCase(),
            });
          }
          if (
            res.evaluateCapturedFromHeader != "" &&
            res.evaluateCapturedFromHeader != null
          ) {
            meatEvaluteHead.push({
              header: res.evaluateCapturedFromHeader.toLowerCase(),
            });
          }
          if (
            res.assessmentCapturedFromHeader != "" &&
            res.assessmentCapturedFromHeader != null
          ) {
            meatAssesmentHead.push({
              header: res.assessmentCapturedFromHeader.toLowerCase(),
            });
          }
          if (
            res.treatmentCapturedFromHeader != "" &&
            res.treatmentCapturedFromHeader != null
          ) {
            meatTreatMentHead.push({
              header: res.treatmentCapturedFromHeader.toLowerCase(),
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
              color: COLORS3[index],
            });
          });
          allMeatHeadColorArr = allMeatHeadColor;
          meatHeaderList = dublicateRemoveArr;
          dublicateRemoveSecondArr = getUniqueListBy(
            allMeatHeadColor,
            "header"
          );
        });

        meatCri?.map((res, index) => {
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
              encounterDate: res.encounterDate,
            });
          } else {
            var providerList = [];
            res?.visitDetailsDTO?.providerSet?.map((res, index) => {
              providerList.push(res.providerName);
            });
            const encounterDatearray = res?.encounterDate?.split(",");

            meatListArr.push({
              diagnosisCode: res.diagnosisCode,
              diseaseName: res.diseaseName,
              monitorCapturedFromHeader: res.monitorCapturedFromHeader,
              assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
              evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
              treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,
              providerName: providerList,
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
              encounterDate: res.encounterDate,
              encounterDateSplit: encounterDatearray,
            });
          }
        });

        let sectionColorResultMatchMeat = sectionColorResult?.filter((o1) =>
          meatHeaderList.some((o2) => o1.sectionName === o2.header)
        );
        let sectionColorResultNotMatchMeat = meatHeaderList.filter(
          (o1) =>
            !sectionColorResult?.some((o2) => o1.header === o2.sectionName)
        );

        var notMatchColorArrayMeat = [];
        sectionColorResultNotMatchMeat?.map((res, index) => {
          var radomColorcode = stringToColour(res.header);
          var randomColorChangeShadow = radomColorcode + 33;
          notMatchColorArrayMeat.push({
            sectionName: res.header,
            backgroundColor: randomColorChangeShadow,
            sectionColor: radomColorcode,
          });
          submitSectionColors(
            res.header,
            radomColorcode,
            randomColorChangeShadow
          );
        });

        var newArrayColorMatchs = [];
        newArrayColorMatchs = [
          ...sectionColorResult,
          ...sectionColorResultMatch,
          ...notMatchColorArray,
          ...sectionColorResultMatchMeat,
          ...notMatchColorArrayMeat,
        ];

        setCaptureSectionMatching(newArrayColorMatchs);

        setMeatCriteriaList(meatListArr);

        if (result.suggestRadiology != null) {
          if (result.suggestRadiology.length != 0) {
            getPatientDetailsRadiologyYear(orgId, tenId);
          }
        }

        if (result.suggestLab != null) {
          if (result.suggestLab.length != 0) {
            getLabReportDetailsInititalLoad(
              orgId,
              tenId,
              capturedSectionsColorsMatching,
              encounterDateColorsMatching
            );
          }
        }
      }
    }
  };
  const getPatientDetailsFileLoad = async () => {
    getFileDosPageNumber();
    if (patientDetailsResult?.result?.response) {
      var result = patientDetailsResult?.result?.response;
      setPatientDocumentResult(result);
      if (result.validDisease != null) {
        setPatientFileDTO(result?.fileDetailDTO);
      }
    }
  };
  const getPatientDetailsRadiologyYear = async (orgId, tenId) => {
    var patientId = localStorage.getItem("patientId");
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`
    );
    if (response.data) {
      var result = response.data.response;

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

          getPatientPdfFileRadiology(
            result.radiologyFileDetail[0].azureBlobPath,
            tenId
          );
        }
      }
    }
  };
  const getLabReportDetailsInititalLoad = async (
    orgId,
    tenId,
    matchCode,
    encounterData
  ) => {
    var patientId = localStorage.getItem("patientId");

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/lab/compute/get/lab?patientid=${patientId}&orgid=${orgId}`
    );

    var resultTest = response.data.response;

    var dosYearArrFile = [];
    if (resultTest.labFileDetail != null) {
      if (resultTest.labFileDetail.length != 0) {
        for (var key in resultTest.labFileDetail[0].documentDos) {
          dosYearArrFile.push({ value: key, label: key });
        }

        var fileDetails = resultTest.labFileDetail;
        getLabReportFiles(fileDetails[0].azureBlobPath, tenId);
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
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      setSelectFileURLRadiology(response.data.response);
    }
  };

  const getLabReportFiles = async (fileId, tenId) => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`
    );
    if (response.data) {
      setLabReportFile(response.data.response);
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

  const validToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("validToSuggested")
        )
      );
    });

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

  const deletedToSuggested = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("deletedToSuggested")
        )
      );
    });
  const deletedToValid = () =>
    new Promise((resolve) => {
      setTimeout(() =>
        resolve(
          setConfirmNotesModalValid(true),
          setIsValidAction("deletedToValid")
        )
      );
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
    setIsModalOpenRadiology(false);
    setIsModalOpenLab(false);
    setIsFileFormShow(false);
    setFindFileKeyword(null);
    setFileLoading(false);
    setActiveTabNumber(activeTabNumber == null ? 0 : null);
    setIsEditHccForm(false);
    setOpens(false);
  };

  const findValueDocuments = async (
    headerNames,
    encounterDate,
    actualDescription
  ) => {
    setFileLoading(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");

    var splitPoint = actualDescription.substring(" ", 20);
    var pageNumber = null;
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: splitPoint,
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.second[0] ? result?.second[0] : null;
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
      setSearch({
        value: headerNames,
        headers: true,
      });
      splitPoint = headerNames;
      if (findFileKeyword == headerNames) {
        setFileLoading(false);
      }
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
    diagnosisCode,
    documentPlace
  ) => {
    setFileLoading(true);
    var fileId = patientFileDTO.fileId;
    const encounterDatesValue = encounterDate.split(",");
    var splitPoint;
    var pageNumber = null;
    var data = {
      fileId: fileId,
      header: headerNames,
      dos: encounterDatesValue,
      stringFileWord: actualDescription.substring(" ", 20),
      diagnosisCode: diagnosisCode,
    };
    try {
      if (documentPlace === "Lab" || documentPlace === "Radio") {
        setSearch({
          value: disDescription,
          headers: true,
        });
        setFileLoading(false);
        if (documentPlace === "Lab") {
          setIsModalOpenLab(true);
        } else {
          setIsModalOpenRadiology(true);
        }
      } else {
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
              headerNames,
              encounterDate,
              actualDescription
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
            headers: false,
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

  const getValidHccDetails = async (value, code) => {
    var result = "";
    var data = "";

    data = (
      <div className={visitStyles.userDetailsCard}>
        <div className="bouncing-loader"></div>
      </div>
    );

    const response = await axios.get(
      ENDPOINTS.apiEndoint +
        `dbservice/hccdisease/icd10mappingForDisease?year=${selectedDosValue}&diagnosisCode=${code}`
    );
    if (response.data) {
      var value = [];
      result = response.data.response;
      for (var key in result) {
        if (
          key != "id" &&
          key != "description" &&
          key != "year" &&
          key != "diagnosisCode" &&
          result[key] != null
        ) {
          value.push({
            name: key,
            value: result[key],
          });
        }
      }
      setHccVersionDetails(value);
    }
  };

  const getPatientDetailsReload = async (patientId) => {
    dispatch(getPatientDetailsResult(patientId));
    setFileLoading(false);
  };

  const addValidCodeFile = async (event) => {
    setIsFileFormShow(true);
    setValidated(false);
  };

  const stringToColour = (str) => {
    let hash = 0;
    str?.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, "0");
    }
    return colour;
  };

  const submitSectionColors = async (
    sectionName,
    sectionColor,
    backgroundColor
  ) => {
    var postData = {
      backgroundColor: backgroundColor,
      sectionColor: sectionColor,
      sectionName: sectionName,
    };

    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/section/color/save`,
        postData
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
      } else {
      }
    } catch (e) {}
  };

  const getEncounterDetails = async (date) => {
    const findPageNumber = listPageNumber.filter(
      (i) =>
        moment(i.date).format("MM/DD/YYYY") ===
        moment(date).format("MM/DD/YYYY")
    );
    if (findPageNumber.length != 0) {
      setFileLoading(true);
      var date = findPageNumber[0].date;
      if (findPageNumber[0].startPage.length != 0) {
        var pageNumber = findPageNumber[0].startPage[0].pageNumber;
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
    setPageNumberOptions(groupPageNumber);
    setListPageNumber(groupEncounterDate);
  };

  const handleChangePageNumber = async (value) => {
    setPopoverVisible(false);
    var str_array = value.split(",");
    var pageNumber = str_array[0];
    var findData = str_array[1];
    setFindFileKeyword(null);
    var pageIndex = pageNumber - 1;
    setFileInitialPage(pageIndex);

    setTargetPages(
      (targetPage) =>
        targetPage.pageIndex === pageNumber ||
        targetPage.pageIndex === pageNumber + 1 ||
        targetPage.pageIndex === pageNumber + 2
    );
    setFindFileKeyword(findData);
    setSearch({
      value: "",
      page: pageNumber,
    });
  };
  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };
  const PopContent = (
    <div className={styles.innerPop}>
      <div className={styles.displayDiv}>
        <div className={styles.closeContainer}>
          <FontAwesomeIcon
            icon={faClose}
            style={{
              size: 5,
              color: "#fff",
            }}
            className={styles.close_icon}
            onClick={() => setPopoverVisible(false)}
          />
        </div>
        {pageNumberOptions
          ? pageNumberOptions?.map((data) => (
              <div className={styles.hoverDiv}>
                <div className={`row ${styles.selectDetailsContainer}`}>
                  <div className="col-xl-3">
                    <span className={styles.selectHead}>{data.label}</span>
                  </div>
                  {data?.options.map((data2) => (
                    <div className={`col-xl-3 ${styles.selectDetailsDiv}`}>
                      <span
                        onClick={() => handleChangePageNumber(data2.value)}
                        className={styles.selectDetails}
                      >
                        {data2?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );

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
      <div className="my-post-content row pt-3">
        {!isFileFormShow ? (
          <div className="col-xl-3">
            <ul className="timeline">
              <div
                className={`valid-text d-flex justify-content-sm-between ${visitStyles.hcc_title_card}`}
              >
                <span className={`${visitStyles.hcc_title_name}`}>
                  HCC
                  <FontAwesomeIcon
                    onClick={() => addValidCodeFile()}
                    icon={faPlus}
                  />
                </span>
                <div className="d-flex justify-content-center">
                  <span className={`${visitStyles.hcc_title_badge}`}>
                    {newValidDiseaseList.length}
                  </span>
                </div>
              </div>
              <div className={visitStyles.container}>
                <div className={visitStyles.hccStickey_head}>
                  <HccCards
                    list={newValidDiseaseList}
                    hccVersionDetails={hccVersionDetails}
                    captureSectionMatching={captureSectionMatching}
                    encounterDateMatching={encounterDateMatching}
                    meatCriteriaList={meatCriteriaList}
                    findValueDocument={findValueDocument}
                    getEncounterDetails={getEncounterDetails}
                    onchangeValid={onchangeValid}
                    getValidHccDetails={getValidHccDetails}
                    setFormValues={setFormValues}
                    setIsEditHccForm={setIsEditHccForm}
                    setFormEditPlace={setFormEditPlace}
                    okText="Move to Deleted"
                    cancelText="Move to Suggested"
                    confirmFunc={confirmvalid}
                    cancelFunc={validToSuggested}
                    editFormPlace={"VALID_DISEASE"}
                    setOpens={setOpens}
                    setCombiTree={setCombiTree}
                    setActiveTabHead={setActiveTabHead}
                    setActiveMeatTitle={setActiveMeatTitle}
                    setActiveComboTree={setActiveComboTree}
                  />
                </div>
              </div>
            </ul>
          </div>
        ) : null}
        <div className={isFileFormShow ? "col-xl-1" : "d-none"}>
          <Button
            onClick={() => handleCloseModal()}
            className={`ms-2 ${visitStyles.backArrowBtn}`}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{
                color: "rgb(38 50 107)",
              }}
            />
          </Button>
        </div>
        <div className={isFileFormShow ? "col-xl-7" : "col-xl-6"}>
          <Popover
            open={popoverVisible}
            content={PopContent}
            placement="bottom"
            trigger={"click"}
            onOpenChange={() => setPopoverVisible(true)}
          >
            <div className={styles.dosContainer}>
              <span className={styles.dosPageNumber}>
                Select Dos Page Number
              </span>
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{
                  size: 10,
                  color: "#e6e6e6",
                }}
              />
            </div>
          </Popover>
          <div className="card-body p-0">
            {hccFileDetails?.loading != true ? (
              <>
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
                  />
                )}
              </>
            ) : null}
          </div>
        </div>
        {isFileFormShow ? (
          <div className="col-xl-4">
            <AddHccForm
              diagnosisCode={inputValue.diagnosisCode}
              handleCloseModal={handleCloseModal}
              isAddHccForm={isAddHccForm}
              setIsAddHccForm={setIsAddHccForm}
              isMeatNew={true}
            />
          </div>
        ) : null}
        {!isFileFormShow ? (
          <div className="col-xl-3">
            <div className="">
              <ul className="timeline">
                <div
                  className={`valid-text d-flex justify-content-sm-between ${visitStyles.suggested_title_card}`}
                >
                  <span className={`${visitStyles.suggested_title_name}`}>
                    SUGGESTED CODES
                  </span>
                  <div className="d-flex justify-content-center">
                    <span className={`${visitStyles.suggested_title_badge}`}>
                      {suggestedHccList.length}
                    </span>
                  </div>
                </div>
                <div className={visitStyles.suggestedcontainer2}>
                  <div className={visitStyles.hccStickey_head}>
                    <HccCards
                      list={suggestedHccList}
                      hccVersionDetails={hccVersionDetails}
                      captureSectionMatching={captureSectionMatching}
                      encounterDateMatching={encounterDateMatching}
                      meatCriteriaList={meatCriteriaList}
                      findValueDocument={findValueDocument}
                      getEncounterDetails={getEncounterDetails}
                      onchangeValid={onchangeValid}
                      getValidHccDetails={getValidHccDetails}
                      setFormValues={setFormValues}
                      setIsEditHccForm={setIsEditHccForm}
                      setFormEditPlace={setFormEditPlace}
                      okText={"Move to Deleted"}
                      cancelText={"Move to HCC"}
                      confirmFunc={suggestedToDeleted}
                      cancelFunc={suggestedToValid}
                      suggestedToDeleted={suggestedToDeleted}
                      editFormPlace={"SUGGESTED_DISEASE"}
                      setOpens={setOpens}
                      setCombiTree={setCombiTree}
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                      setActiveComboTree={setActiveComboTree}
                    />
                  </div>
                </div>
              </ul>
            </div>

            <div className={visitStyles.deleteFileContainer}>
              <ul className="timeline">
                <div
                  className={`valid-text d-flex justify-content-sm-between ${visitStyles.deleted_title_card}`}
                >
                  <span className={`${visitStyles.deleted_title_name}`}>
                    DELETED CODES
                  </span>
                  <div className="d-flex justify-content-center">
                    <span className={`${visitStyles.deleted_title_badge}`}>
                      {deletedHccList.length}
                    </span>
                  </div>
                </div>
                <div className={visitStyles.deletedContainer}>
                  <div className={visitStyles.hccStickey_head}>
                    <HccCards
                      list={deletedHccList}
                      hccVersionDetails={hccVersionDetails}
                      captureSectionMatching={captureSectionMatching}
                      encounterDateMatching={encounterDateMatching}
                      meatCriteriaList={meatCriteriaList}
                      findValueDocument={findValueDocument}
                      getEncounterDetails={getEncounterDetails}
                      onchangeValid={onchangeValid}
                      getValidHccDetails={getValidHccDetails}
                      setFormValues={setFormValues}
                      setIsEditHccForm={setIsEditHccForm}
                      setFormEditPlace={setFormEditPlace}
                      okText="Move to Suggested"
                      cancelText="Move to HCC"
                      confirmFunc={deletedToSuggested}
                      cancelFunc={deletedToValid}
                      isDeletedCodes={true}
                      setOpens={setOpens}
                      setCombiTree={setCombiTree}
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                      setActiveComboTree={setActiveComboTree}
                    />
                  </div>
                </div>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
      <ModelIndex
        validated={validated}
        handleSubmit={(event)=>handleSubmitValidNotes(event,setFileLoading,setConfirmNotesModalValid,
          getPatientDetailsReload,setValidated)}
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        handleCloseModal={handleCloseModal}
        handleChangeSuggested={handleChangeSuggested}
      />

      <ModelIndex
        validated={validated}
        title={selectMeatName}
        openState={isModalOpenLab}
        handleCloseModal={handleCloseModal}
        labReportFile={labReportFile}
        search={search}
      />

      <ModelIndex
        validated={validated}
        title={selectMeatName}
        openState={isModalOpenRadiology}
        handleCloseModal={handleCloseModal}
        labReportFile={selectFileURLRadiology}
        search={search}
      />
      {opens && combiTree[0]?.children?.length > 0 ? (
        <ModelIndex
          validated={validated}
          title={fileModalHeader}
          openState={opens}
          handleCloseModal={handleCloseModal}
          combiTree={combiTree}
        />
      ) : (
        opens && showErrorMessage()
      )}

      <EditHccForm
        formValues={formValues}
        isEditHccForm={isEditHccForm}
        setIsEditHccForm={setIsEditHccForm}
        formEditPlace={formEditPlace}
      />
    </>
  );
};

export default File;