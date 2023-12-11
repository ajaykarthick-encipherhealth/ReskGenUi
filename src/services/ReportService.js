import axios from "axios";
import ENDPOINTS from "../utility/enpoints";

export const patientDetails = async (pagenum) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}dbservice/patient/patientdetailsl1?pageno=${pagenum}&size=10`,
      {},
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
export const SentReport = async (pagenum) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/reportdetails/sent?pageNo=${pagenum}&size=10`,
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
export const ReceivedReport = async (pagenum) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/reportdetails/received?pageNo=${pagenum}&size=10`,
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
export const GetSelectedReport = async (reportId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/reportdetails/get?reportId=d4b1fc8d-40ba-4aea-8be7-132dd4f1b3db`,
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

export const exportData=(data)=>{
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
}

export const usersList=(id,search)=>{
  const token = localStorage.getItem("token");
  return axios.get(
    `${ENDPOINTS?.apiEndoint}dbservice/user/getUsersByOrgIdAndSearchString?orgid=${id}&searchString=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

