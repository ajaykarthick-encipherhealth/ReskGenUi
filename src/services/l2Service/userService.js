import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";
import { getStorage } from "../../utils/storages";

export const l2Users = async (page, search) => {
  const token = getStorage("token");
  const orgId = getStorage("orgId");
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
    console.log(err);
  }
};

export const L2IndividualUser = async (datas) => {
  const token = getStorage("token");
  const filteredStatus =
    datas?.selectedOption === undefined
      ? ""
      : datas?.completedStartDate && datas?.completedEndDate
      ? "COMPLETED"
      : datas?.selectedOption;

  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/auditor/patient/filter?page=${datas?.pageNo}&size=15&userId=${datas?.uId}&isAllocation=false&processedStatus=${filteredStatus}&auditedStatus=${datas?.selectedAuditOption}&searchString=${datas?.search}&processedStart=${datas?.completedStartDate}&processedEnd=${datas?.completedEndDate}&auditedDateStart=${datas?.aduitCompletedStartDate}&auditedDateEnd=${datas?.aduitCompletedEndDate}&dueDateStart=${datas?.dueStartDate}&dueDateEnd=${datas?.dueEndDate}&auditDueDateStart=${datas?.aduitDueStartDate}&auditDueDateEnd=${datas?.aduitDueEndDate}&allocatedBy=${datas?.selAllocatedBy}&auditAllocatedBy=${datas?.selAuditAllocatedBy}&auditDueDateStart=${datas?.auditedStartDate}&auditDueDateEnd=${datas?.auditedEndDate}&allocatedOnStart=${datas?.allocatedStartDate}&allocatedOnEnd=${datas?.allocatedEndDate}&sortfield=${datas?.sort?.sortField}&sortdirection=${datas?.sort?.sortDir}
     `,
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
export const CurrentUserInfo = async (userId, router) => {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/user/get?userName=${userId}`,

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