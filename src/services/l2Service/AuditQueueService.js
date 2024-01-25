import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const PatientsList = async (page, url) => {
  var uId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `
       ${ENDPOINTS?.apiEndoint}dbservice/patient/filter?userId=${uId}&page=${page}&size=10&${url}`,
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

export const SearchPatientsList = async (pagenum, search) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `
       ${ENDPOINTS?.apiEndoint}dbservice/patient/compute/search?pageno=${pagenum}&searchtext=${search}&pagesize=12`,
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
export const ChangePriority = async (patientId, year, priority) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${ENDPOINTS?.apiEndoint}dbservice/change/priority?patietnId=${patientId}&year=${year}&priority=${priority}`,
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
    throw err; 
  }
};


export const GetWorkListFilters = async (
    pageNo,
    computationStart = "",
    computationEnd = "",
    status,
    search = "",
    completedStartDate,
    completedEndDate,
    pageSize = 15,
    sortfield = "",
    sortdirection = ""
  ) => {
    const token = localStorage.getItem("token");
    const uId = localStorage.getItem("userId");
  
    const filteredStatus =
    status === undefined
      ? "":status;
    try {
      const response = await axios.get(
        `${ENDPOINTS?.apiEndoint}dbservice/auditor/patient/workqueue/filter?&page=${pageNo}&size=${pageSize}&auditedStatus=${filteredStatus}&auditDueDateStart=${computationStart}&auditDueDateEnd=${computationEnd}&auditedDateStart=${completedStartDate}&auditedDateEnd=${completedEndDate}&searchString=${search}&sortfield=${sortfield}&sortdirection=${sortdirection}`,
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

export const getFilePageNumber = async (fileId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/pageNumber/startAndStopPageNo?fileId=${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const getMeatQueryList = async (dos,patientId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/meatquery/getMeatQueryList?dosYear=${dos}&patientId=${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const submitMeatQuery = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${ENDPOINTS?.apiEndoint}dbservice/meatquery/storequery`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const updateMeatQuery = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${ENDPOINTS?.apiEndoint}dbservice/meatquery/updateQueryComment`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

