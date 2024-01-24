import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const l2Users= async({pageCount, orgId, search})=>{
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${ENDPOINTS?.apiEndoint}dbservice/user/getuserbymanagerid?orgid=${orgId}&page=${pageCount}&size=15&serachString=${search}`,
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