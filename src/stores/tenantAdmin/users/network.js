import { notification } from "antd";
import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

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
    `dbservice/user/admin/filter?page=${pageCount}&size=15&searchString=${
      search ? search : ""
    }&organizationId=${selectOrgId ? selectOrgId : ""}&createdDateStart=${
      startDate ? startDate : ""
    }&createdDateEnd=${endDate ? endDate : ""}&isEnabled=${
      selectedStatus ? selectedStatus : ""
    }&role=${role ? role : ""}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}`,
    options
  );
  return data;
}

export const AddUser = async (data, setFormData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

    const response = await requestPortal(
      `securityservice/admin/getusers/createuser`,
      options
    );  
      return response;
};

export async function addPatient({ data }) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(`dbservice/patient`, options);
  return res;
}

export const enableUser = async ({
  checked,
  user,
  role,
  setPopoverVisible,
  selectedManager,
  field
}) => {
  var tenId = getStorage("tenantId");
  var orgId = getStorage("orgId");
  const checkedVal = checked === "yes" ? true : false;
  const data = {
    orgId: orgId,
    tenantId: tenId,
    userId: user?.userId,
    userName: user?.userName,
    managerId: selectedManager,
  };
  const info = role
    ? { ...data, role: role }
    : checked
    ? { ...data, accountEnabled: checkedVal }
    : data;

  const options = {
    method: "PUT",
    body: JSON.stringify(info),
  };
  if (
    (field && role && user !== undefined) ||
    (checked !== undefined && checked !== null && user !== undefined)
  ) {
    try {
      const response = await requestPortal(
        `management/admin/updateuser`,
        options
      );
      if (response?.status==='SUCCESS') {
        notification.success({
          description: `${response?.response?.message} `,
        });
      }
      return response
    } catch (err) {
      console.log(err);
    }
  }
};
