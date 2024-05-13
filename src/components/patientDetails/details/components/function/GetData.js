import {
  getLabFileDetails,
  getRadiologyFileDetails,
} from "../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";

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
  sectionColorList
) => {
  if (patientDetailsResult?.result?.response) {
    var result = patientDetailsResult?.result?.response;
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
              dbDescription: res.dbDescription,
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
        submitSectionColors(res.name, radomColorcode, randomColorChangeShadow);
      });

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
        dublicateRemoveSecondArr = getUniqueListBy(allMeatHeadColor, "header");
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
        (o1) => !sectionColorResult?.some((o2) => o1.header === o2.sectionName)
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
          getPatientDetailsRadiologyYear(orgId, dispatch);
        }
      }

      if (result.suggestLab != null) {
        if (result.suggestLab.length != 0) {
          getLabReportDetailsInititalLoad(orgId, dispatch);
        }
      }
    }
  }
};


const GetData = () => {
  return (
   <></>
  )
}

export default GetData;