import { requestPortal, requestPortalFiles } from "../../../utils/network";
import { getStorage, setStorage } from "../../../utils/storages";

export async function patientDetailsBasedOnACtionType() {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/process-scope?patientId=${patientId}`,
    options
  );
  return data;
}
export async function patientDetails(
  patientId,
  processedYear,
  dos,
  setIsSpinnerLoading,
  role
) {
  const roles = getStorage("userRole");
  const options = {
    method: "GET",
  };
  var url = `patientId=${patientId}&role=${roles?.toUpperCase()}&processedYear=${processedYear}`;
  if (dos) {
    url = `patientId=${patientId}&role=${
      roles ? roles?.toUpperCase() : ""
    }&dateOfService=${dos}`;
  }
  try {
    const data = await requestPortal(
      `dbservice/patient/compute/get?${url}
    `,
      options
    );
    return data;
  } catch (error) {
    setIsSpinnerLoading(false);
    return error
  }
}

export async function patientIdDetails(patientId) {
  const orgId = getStorage("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/get?patientId=${patientId}`,
    options
  );
  return data;
}

export async function radiologyDetails(
  patientId,
  processedYear,
  dos,
  setIsSpinnerLoading,
  testName
) {
  const roles = getStorage("userRole");
  const options = {
    method: "GET",
  };
  var url = `patientId=${patientId}&processedYear=${processedYear}&dateOfService=${dos}&stateIndicator=RADIOLOGY`;
  try {
    const data = await requestPortal(
      `dbservice/patient/compute/get/diagnostic/data?${url}
    `,
      options
    );
    return data;
  } catch (error) {
    setIsSpinnerLoading(false);
  }
}

export async function labDetails(
  patientId,
  processedYear,
  dos,
  setIsSpinnerLoading,
  testName
) {
  const roles = getStorage("userRole");
  const options = {
    method: "GET",
  };
  var url = `patientId=${patientId}&processedYear=${processedYear||""}&dateOfService=${dos}&stateIndicator=LAB`;
  try {
    const data = await requestPortal(
      `dbservice/patient/compute/get/diagnostic/data?${url}
    `,
      options
    );
    return data;
  } catch (error) {
    setIsSpinnerLoading(false);
  }
}

export async function labPDFData({fileId}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/fileDetail/findbyid?fileId=${fileId}`,
    options
  );
  return data;
}

export async function patientHccFile(fileId) {
  const options = {
    method: "GET",
  };
  const result = await requestPortal(
    `dbservice/fileDetail/findbyid?fileId=${fileId}`,
    options
  );
  setStorage("fileId", result?.response?.azureBlobPath || null);
  // const data = await requestPortal(
  //   // `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`,
  //   `management/patient/report/getfile/validator?blobName=${result?.response?.azureBlobPath}`,
  //   options
  // );
  return result;
}

export async function dosWiseList(patientId, year) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/get/alldos?patientId=${patientId}&processedYear=${year}`,
    options
  );
  return data;
}
export async function dosPageNumerList(patientId, year) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/get/alldossummaries?patientId=${patientId}&processedYear=${year}`,
    options
  );
  return data;
}

export async function meatQuery(patientId, year, dos) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/meatquery/getMeatQueryList?processedYear=${year}&patientId=${patientId}&dateOfService=${dos}`,
    options
  );
  return data;
}
export async function getFlagsList(patientId, year, dos) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/flagdetails/get?patientId=${patientId}&processedYear=${
      year || ""
    }&dateOfService=${dos || ""}`,
    options
  );
  return data;
}

export async function getProviderAndCaptured(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `dbservice/provider/getProviderAndCapturedSection`,
    options
  );
  return data;
}

export async function deleteflag(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/flagdetails/removeFlag`, options);
  return data;
}

export async function deleteNotes(obj) {
  const options = {
    method: "DELETE",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/notes/delete`, options);
  return data;
}

export async function deleteComments(obj) {
  const options = {
    method: "DELETE",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/comment/delete`, options);
  return data;
}

