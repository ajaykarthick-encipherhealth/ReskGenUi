import { checkAutoLogin } from "../../stores/authflow/actions";
import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";
import { getStorage } from "../../utils/storages";

export const patientDetails = async (
  pagenum,
  startDate = "",
  endDate = "",
  search,
  filter,
  sort
) => {
  const token = getStorage("token");
  const orgId = getStorage("orgId");

  const searchValue = filter === "ALL" ? "" : filter;
  const sortField = sort?.sortField === "undefined" ? "" : sort?.sortField;
  const sortDirection = sort?.sortDir === "undefined" ? "" : sort?.sortDir;

  const url = `dbservice/patient/auditor/assinedreport?pageno=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&status=${searchValue}&searchstring=${search}&orgid=${orgId}&sortfield=${sortField}&sortdirection=${sortDirection}`;

  try {
    const response = await axios.get(`${ENDPOINTS?.apiEndoint}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const TeamReport = async (
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort
) => {
  const token = getStorage("token");
  const orgId = getStorage("orgId");
  const url = `dbservice/patient/auditorreport?pageno=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&orgid=${orgId}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}`;

  try {
    const response = await axios.get(`${ENDPOINTS?.apiEndoint}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const AuditSentReport = async (
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort
) => {
  const token = getStorage("token");

  const url = `dbservice/reportdetails/sent?pageNo=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}`;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}${url}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const AuditReceivedReport = async (
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort
) => {
  const token = getStorage("token");
  const sortField = sort?.sortField === "undefined" ? "" : sort?.sortField;
  const sortDirection = sort?.sortDir === "undefined" ? "" : sort?.sortDir;
  const url = `dbservice/reportdetails/received?pageNo=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sortField}&sortdirection=${sortDirection}`;

  try {
    const response = await axios.get(`${ENDPOINTS?.apiEndoint}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const GetSelectedReport = async (reportId, reportInfo) => {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/reportdetails/get?reportId=${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const exportData = (data) => {
  const token = getStorage("token");
  return axios.post(
    `${ENDPOINTS?.apiEndoint}management/patient/report/export`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const usersList = (id, search) => {
  const token = getStorage("token");
  return axios.get(
    `${ENDPOINTS?.apiEndoint}dbservice/user/getUsersByOrgIdAndTenantId?orgid=${id}&searchString=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getFile = (pathname) => {
  const token = getStorage("token");
  return axios.get(
    `${ENDPOINTS?.apiEndoint}management/patient/report/getfile?blobName=${pathname}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
