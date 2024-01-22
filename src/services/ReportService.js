import axios from "axios";
import ENDPOINTS from "../utility/enpoints";

export const patientDetails = async (pagenum,startDate="",endDate="",search,filter="") => {
  const token = localStorage.getItem("token");

  const searchValue = filter === "ALL" ? "" : filter
 const url=`dbservice/patient/coderreport?pageno=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}&status=${searchValue}&searchstring=${search}`

  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}${url}`,
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
export const SentReport = async (pagenum,startDate="",endDate="",search) => {
  const token = localStorage.getItem("token");
 
  const url= `dbservice/reportdetails/sent?pageNo=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}&searchstring=${search}`
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
export const ReceivedReport = async (pagenum,startDate="",endDate="",search,sortfield,sortdirection) => {
  const token = localStorage.getItem("token");
  const url= `dbservice/reportdetails/received?pageNo=${pagenum}&size=15&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sortfield}&sortdirection=${sortdirection}`
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
export const GetSelectedReport = async (reportId,reportInfo) => {
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
    `${ENDPOINTS?.apiEndoint}dbservice/user/getUsersByOrgIdAndTenantId?orgid=${id}&searchString=${search}`,
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


