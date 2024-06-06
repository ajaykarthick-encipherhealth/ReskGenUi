import {
  getLabFileDetails,
  getRadiologyFileDetails,
} from "../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import { stringToColour } from "./ReusableFunctions";
import NewResponse from "./newresponse.json";

export const COLORS = [
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

export const COLORS2 = [
  "sectionTag1",
  "sectionTag2",
  "sectionTag3",
  "sectionTag4",
  "sectionTag5",
  "sectionTag6",
  "sectionTag7",
  "sectionTag8",
];

export const COLORS3 = [
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

// const stringToColour = (str) => {
//   let hash = 0;
//   str?.split("").forEach((char) => {
//     hash = char.charCodeAt(0) + ((hash << 5) - hash);
//   });
//   let colour = "#";
//   for (let i = 0; i < 3; i++) {
//     const value = (hash >> (i * 8)) & 0xff;
//     colour += value.toString(16).padStart(2, "0");
//   }
//   if(str.toLocaleLowerCase() === "plan"){
//      colour = "#536cdf"
//   }
//   return colour;
// };

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

const getPatientDetailsRadiologyYear = async (orgId, dispatch) => {
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

        dispatch(
          getRadiologyFileDetails(result.radiologyFileDetail[0].azureBlobPath)
        );
      }
    }
  }
};
const getLabReportDetailsInititalLoad = async (orgId, dispatch) => {
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
      dispatch(getLabFileDetails(fileDetails[0].azureBlobPath));
    }
  }
};
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
export const getPatientDetails = async (
  orgId,
  tenId,
  setPatientDocumentResult,
  setNewValidDiseaseList,
  setSuggestedHccList,
  setDeletedHccList,
  setEncounterDateMatching,
  setCaptureSectionMatching,
  setMeatCriteriaList,
  patientDetailsResult,
  dispatch,
  sectionColorList,
  setAllDisList,
  setComboDiseaseCodesList,
  setDosSummariesList,
  setNonHccDiseasesList,
  setDeletedMeatList
) => {
  if (patientDetailsResult?.data?.response) {
    var result = patientDetailsResult?.data?.response;
  // if (NewResponse) {
  //   var result = NewResponse.response;
    setPatientDocumentResult(result);
    if (result.hccDiseases != null) {
      var hccDisArray = [];
      var nonHccDisArray = [];
      var suggestListAll = [];
      var deleteHccList = [];
      var combiDisArray = [];
      var meatHeaderList = [];
      var deletedmeatListArr = [];
      var rafScore = [];

      if (result.scoreDetailVersionDTO != null) {
        rafScore = result.scoreDetailVersionDTO;
      }
      result?.hccDiseases?.map((res, index) => {
        var providerList = [];
        var dosList = [];
        res.providerNames?.map((res) => {
          providerList.push(res);
        });
        res.dateOfServices?.map((res) => {
          dosList.push(res.date);
        });
        if(res.isShow != false){
        hccDisArray.push({
          actualDescription: res.actualDescription,
          capturedSections: res.capturedSections,
          diagnosisCode: res.diagnosisCode,
          encounterDate: res.encounterDate,
          encounterDateSplit:  res.dateOfServices,
          isManuallyAdded: getStateIndicators(res.stateIndicators,"MANUALLY_ADDED"),
          isHccValid: res.isHccValid,
          defaultPosition: res.defaultPosition,
          providerName: providerList,
          dbDescription: res.dbDescription,
          isMostSpecific: getStateIndicators(res.stateIndicators,"MOST_SPECIFIC"),
          children: res.children,
          getPlace: "Hcc",
          isCmsHcc: res.isCmsHcc,
          isRxHcc: res.isRxHcc,
          providerDeatils: res.provider,
          isComboCode: getStateIndicators(res.stateIndicators,"COMBO_CODE"),
          notes: res.notes,
          hyperlinks: res?.hyperlinks,
          suspectType:res.suspectType,
          dateOfServices:res.dateOfServices,
        });
      }
      });

      result?.nonHccDiseases?.map((res, index) => {
        var providerList = [];
        res.providerNames?.map((res) => {
          providerList.push(res);
        });
        nonHccDisArray.push({
          actualDescription: res.actualDescription,
          capturedSections: res.capturedSections,
          diagnosisCode: res.diagnosisCode,
          encounterDate: res.encounterDate,
          encounterDateSplit:  res.dateOfServices,
          isManuallyAdded: getStateIndicators(res.stateIndicators,"MANUALLY_ADDED"),
          isHccValid: res.isHccValid,
          defaultPosition: res.defaultPosition,
          providerName: providerList,
          dbDescription: res.dbDescription,
          isMostSpecific: getStateIndicators(res.stateIndicators,"MOST_SPECIFIC"),
          children: res.children,
          isCmsHcc: res.isCmsHcc,
          isRxHcc: res.isRxHcc,
          providerDeatils: res.provider,
          isComboCode: getStateIndicators(res.stateIndicators,"COMBO_CODE"),
          notes: res.notes,
          hyperlinks: res?.hyperlinks,
          suspectType:res.suspectType,
          dateOfServices:res.dateOfServices,
        });
      });

      result?.suggestedHccDiseases?.map((res, index) => {
        if (res.isShow != false) {
          var providerList = [];
          var dosList = [];
          res.providerNames?.map((res) => {
            providerList.push(res);
          });
          res.dateOfServices?.map((res) => {
            dosList.push(res.date);
          });
          suggestListAll.push({
            actualDescription: res.actualDescription,
            diagnosisCodeFinding: res.diagnosisCode,
            isHccValid: res.isHccValid,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit:  res.dateOfServices,
            getPlace: "Hcc",
            defaultPosition: res.defaultPosition,
            providerName: providerList,
            children: res.children ? res.children : [],
            isMostSpecific: getStateIndicators(res.stateIndicators,"MOST_SPECIFIC"),
            isCmsHcc: res.isCmsHcc,
            isRxHcc: res.isRxHcc,
            isManuallyAdded: getStateIndicators(res.stateIndicators,"MANUALLY_ADDED"),
            isComboCode: getStateIndicators(res.stateIndicators,"COMBO_CODE"),
            providerDeatils: res.provider,
            notes: res.notes,
            hyperlinks: res?.hyperlinks,
            suspectType:res.suspectType,
            dateOfServices:res.dateOfServices,
            dbDescription: res.dbDescription,

          });
        }
      });

      result?.deletedDiseases?.map((res, index) => {
        if (res.isShow != false) {
          const encounterDatearray = res?.encounterDate?.split(",");
          var providerList = [];
          res.providerNames?.map((res) => {
            providerList.push(res);
          });
          deleteHccList.push({
            actualDescription: res.actualDescription,
            dbDescription: res.dbDescription,
            capturedSections: res.capturedSections,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit: res.dateOfServices,
            isManuallyAdded: getStateIndicators(res.stateIndicators,"MANUALLY_ADDED"),
            isHccValid: res.isHccValid,
            defaultPosition: res.defaultPosition,
            providerName: providerList,
            isCmsHcc: res.isCmsHcc,
            isRxHcc: res.isRxHcc,
            isComboCode: getStateIndicators(res.stateIndicators,"COMBO_CODE"),
            isMostSpecific: getStateIndicators(res.stateIndicators,"MOST_SPECIFIC"),
            notes: res.notes,
            hyperlinks: res?.hyperlinks,
            suspectType:res.suspectType,
            dateOfServices:res.dateOfServices,

          });
        }
      });

      result?.comboDisease?.map((res, index) => {
          var providerList = [];
          var dosList = [];
          res.providerNames?.map((res) => {
            providerList.push(res);
          });
          res.dateOfServices?.map((res) => {
            dosList.push(res.date);
          });
          combiDisArray.push({
            addOnCode: res.addOnCode,
            addOnCodeTwo: res.addOnCodeTwo,
            addOnCodeThree: res.addOnCodeThree,
            addOnCodes: [res.addOnCode, res.addOnCodeTwo, res.addOnCodeThree],
            diagnosisCodeCombo: res.diagnosisCodeCombo,
            diseaseName: res.diseaseName,
            diagnosisCode: res.diagnosisCode,
            encounterDate: res.encounterDate,
            encounterDateSplit:  res.dateOfServices,
            providerName: providerList,
            providers: res.provider ? res.providers : res.provider,
            ruleType: res.ruleType,
            capturedSections: res.capturedSections,
            children: res.children ? res.children : [],
            expanded: true,
            hyperlinks: res?.hyperlinks,
            dateOfServices:res.dateOfServices,
          });
      });
      setNewValidDiseaseList && setNewValidDiseaseList(hccDisArray);
      setSuggestedHccList && setSuggestedHccList(suggestListAll);
      setNonHccDiseasesList&& setNonHccDiseasesList(nonHccDisArray);
      setDeletedHccList && setDeletedHccList(deleteHccList);
      setComboDiseaseCodesList && setComboDiseaseCodesList(combiDisArray);
      setDosSummariesList && setDosSummariesList(result?.dosSummaries);
      var capturedSectionsColorsMatching = [];
      var capturedSectionsArr = [];

      result?.hccDiseases?.map((res) => {
        res.capturedSections?.map((res2, index) => {
          capturedSectionsArr?.push({
            name: res2,
            diagnosisCode: res?.diagnosisCode,
          });
        });
      });

      result?.hccDiseases?.map((res) => {
        res.providerNames?.map((res2, index) => {
          capturedSectionsArr?.push({
            name: res2,
            diagnosisCode: res?.diagnosisCode,
          });
        });
      });

      nonHccDisArray.map((res) => {
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

      var dublicateSectionArr = getUniqueListBy(capturedSectionsArr, "name");

      dublicateSectionArr.map((res, index) => {
        capturedSectionsColorsMatching.push({
          name: res.name,
          diagnosisCode: res.diagnosisCode,
          colors: COLORS2[index],
        });
      });

      // var sectionColorResult = sectionColorList.result?.response;

      // let sectionColorResultMatch = sectionColorResult?.filter((o1) =>
      //   dublicateSectionArr.some((o2) => o1.sectionName === o2.name)
      // );
      // let sectionColorResultNotMatch = dublicateSectionArr.filter(
      //   (o1) => !sectionColorResult?.some((o2) => o1.name === o2.sectionName)
      // );

      var notMatchColorArray = [];
      dublicateSectionArr?.map((res, index) => {
        var radomColorcode = stringToColour(res.name);
        var randomColorChangeShadow = radomColorcode + 33;
        notMatchColorArray.push({
          sectionName: res.name,
          backgroundColor: randomColorChangeShadow,
          sectionColor: radomColorcode,
        });
        // submitSectionColors(res.name, radomColorcode, randomColorChangeShadow);
      });

      var encounterDateColorsMatching = [];
      var encounterDateArr = [];

      result?.hccDiseases?.map((res) => {
        res?.dateOfServices.map((res2) => {
          encounterDateArr.push({
            name: res2,
          });
        });
      });
      result?.nonHccDiseases?.map((res) => {
        res?.dateOfServices.map((res2) => {
          encounterDateArr.push({
            name: res2,
          });
        });
      });

      result?.suggestedHccDiseases?.map((res) => {
        res?.dateOfServices.map((res2) => {
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

      result?.meatCriteria?.map((res, index) => {
        res.providerNames?.map((res) => {
          meatMoniterHead.push({
            name: res,
          });
        });
          res?.monitorHyperLink?.map((res2, index) => {
            meatMoniterHead.push({
              name: res2.header,
            });
          });
          res?.evaluateHyperLink?.map((res2, index) => {
            meatMoniterHead.push({
              name: res2.header,
            });
          });
          res?.assessmentHyperLink?.map((res2, index) => {
            meatMoniterHead.push({
              name:res2.header,
            });
          });
          res?.treatmentHyperLink?.map((res2, index) => {
            meatMoniterHead.push({
              name: res2.header,
            });
          });
        var dublicateRemoveArr = getUniqueListBy(meatMoniterHead, "name");
        dublicateRemoveArr.map((res3, index) => {
          allMeatHeadColor.push({
            header: res3.header,
            color: COLORS3[index],
          });
        });
        allMeatHeadColorArr = allMeatHeadColor;
        meatHeaderList = dublicateRemoveArr;
        dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, "header");
      });

      result?.meatCriteria?.map((res, index) => {
        if (res.category == "Invalid") {
          nonHccMeatListArr.push({
            diagnosisCode: res.diagnosisCode,
            diseaseName: res.diseaseName,
            monitorCapturedFromHeader: res.monitorCapturedFromHeader,
            assessmentCapturedFromHeader: res.assessmentCapturedFromHeader,
            evaluateCapturedFromHeader: res.evaluateCapturedFromHeader,
            treatmentCapturedFromHeader: res.treatmentCapturedFromHeader,

            monitorColor: COLORS[index],
            meatColor: COLORS[index],
            assessment: res.assessment,
            monitor: res.monitor,
            evaluate: res.evaluate,
            treatment: res.treatment,
            isMeatCriteriaPresent: res.isMeatCriteriaPresent,
            category: res.category,
            encounterDate: res.dateOfService,
            hyperlinks: res?.hyperlinks,
          });
        } else {
          if(res.isShow != false){
          var providerList = [];
          var dosList = [];
          res.providerNames?.map((res) => {
            providerList.push(res);
          });
          res.dateOfService?.map((res) => {
            dosList.push(res.date);
          });
          var monitorHyperLink = [];
          if (res?.monitorHyperLink) {
            res.monitorHyperLink?.map((res, index) => {
              (res.value = res.header), (res.label = res.header);
              monitorHyperLink.push(res);
            });
          }
          meatListArr.push({
            diagnosisCode: res.diagnosisCode,
            diseaseName: res.diseaseName,
            monitorAspect: res.monitorAspect,
            monitorHyperLink: monitorHyperLink,
            assessmentAspect: res.assessmentAspect,
            assessmentHyperLink: res.assessmentHyperLink,
            evaluateAspect: res.evaluateAspect,
            evaluateHyperLink: res.evaluateHyperLink,
            treatmentAspect: res.treatmentAspect,
            treatmentHyperLink: res.treatmentHyperLink,
            providerName: providerList,
            monitorColor: COLORS[index],
            meatColor: COLORS[index],
            assessment: res.assessment,
            monitor: res.monitor,
            evaluate: res.evaluate,
            treatment: res.treatment,
            isMeatCriteriaPresent: res.isMeatCriteriaPresent,
            category: res.category,
            encounterDate: res.encounterDate,
            encounterDateSplit:  res.dateOfService,
            hyperlinks: res?.hyperlinks,
            dateOfServices:res.dateOfServices,
          });
        }
      }
      });
      result?.deletedMeatCriteria?.map((res, index) => {
       
          var providerList = [];
          var dosList = [];
          res.providerNames?.map((res) => {
            providerList.push(res);
          });
          res.dateOfService?.map((res) => {
            dosList.push(res.date);
          });
          var monitorHyperLink = [];
          if (res?.monitorHyperLink) {
            res.monitorHyperLink?.map((res, index) => {
              (res.value = res.header), (res.label = res.header);
              monitorHyperLink.push(res);
            });
          }
          deletedmeatListArr.push({
            diagnosisCode: res.diagnosisCode,
            diseaseName: res.diseaseName,
            monitorAspect: res.monitorAspect,
            monitorHyperLink: monitorHyperLink,
            assessmentAspect: res.assessmentAspect,
            assessmentHyperLink: res.assessmentHyperLink,
            evaluateAspect: res.evaluateAspect,
            evaluateHyperLink: res.evaluateHyperLink,
            treatmentAspect: res.treatmentAspect,
            treatmentHyperLink: res.treatmentHyperLink,
            providerName: providerList,
            monitorColor: COLORS[index],
            meatColor: COLORS[index],
            assessment: res.assessment,
            monitor: res.monitor,
            evaluate: res.evaluate,
            treatment: res.treatment,
            isMeatCriteriaPresent: res.isMeatCriteriaPresent,
            category: res.category,
            encounterDate: res.encounterDate,
            encounterDateSplit:  res.dateOfService,
            hyperlinks: res?.hyperlinks,
            dateOfServices:res.dateOfServices,
          });
      });

      // let sectionColorResultMatchMeat = sectionColorResult?.filter((o1) =>
      //   meatHeaderList.some((o2) => o1.sectionName === o2.name)
      // );
      // let sectionColorResultNotMatchMeat = meatHeaderList.filter(
      //   (o1) => !sectionColorResult?.some((o2) => o1.name === o2.sectionName)
      // );
      var notMatchColorArrayMeat = [];
      meatHeaderList?.map((res, index) => {
        var radomColorcode = stringToColour(res.name);
        var randomColorChangeShadow = radomColorcode + 33;
        notMatchColorArrayMeat.push({
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
        // ...sectionColorResult,
        // ...sectionColorResultMatch,
        ...notMatchColorArray,
        // ...sectionColorResultMatchMeat,
        ...notMatchColorArrayMeat,
      ];

      setCaptureSectionMatching(newArrayColorMatchs);

      setMeatCriteriaList && setMeatCriteriaList(meatListArr);
      setDeletedMeatList && setDeletedMeatList(deletedmeatListArr);
      setAllDisList &&
        setAllDisList([...hccDisArray, ...deleteHccList, ...suggestListAll]);

      // if (result.suggestRadiology != null) {
      //   if (result.suggestRadiology.length != 0) {
      //     getPatientDetailsRadiologyYear(orgId, dispatch);
      //   }
      // }

      // if (result.suggestLab != null) {
      //   if (result.suggestLab.length != 0) {
      //     getLabReportDetailsInititalLoad(orgId, dispatch);
      //   }
      // }
    }
  }
};

const getStateIndicators=(data,state)=>{
  const result = data?.some(item => 
    item === state
  )
  return result;
}

const GetData = () => {
  return <></>;
};

export default GetData;
