import axios from "../utility/axiosConfig";
import ENDPOINTS from "../utility/enpoints";
import { getSentDetails } from "../store/actions/ReportActions";
import { getStorage } from "../utils/storages";

export const UPDATE_SENTREPORT = "UPDATE_SENTREPORT";

export const patientDetails = async (
  pagenum,
  startDate = "",
  endDate = "",
  search,
  filter = "",
  sort
) => {
  const token = getStorage("token");

  const searchValue = filter === "ALL" ? "" : filter;
  const url = `dbservice/patient/coderreport?pageno=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&status=${filter}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}`;

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
  const token = getStorage("token");
  const url = `dbservice/reportdetails/sent?pageNo=${pagenum}&size=8&startdate=${
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
  const token = getStorage("token");
  const url = `dbservice/reportdetails/received?pageNo=${pagenum}&size=8&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}`;
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
    `${ENDPOINTS?.apiEndoint}dbservice/user/getUsersForL1Report?orgid=${id}&searchString=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const usersLists = (id, search) => {
  const token = getStorage("token");
  return axios.get(
    `${ENDPOINTS?.apiEndoint}dbservice/user/getuser/report`,
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

export const updateSentReport = (data) => async (dispatch) => {
  const token = getStorage("token");
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