export async function addNotes(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/notes`, options);
  return data;
}

export async function addComments(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/comment`, options);
  return data;
}

export async function isValideCode(code) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/icddisease/finddiseasebycode?diseasecode=${code}`,
    options
  );
  return data;
}

export async function isCodePracent({ code, patientId, dos, date }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/find/diagnosiscode?diagnosisCode=${code}&patientId=${patientId}&dos=${dos}&date=${date}`,
    options
  );
  return data;
}

export async function manuallyAddCode(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`management/disease/add`, options);
  return data;
}
export async function diseaseEdit(obj) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`management/edit/disease`, options);
  return data;
}
export async function diseaseEditMeat(obj) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`management/edit/meat`, options);
  return data;
}

export async function radiologyDetailsSetEmpty() {
  return null;
}

export async function getAllProcessYear(patientId, type) {
  const options = {
    method: "GET",
  };
  var URL = `dbservice/patient/compute/get/allyear?patientId=${patientId}`;
  // if (type == "RADIOLOGY") {
  //   URL = `dbservice/radiology/compute/get/allyear?patientId=${patientId}`;
  // }
  // if (type == "LAB") {
  //   URL = `dbservice/lab/compute/get/allyear?patientId=${patientId}`;
  // }
  const data = await requestPortal(URL, options);
  return data;
}

export async function radiologydosWiseList(patientId, year) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/get/alldos/stateindicator?patientId=${patientId}&processedYear=${year}&stateIndicator=RADIOLOGY`,
    options
  );
  return data;
}

export async function labdosWiseList(patientId, year) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/get/alldos/stateindicator?patientId=${patientId}&processedYear=${year||""}&stateIndicator=LAB`,
    options
  );
  return data;
}
export async function activeLabel({ patientId, year, dos }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/get/diseasegroup?patientId=${patientId}&processedYear=${year}&dateOfService=${dos}`,
    options
  );
  return data;
}

export async function suggestedToValid(obj, cardTitle) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  var apiUrl = "management/disease/move/suggestedtovalid";
  if (cardTitle.name == "Move to HCC" && cardTitle.title == "DELETED") {
    apiUrl = "management/disease/move/deletedtovalid";
  }
  if (cardTitle.name == "Move to HCC" && cardTitle.title == "POTENTIAL") {
    apiUrl = "management/disease/move/potentialtovalid";
  }
  if (cardTitle.name == "Move to HCC" && cardTitle.title == "NON_MEAT") {
    apiUrl = "management/disease/move/suggestedtovalid";
  }
  const data = await requestPortal(apiUrl, options);
  return data;
}

export async function suggestedMeatCheck(diagnosisCode) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/meat/conformation?diagnosisCode=${diagnosisCode}`,
    options
  );
  return data;
}
// manuallyAddDosAndProvider
export async function manuallyAddDosAndProvider(data) {
  const options = {
    method: "PUT",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(
    `management/dos-provider/add-update`,
    options
  );
  return res;
}

export async function manuallyAddDosAndProviderList(year) {
  const patientId = getStorage("patientId");
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `management/dos-provider/get-dos-and-provider-information?patientId=${patientId}&processedYear=${year}`,
    options
  );
  return res;
}

export async function getValidHccDetailsApi(year, code) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/hccdisease/icd10mappingForDisease?year=${year}&diagnosisCode=${code}`,
    options
  );
  return res;
}

export async function getTimelineList({patientId,dos}) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/actioneventaudit?patientid=${patientId}&dos=${dos?dos:""}&pageno=${0}&pagesize=${100}`,
    options
  );
  return res;
}

