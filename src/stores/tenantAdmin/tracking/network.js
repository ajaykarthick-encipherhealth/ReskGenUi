import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function getAllTracking(data) {
  const uId = getStorage("userId");
  const options = {
    method: "GET",
  };
  // const filteredStatus =
  //   data?.selectedOption === undefined ? "" : data?.selectedOption;
  // const filteredDStart =
  //   data?.dueDateStart === undefined ? "" : data?.dueDateStart;

  const res = await requestPortal(
    `dbservice/patient/admin/filter?userId=${uId}&organizationId=${
      data?.selectOrgId
    }&page=${
      data?.pageNo
    }&size=15&processedStatus=${data?.selectedOption}&processedStart=${ data?.dueDateStart}&processedEnd=${
      data?.dueDateEnd
    }&searchString=${data?.searchTextValue}&patientAllocated=${
      data?.selAllocatedTo
    }&auditAllocatedStart=${data?.auditedStartDate}&auditAllocatedEnd=${
      data?.auditedEndDate
    }&allocatedOnStart=${data?.allocatedStartDate}&allocatedOnEnd=${
      data?.allocatedEndDate
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
    }&sortdirection=${data?.sort?.sortDir ? data?.sort?.sortDir : ""}&priority=${data?.priority}`,
    options
  );
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
