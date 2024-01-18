import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";
import { notification } from "antd";

export const UsersList = async ({
  pageCount = 0,
  search = "",
  startDate = "",
  endDate = "",
  status = "",
  role = "",
}) => {
  const token = localStorage.getItem("token");
  const selectedStatus = status === "ALL" ? "" : status;
  try {
    const response = await axios.get(
      ` ${ENDPOINTS?.apiEndoint}dbservice/user/admin/filter?page=${pageCount}&size=15&searchString=${search}&createdDateStart=${startDate}&createdDateEnd=${endDate}&isEnabled=${selectedStatus}&role=${role}`,
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

export const AddUser = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      ` ${ENDPOINTS?.apiEndoint}securityservice/admin/getusers/createuser`,
      data,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err?.response?.data?.message);
    notification.error({ description: err?.response?.data?.message });
  }
};

export const EnableUser = async (checked,userName,role) => {
  const token = localStorage.getItem("token");
  var tenId = localStorage.getItem("tenantId");
  var uId = localStorage.getItem("userId");
  var orgId = localStorage.getItem("orgId");

  const data={
    orgId: orgId,
    tenantId: tenId,
    userId: uId,
    accountEnabled:checked,
    userName:userName,
  }
  const datas=role? {...data,role:[role]}:data
  console.log(datas)
  try {
    const response = await axios.put(
      ` ${ENDPOINTS?.apiEndoint}/management/admin/updateuser`,
      datas,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (err) {
    notification.error({
      description: err?.response?.data?.message || "An error occurred.",
    });
  }
};
