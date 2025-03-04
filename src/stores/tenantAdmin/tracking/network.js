import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function getAllTracking({
  pageNo,
  searchText,
  selectedOption,
  selectedDateRanges,
  sort,
}) {
  const uId = getStorage("userId");
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `dbservice/patient/admin/filter?userId=${uId}&organizationId=${
      selectedOption?.organization || ""
    }&page=${pageNo || 0}&size=15&processedStatus=${
      selectedOption?.processedStatus || ""
    }&processedStart=${
      selectedDateRanges?.reviewedDate?.startDate || ""
    }&processedEnd=${
      selectedDateRanges?.reviewedDate?.endDate || ""
    }&searchString=${searchText || ""}&patientAllocated=${
      selectedOption?.Reviewer || ""
    }&auditAllocatedStart=${
      selectedDateRanges?.auditAllocatedDate?.startDate || ""
    }&auditAllocatedEnd=${
      selectedDateRanges?.auditAllocatedDate?.endDate || ""
    }&allocatedOnStart=${
      selectedDateRanges?.allocatedDate?.startDate || ""
    }&allocatedOnEnd=${
      selectedDateRanges?.allocatedDate?.endDate || ""
    }&allocatedBy=${selectedOption?.allocatedBy || ""}&auditedStartDate=${
      selectedDateRanges?.auditedDate?.startDate || ""
    }&auditedEndDate=${
      selectedDateRanges?.auditedDate?.endDate || ""
    }&auditedStatus=${selectedOption?.auditStatus || ""}&auditAllocatedBy=${
      selectedOption?.auditAllocatedBy || ""
    }&auditedAssigned=${selectedOption?.supervisor || ""}&sortfield=${
      sort?.sortField ? sort?.sortField : ""
    }&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&priority=${selectedOption?.priority || ""}`,
    options
  );
  console.log(res,"res")
  return res;
}
export async function getCustomAllUsers() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/user/getuser/page`, options);
  return data;
}

export async function getAllFileProcess(
  searchstring = "",
  status = "",
  startdate = "",
  enddate = ""
) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/file-process/status`, options);
  return data;
}
