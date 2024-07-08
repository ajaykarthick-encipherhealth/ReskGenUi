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

export async function getallUsers({
  pageCount = 0,
  search = "",
  startDate = "",
  endDate = "",
  status = "",
  role = "",
  sort,
  orgId = "",
}) {
  const options = {
    method: "GET",
  };
  const selectedStatus = status === "ALL" ? "" : status;
  const selectOrgId = orgId === "ALL" ? "" : orgId;

  const data = await requestPortal(
    `dbservice/user/admin/filter?page=${pageCount}&size=15&searchString=${search}&organizationId=${selectOrgId}&createdDateStart=${startDate}&createdDateEnd=${endDate}&isEnabled=${selectedStatus}&role=${role}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}`,
    options
  );
  return data;
}