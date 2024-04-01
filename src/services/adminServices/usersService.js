import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";
import { notification } from "antd";
import { ENABLE, getUsers } from "../../store/actions/adminAction/usersAction";

export const UsersList = async ({
  pageCount = 0,
  search = "",
  startDate = "",
  endDate = "",
  status = "",
  role = "",
  sort,
}) => {
  const token = localStorage.getItem("token");
  const selectedStatus = status === "ALL" ? "" : status;
  try {
    const response = await axios.get(
      ` ${
        ENDPOINTS?.apiEndoint
      }dbservice/user/admin/filter?page=${pageCount}&size=15&searchString=${search}&createdDateStart=${startDate}&createdDateEnd=${endDate}&isEnabled=${selectedStatus}&role=${role}&sortdirection=${
        sort?.sortDir ? sort?.sortDir : ""
      }&sortfield=${sort?.sortField ? sort?.sortField : ""}`,
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

export const AddUser = async (data, setErrors) => {
  const token = localStorage.getItem("token");
  delete data?.confirmPassword;
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
    if (response) {
      if (response?.data?.status === "SUCCESS") {
        setErrors({
          email: "",
          password: "",
          confirmPass: "",
        });
        notification.success({
          message: response?.data?.message,
          duration: 1,
        });
      } else {
        setErrors({
          email: "",
          password: "",
          confirmPass: "",
        });
        notification.warning({
          message: response?.data?.message,
          duration: 1,
        });
      }
      return response;
    }
  } catch (err) {
    setErrors({
      email: "",
      password: "",
      confirmPass: "",
    });
    notification.error({ description: err?.response?.data?.message });
  }
};

export const enableUser = (
  checked,
  user,
  role,
  setPopoverVisible,
  selectedManager,
  field
) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    var tenId = localStorage.getItem("tenantId");
    var orgId = localStorage.getItem("orgId");
    const checkedVal = checked === "yes" ? true : false;
    const data = {
      orgId: orgId,
      tenantId: tenId,
      userId: user?.userId,
      userName: user?.userName,
      managerId: selectedManager,
    };

    const datas = role
      ? { ...data, role: role }
      : checked
      ? { ...data, accountEnabled: checkedVal }
      : data;
    if (
      (field && role && user !== undefined) ||
      (checked !== undefined && checked !== null && user !== undefined)
    ) {
      try {
        const response = await axios.put(
          `${ENDPOINTS?.apiEndoint}management/admin/updateuser`,
          datas,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data) {
          dispatch({
            type: ENABLE,
            payload: response.data,
          });
          notification.success({
            description: `${user?.firstName} ${user?.lastName} has ${response.data.response.message} `,
          });
          dispatch(getUsers(0));
          if (setPopoverVisible) {
            setPopoverVisible(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
};
