import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";
import { getStorage } from "../../utils/storages";

// export const PatientsList = async (page, url) => {
//   var uId = getStorage("userId");
//   const token = getStorage("token");
//   try {
//     const response = await axios.get(
//       `
//        ${ENDPOINTS?.apiEndoint}dbservice/patient/filter?userId=${uId}&page=${page}&size=10&${url}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const SearchPatientsList = async (pagenum, search) => {
//   const token = getStorage("token");
//   try {
//     const response = await axios.get(
//       `
//        ${ENDPOINTS?.apiEndoint}dbservice/patient/compute/search?pageno=${pagenum}&searchtext=${search}&pagesize=12`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const ChangePriority = async (patientId, year, priority) => {
//   const token = getStorage("token");
//   try {
//     const response = await axios.put(
//       `${ENDPOINTS?.apiEndoint}dbservice/change/priority?patientId=${patientId}&year=${year}&priority=${priority}`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (err) {
//     console.log(err);
//     throw err; 
//   }
// };


// export const GetWorkListFilters = async (
//     datas
//   ) => {
//     const token = getStorage("token");
//     try {
//       const response = await axios.get(
//         `${ENDPOINTS?.apiEndoint}dbservice/auditor/patient/workqueue/filter?&page=${datas?.pageNo}&size=15&auditedStatus=${datas?.selectedOption}&auditDueDateStart=${datas?.computedStartDate}&auditDueDateEnd=${datas?.computedEndDate}&auditedDateStart=${datas?.completedStartDate}&auditedDateEnd=${datas?.completedEndDate}&searchString=${datas?.search}&sortField=${datas?.sort?.sortField}&sortdirection=${datas?.sort?.sortDir}&patientAllocated=${datas?.selCreatedBy}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (err) {
//       console.log(err);
//     }
//   };

export const getFilePageNumber = async (fileId) => {
  const token = getStorage("token");
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
  const token = getStorage("token");
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
  const token = getStorage("token");
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
  const token = getStorage("token");
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

