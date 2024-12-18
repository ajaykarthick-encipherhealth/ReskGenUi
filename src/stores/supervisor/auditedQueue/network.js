import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function PatientsList({ page, url }) {
  const options = {
    method: "GET",
  };
  var uId = getStorage("userId");
  const data = await requestPortal(
    `dbservice/patient/filter?userId=${uId}&page=${page}&size=10&${url}`,
    options
  );
  return data;
}

export async function SearchPatientsList({ pagenum, search }) {
  const options = {
    method: "GET",
  };
  const filteredStatus =
    data?.selectedOption === undefined
      ? ""
      : data?.completedStartDate && data?.completedEndDate
      ? "COMPLETED"
      : data?.selectedOption;

  const res = await requestPortal(
    `dbservice/patient/compute/search?pageno=${pagenum}&searchtext=${search}&pagesize=12
     `,
    options
  );
  return res;
}

export async function ChangePriority({ patientId, year, priority }) {
  const options = {
    method: "PUT",
  };
  const data = await requestPortal(
    `dbservice/change/priority?patientId=${patientId}&year=${year}&priority=${priority}`,
    options
  );
  return data;
}

export async function GetWorkListFilters({ data }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/auditor/patient/workqueue/filter?&page=${data?.pageNo}&size=15&auditedStatus=${data?.selectedOption}&auditDueDateStart=${data?.auditDueDateStart}&auditDueDateEnd=${data?.auditDueDateEnd}&auditedDateStart=${data?.auditDateStart}&auditedDateEnd=${data?.auditDateEnd}&searchString=${data?.search}&sortField=${data?.sort?.sortField}&sortdirection=${data?.sort?.sortDir}&patientAllocated=${data?.selCreatedBy}`,
    options
  );
  return res;
}

export async function filterUsers({field, username, pageQueue}) {
  const options = {
    method: "GET",
  };
  const role = getStorage("userRole");
  const userRole = role?.toUpperCase();
  const customPage =
    field === "patientAllocated" && role === "supervisor"
      ? "auditedqueue"
      : pageQueue;
  const url = username
    ? `dbservice/patient/filter/field/list?username=${username}&field=${field}&role=${userRole}`
    : `dbservice/patient/filter/field/list?field=${field}&role=${userRole}&page=${
        customPage ? customPage : 0
      }`;      
  const data = await requestPortal(url,
    options
  );
  return data;
}
