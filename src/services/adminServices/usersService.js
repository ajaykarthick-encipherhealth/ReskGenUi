import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const UsersList = async ({
  pageCount,
  search,
  startDate,
  endDate,
  status,
  role,
}) => {
  const token = localStorage.getItem("token");
  const selectedStatus=status==='ALL'?"":status
  try {
    const response = await axios.get(
      ` ${ENDPOINTS?.apiEndoint}dbservice/user/admin/filter?page=${pageCount}&size=15&searchString=${search}&compuationStart=${startDate}&compuatationEnd=${endDate}&isEnabled=${selectedStatus}&role=${role}`,
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

export const AddUser = async ( {data }) => {
  const token = localStorage.getItem("token");
  console.log("hg",data)
  try {
    const response = await axios.post(
      ` ${ENDPOINTS?.apiEndoint}securityservice/admin/getusers/createuser`,
      { data },

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
