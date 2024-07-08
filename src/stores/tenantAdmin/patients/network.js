import { requestPortal } from "../../../utils/network";

export async function getAllOrganization() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/tenant/getall/organization`,
    options
  );
  return data;
}

export async function getAllPatient(
  pageNo,
  computationStart = "",
  computationEnd = "",
  status,
  search = "",
  createdStartDate,
  createdEndDate,
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy,
  sort,
  orgId
) {
  const options = {
    method: "GET",
  };
  const uId = localStorage.getItem("userId");
  const filteredStatus = status === undefined ? "" : status;
  const selectOrgId = orgId === "ALL" || orgId == undefined ? "" : orgId;
  const data = await requestPortal(
    `dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&organizationId=${selectOrgId}&isAllocation=false&computationStart=${computationStart}&computationEnd=${computationEnd}&status=${filteredStatus}&searchString=${search}&createdStartDate=${createdStartDate}&createdEndDate=${createdEndDate}&patientCreatedBy=${
      selAllocatedBy === "All" ? "" : selAllocatedBy
    }&patientAllocatedTo=${
      selAllocatedTo === "All" ? "" : selAllocatedTo
    }&patientAllocatedBy=${
      selCreatedBy === "All" ? "" : selCreatedBy
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }`,
    options
  );
  return data;
}
