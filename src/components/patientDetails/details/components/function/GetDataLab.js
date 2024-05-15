export const getPatientLabDetails = async (
  labDetailsResult,
  setLabReportValidList,
  sectionColorList,
  setPatientLabDetails,
  setLabResult,
  setLabFileDosList,
  setCaptureSectionMatching,
  setEncounterDateMatching,
  setLabFileDateDefaulteSelect,
  setLabResultStatus,
  setLabFileFilterList,
  setLabReportMeatList,
  setAllDisList,
  setDeletedDiseasesList
) => {
  if (labDetailsResult?.result?.response) {
    var resultTest = labDetailsResult?.result?.response;
    setPatientLabDetails && setPatientLabDetails(resultTest);
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
        setLabFileDateDefaulteSelect &&
          setLabFileDateDefaulteSelect(dosYearArrFile[0]);
        var fileDetails = resultTest.labFileDetail;
      }
    }
    setLabFileFilterList && setLabFileFilterList(fileDatesArr);
    if (resultTest?.labFileDetail) {
      var result = resultTest;
      setLabResult && setLabResult(result);
      var dosYearArr = [];
      var dosYearArrFile = [];
      var validDiseaseNewRes = [];
      var meatRes = [];
      for (var key in result.validDisease) {
        dosYearArr.push({ value: key, label: key });
      }

      setLabFileDosList && setLabFileDosList(dosYearArr);
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
        meatRes = result.meatCriteria[dateofService];

        if (result.labFileDetail != null || result.labFileDetail.length != 0) {
          for (var key in result.labFileDetail[0].documentDos) {
            dosYearArrFile.push({ value: key, label: key });
          }
          setLabFileDateDefaulteSelect &&
            setLabFileDateDefaulteSelect(dosYearArrFile[0]);
          var fileDetails = result.labFileDetail;
        }
      }
      var meatListArr = [];
      meatRes.map((res, index) => {
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
      setLabReportValidList(validDisArray);
      setLabReportMeatList(meatListArr);
      setAllDisList && setAllDisList([...validDisArray]);
      setLabResultStatus && setLabResultStatus(true);
    }
  }
};
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