export async function getUserDetails(userId) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/user/get?userName=${userId}`,
    options
  );
  return res;
}

export async function addValidDisease(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `dbservice/patient/compute/addvaliddisease`,
    options
  );
  return data;
}

export async function findDiseaseByCode(value) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/icddisease/finddiseasebycode?diseasecode=${value}`,
    options
  );
  return data;
}
export async function getProviderData(value) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/provider/getProviderData?npiNumber=${value}`,
    options
  );
  return data;
}

export async function getCommentList(patientId, yearData) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/comment?patientId=${patientId}&processedYear=${
      yearData?.processedYear || ""
    }&dateOfService=${yearData?.dateOfService || ""}`,
    options
  );
  return data;
}

export async function editDisease(obj) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`aiservice/disease/editdisease`, options);
  return data;
}

export async function flagDetailsPost(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/flagdetails`, options);
  return data;
}

export async function movementApiCall(obj, apiUrl) {
  const options = {
    method: "PUT",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(apiUrl, options);
  return data;
}

export async function getPageNumber(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/pageNumber`, options);
  return data;
}

export async function getPageNumberLatest(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`dbservice/pageNumber`, options);
  return data;
}

export async function getNotesLists(patientId, yearData) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/notes?patientId=${patientId}&processedYear=${
      yearData?.processedYear ? yearData?.processedYear : ""
    }&dateOfService=${yearData?.dateOfService ? yearData?.dateOfService : ""}`,
    options
  );
  return data;
}

export async function overallStatusUpdate(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `dbservice/patient/status/overallstatus`,
    options
  );
  return data;
}

export async function overallYearStatus(obj, url) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(url, options);
  return data;
}

export async function uploadRadiologyFile({ data }) {
  const options = {
    method: "POST",
    body: data,
  };
  const res = await requestPortalFiles(
    `aiservice/ai/upload/radiology`,
    options
  );
  return res;
}

export async function uploadLabFile({ data }) {
  const options = {
    method: "POST",
    body: data,
  };
  const res = await requestPortalFiles(`aiservice/ai/upload/lab`, options);
  return res;
}

export const submitMeatQuery = async (data) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(
    `dbservice/meatquery/storequery`,
    options
  );
  return response;
};

export const updateMeatQuery = async (data) => {
  const options = {
    method: "PUT",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(
    `dbservice/meatquery/updateQueryComment`,
    options
  );
  return response;
};

export const patientListFilter = async (
  userId,
  status,
  searchText,
  startDate,
  endDate,
  processedStart,
  processedEnd,
  pageNo
) => {
  const options = {
    method: "GET",
  };
  const response = await requestPortal(
    `dbservice/patient/filter?patientAllocated=${userId}&page=${pageNo}&size=${15}&processedStatus=${status}&dueDateStart=${startDate}&dueDateEnd=${endDate}&processedStart=${processedStart}&processedEnd=${processedEnd}&searchString=${searchText}`,
    options
  );
  return response;
};
export const manuallyAddComboCode = async (data) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const response = await requestPortal(
    `dbservice/patient/compute/combo/manuallyAdded`,
    options
  );

  return response;
};

export async function getFlagCharts({dos}) {
  const patientId = getStorage("patientId")
  const options = {
    method: "GET"
  };
  const data = await requestPortal(
    `dbservice/flagdetails/getcount?patientId=${patientId}&yearOfService=${dos}`,
    options
  );
  return data;
}
export async function getRevertDetails({dos}) {
  const patientId = getStorage("patientId")
  const options = {
    method: "GET"
  };
  const data = await requestPortal(
    `dbservice/actioneventaudit/revert-history?patientid=${patientId}&dateOfService=${dos?dos:""}`,
    options
  );
  return data;
}

export const confirmRevert = async ({dos,year,versionHistory}) => {
  const patientId = getStorage("patientId")
  const options = {
    method: "PUT",
  };
  const response = await requestPortal(
    `/management/disease/revert?patientId=${patientId}&dateOfService=${dos}&processedYear=${year}&versionHistory=${versionHistory}`,
    options
  );

  return response;
};