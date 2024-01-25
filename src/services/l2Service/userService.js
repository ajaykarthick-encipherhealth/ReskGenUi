import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const l2Users= async(page,search)=>{
    const token = localStorage.getItem("token");
    const orgId=localStorage.getItem("orgId")
    try {
      const response = await axios.get(
        `${ENDPOINTS?.apiEndoint}dbservice/user/getuserbymanageridbypage?orgid=${orgId}&searchstring=${search}&page=${page}&size=15`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err)
    }
  }

  export const L2IndividualUser= async(page,search)=>{
    const token = localStorage.getItem("token");
    const orgId=localStorage.getItem("orgId")
    try {
      const response = await axios.get(
        `${ENDPOINTS?.apiEndoint}dbservice/user/getuserbymanageridbypage?orgid=${orgId}&searchstring=${search}&page=${page}&size=15`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err)
    }
  }