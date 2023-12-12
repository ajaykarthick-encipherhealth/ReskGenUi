import axios from "axios";
import ENDPOINTS from "../utility/enpoints";

export const patientDetails = async (pagenum,startDate,endDate,search) => {
  const token = localStorage.getItem("token");
  const url= search?`dbservice/patient/patientdetailsl1?pageno=${pagenum}&size=15&searchstring=${search}`:
  (startDate && endDate) ?`dbservice/patient/patientdetailsl1?pageno=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}`:`dbservice/patient/patientdetailsl1?pageno=${pagenum}&size=15`
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}${url}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const SentReport = async (pagenum,startDate,endDate,search) => {
  const token = localStorage.getItem("token");
  const url= search?`dbservice/reportdetails/sent?pageNo=${pagenum}&size=15&searchstring=${search}`:
  (startDate && endDate) ?`dbservice/reportdetails/sent?pageNo=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}`:`dbservice/reportdetails/sent?pageNo=${pagenum}&size=15`
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
export const ReceivedReport = async (pagenum,startDate,endDate,search) => {
  const token = localStorage.getItem("token");
  const url= search?`dbservice/reportdetails/received?pageNo=${pagenum}&size=15&searchstring=${search}`:
  (startDate && endDate) ?`dbservice/reportdetails/received?pageNo=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}`:`dbservice/reportdetails/received?pageNo=${pagenum}&size=15`
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

export const getFile=(pathname)=>{
  const token = localStorage.getItem("token");
  return axios.get(
    `${ENDPOINTS?.apiEndoint}management/patient/report/getfile?blobName=${pathname}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}


