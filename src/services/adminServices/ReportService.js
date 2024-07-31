import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";
import { getSentDetails } from "../../store/actions/adminAction/ReportActions";

export const UPDATE_SENTREPORT = "UPDATE_SENTREPORT";
export const patientDetails = async ({
  pagenum = "",
  startDate = "",
  endDate = "",
  search = "",
  filter = "",
  userName = "",
  sort = "",
  selectManager = "",
  size = "",
  flagsList = "",
  allPatientIds = false,
}) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  const role = localStorage.getItem("role");
  const searchValue = filter === "ALL" ? "" : filter;
  const url = `dbservice/patient/adminreport?pageno=${pagenum}&size=${
    size ? size : 7
  }&startdate=${startDate}&enddate=${endDate}&status=${searchValue}&searchstring=${search}&sortfield=${
    sort?.sortField ? sort?.sortField : ""
  }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&username=${
    userName === "REVIEWER" ? selectManager : ""
  }&managerid=${userName === "SUPERVISOR" ? selectManager : ""}&orgid=${
    role == "tenant_admin" ? "" : orgId
  }&patientIds=${flagsList ? flagsList : ""}&allPatientIds=${allPatientIds}`;

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
export const SentReport = async (
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort
) => {
  const token = localStorage.getItem("token");

  const url = `dbservice/reportdetails/sent?pageNo=${pagenum}&size=7&startdate=${
    startDate ? startDate : ""
  }&enddate=${endDate ? endDate : ""}&searchstring=${
    search ? search : ""
  }&sortfield=${sort?.sortField ? sort?.sortField : ""}&sortdirection=${
    sort?.sortDir ? sort?.sortDir : ""
  }`;
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
export const ReceivedReport = async (
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort
) => {
  const token = localStorage.getItem("token");
  const url = `dbservice/reportdetails/received?pageNo=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}`;
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
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
  return axios.get(
    `${ENDPOINTS?.apiEndoint}management/patient/report/getfile?blobName=${pathname}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const SelectUserList = async (role) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/user/getByRole?role=${role}&orgId=${orgId}`,
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

export const updateSentReport = (data) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    dispatch({
      type: UPDATE_SENTREPORT,
      payload: {
        loading: true,
        data: null,
      },
    });
    const response = await axios.post(
      `${ENDPOINTS.apiEndoint}dbservice/reportdetails/updatereportstatus`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response?.data) {
      dispatch({
        type: UPDATE_SENTREPORT,
        payload: {
          loading: false,
          data: response.data,
        },
      });
      dispatch(getSentDetails(0));
    }
  } catch (err) {
    console.log(err);
  }
};
