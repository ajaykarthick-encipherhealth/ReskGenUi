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

export const L2IndividualUser = async (
  uId,
  pageNo,
  search,
  selectedOption,
  selAllocatedBy,
  dueStartDate,
  dueEndDate,
  completedStartDate,
  completedEndDate,
  auditedStartDate,
  auditedEndDate,
  allocatedStartDate,
  allocatedEndDate,
  allocatedDateOrder,
  dueDateOrder,
  completedDateOrder,
  auditedDateOrder
) => {
  const token = localStorage.getItem("token");
  const filteredStatus =
    selectedOption === undefined
      ? ""
      : completedStartDate && completedEndDate
      ? 2
      : selectedOption;
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/auditor/patient/filter?page=${pageNo}&size=15&userId=${uId}&isAllocation=false&computing=${filteredStatus}&searchString=${search}&completedStartDate=${completedStartDate}&completedEndDate=${completedEndDate}&dueDateStart=${dueStartDate}&dueDateEnd=${dueEndDate}&auditAllocatedBy=${selAllocatedBy}&auditDueDateStart=${auditedStartDate}&auditDueDateEnd=${auditedEndDate}&allocatedStartDate=${allocatedStartDate}&allocatedEndDate=${allocatedEndDate}
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
