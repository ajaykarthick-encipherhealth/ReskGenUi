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
  pageNo,
  searchText,
  selectedDateRanges,
  selectedOption,
  sort,
  role,
}) {
  const options = {
    method: "GET",
  };

  const data = await requestPortal(
    `dbservice/user/admin/filter?page=${pageNo || 0}&size=15&searchString=${
      searchText ? searchText : ""
    }&organizationId=${
      selectedOption?.organization ? selectedOption?.organization : ""
    }&createdDateStart=${
      selectedDateRanges?.createdDateRange?.startDate || ""
    }&createdDateEnd=${selectedDateRanges?.createdDateRange?.endDate || ""}&isEnabled=${
      selectedOption?.status || ""
    }&role=${selectedOption?.role || ""}&sortdirection=${
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

getAllUser
export const enableUser = async ({
  checked,
  user,
  role,
  setPopoverVisible,
  selectedManager,
  field,
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
      if (response?.status === "SUCCESS") {
        notification.success({
          description: `${response?.response?.message} `,
        });
      }
      return response;
    } catch (err) {
      console.log(err);
    }
  }
};

export async function getAllUser() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `/dbservice/mci/user/unassigned`,
    options
  );
  return data;
}

export const usersAssignedList = async ({ data }) => {
  const url = `dbservice/mci/user/assignuser`;
  const options = {
    method: "POST",
    body:JSON.stringify(data)
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};

export async function getUserRole() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `/dbservice/mci/user/getroles`,
    options
  );
  return data;
}


