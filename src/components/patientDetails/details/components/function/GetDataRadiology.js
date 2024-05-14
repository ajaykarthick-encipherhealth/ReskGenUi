export const getPatientRadiologyDetails = async (
  radiologyDetailsResult,
  sectionColorList,
  setPatientDetailsRadiology,
  setFileRadiologyDateofServiceList,
  setRadiologyFileDateDefaulteSelect,
  setRadiologyFileDetailCheck,
  setCaptureSectionMatching,
  setEncounterDateMatching,
  setNewValidDiseaseListRadiology,
  setInNewValidDiseaseListRadiology,
  setIsLoadingDos,
  setMeatCriteriaListRadiology,
  setAllDisList,
  setDeletedDiseasesList
) => {
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
        setFileRadiologyDateofServiceList && setFileRadiologyDateofServiceList(dosYearArrFile);
        setRadiologyFileDateDefaulteSelect && setRadiologyFileDateDefaulteSelect(dosYearArrFile[0]);
        setRadiologyFileDetailCheck && setRadiologyFileDetailCheck(true);
      }
    }
    if (result.validDisease != null) {
      var validDis = "";
      var comboDis = "";
      var dosYearArr = [];
      var validDiseaseNewRes = [];
      var invalidDiseaseNewRes = [];
      var unMatchRes = [];
      var deletedRes = [];

      for (var key in result.validDisease) {
        dosYearArr.push({ value: key, label: key });
      }

      var dateofService = dosYearArr[0].value;
      validDis = result.validDisease[dateofService];
      validDiseaseNewRes = result?.validDisease[dateofService];
      if(result?.invalidDisease){
      invalidDiseaseNewRes = result?.invalidDisease[dateofService];
      }
      if(result?.deletedDisease){
      deletedRes = result?.deletedDisease[dateofService];
      }
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
          dosYear:dateofService
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
          dosYear:dateofService
        });
      });

      var deletedDisArray = [];
      deletedRes?.map((res, index) => {
        const encounterDatearray = res.encounterDate.split(",");
        var providerList = [];
        res.provider?.map((res, index) => {
          providerList.push(res.providerName);
        });
        deletedDisArray.push({
          actualDescription: res.actualDescription,
          capturedSections: res.capturedSections,
          diagnosisCode: res.diagnosisCode,
          encounterDate: res.encounterDate,
          encounterDateSplit: encounterDatearray,
          isManuallyAdded: res.isManuallyAdded,
          isHccValid: res.isHccValid,
          defaultPosition: res.defaultPosition,
          providerName: providerList,
          dosYear:dateofService

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
      var meatCri = '';
      if (result.meatCriteria != null) {
        meatCri = result.meatCriteria[dateofService];
      }
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
      setEncounterDateMatching(encounterDateColorsMatching);
      setNewValidDiseaseListRadiology(validDisArray);
      setInNewValidDiseaseListRadiology(invalidDisArray);
      setDeletedDiseasesList(deletedDisArray);
      setAllDisList([...validDisArray,...invalidDisArray,...deletedDisArray]);
      setIsLoadingDos && setIsLoadingDos(false);
    }
  }
};
function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
}
