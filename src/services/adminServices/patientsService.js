import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const PatientsList = async (pageNo,computationStart,computationEnd,status,search) => {
    const token = localStorage.getItem("token");
    const uId = localStorage.getItem("userId");
    console.log(status)
    const filteredStatus= status===undefined?"":status
    try {
      const response = await axios.get(
        `  ${ENDPOINTS?.apiEndoint}dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&isAllocation=false&computationStart=${computationStart}&computationEnd=${computationEnd}&status=${filteredStatus}&searchString=${search}`,
        // https://hcc.encipherhealth.com/secure/dbservice/patient/admin/computation/filter?page=0&size=15&userId=henry%40encipherhealth.onmicrosoft.com&isAllocation=false&searchString=10032&computationStart=2024-01-05T00%3A00%3A00.000Z&computationEnd=2024-01-06T00%3A00%3A00.000Z&status=0
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

  export const TrackingList = async (url) => {
    const token = localStorage.getItem("token");
    const uId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `  ${ENDPOINTS?.apiEndoint}${url}`,
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

  // export const PatientsList = async (page, url) => {
  //   var uId = localStorage.getItem("userId");
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axios.get(
  //       `
  //        ${ENDPOINTS?.apiEndoint}dbservice/patient/admin/computation/filter?page=${page}&size=10&userId=${uId}&isAllocation=false`,
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