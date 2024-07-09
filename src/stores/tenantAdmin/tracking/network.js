import { requestPortal } from "../../../utils/network";

export async function getAllTracking(data) {
  const uId = localStorage.getItem("userId");
  const options = {
    method: "GET",
  };
  const filteredStatus =
    data?.selectedOption === undefined ? "" : data?.selectedOption;
  const filteredDStart =
    data?.dueDateStart === undefined ? "" : data?.dueDateStart;

  const res = await requestPortal(
    `dbservice/patient/admin/filter?userId=${uId}&organizationId=${
      data?.selectOrgId
    }&page=${
      data?.pageNo
    }&size=15&processedStatus=${filteredStatus}&processedStart=${filteredDStart}&processedEnd=${
      data?.dueDateEnd
    }&searchString=${data?.searchTextValue}&patientAllocated=${
      data?.selAllocatedTo === "All" ? "" : data?.selAllocatedTo
    }&auditAllocatedStart=${data?.allocatedStartDate}&auditAllocatedEnd=${
      data?.allocatedEndDate
    }&allocatedOnStart=${data?.auditedStartDate}&allocatedOnEnd=${
      data?.auditedEndDate
    }&allocatedBy=${data?.selAllocatedBy}&auditedStartDate=${
      data?.auditedDueStartDate
    }&auditedEndDate=${data?.auditedDueEndDate}&auditedStatus=${
      data?.auditSelectedOption ? data?.auditSelectedOption : ""
    }&auditAllocatedBy=${
      data?.selAuditAllocatedBy ? data?.selAuditAllocatedBy : ""
    }&auditedAssigned=${
      data?.auditSelAllocatedTo ? data?.auditSelAllocatedTo : ""
    }&sortfield=${
      data?.sort?.sortField ? data?.sort?.sortField : ""
    }&sortdirection=${data?.sort?.sortDir ? data?.sort?.sortDir : ""}`,
    options
  );
  return res;
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
