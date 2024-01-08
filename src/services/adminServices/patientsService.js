import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const PatientsList = async (pageNo) => {
    const token = localStorage.getItem("token");
    const uId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `  ${ENDPOINTS?.apiEndoint}dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&isAllocation=false`,
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