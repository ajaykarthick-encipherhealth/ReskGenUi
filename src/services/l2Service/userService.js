import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const l2Users = async (page, search) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");
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
  const token = localStorage.getItem("token");
  const filteredStatus =
    datas?.selectedOption === undefined
      ? ""
      : datas?.completedStartDate && datas?.completedEndDate
      ? "COMPLETED"
      : datas?.selectedOption;
      
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/auditor/patient/filter?page=${datas?.pageNo}&size=15&userId=${datas?.uId}&isAllocation=false&processedStatus=${filteredStatus}&auditedStatus=${datas?.selectedAuditOption}&searchString=${datas?.search}&completedStartDate=${datas?.completedStartDate}&completedEndDate=${datas?.completedEndDate}&auditCompletedStartDate=${datas?.aduitCompletedStartDate}&auditCompletedEndDate=${datas?.aduitCompletedEndDate}&dueDateStart=${datas?.dueStartDate}&dueDateEnd=${datas?.dueEndDate}&auditDueDateStart=${datas?.aduitDueStartDate}&auditDueDateEnd=${datas?.aduitDueEndDate}&allocatedBy=${datas?.selAllocatedBy}&auditAllocatedBy=${datas?.selAuditAllocatedBy}&auditDueDateStart=${datas?.auditedStartDate}&auditDueDateEnd=${datas?.auditedEndDate}&allocatedStartDate=${datas?.allocatedStartDate}&allocatedEndDate=${datas?.allocatedEndDate}&sortfield=${datas?.sort?.sortField}&sortdirection=${datas?.sort?.sortDir}
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
