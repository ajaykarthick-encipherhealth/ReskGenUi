import { requestPortal } from "../../../utils/network";

export async function usersList({ page, search }) {
  const options = {
    method: "GET",
  };
  const orgId = localStorage.getItem("orgId");
  const data = await requestPortal(
    `dbservice/user/getuserbymanageridbypage?orgid=${orgId}&searchstring=${search}&page=${page}&size=15`,
    options
  );
  return data;
}

export async function individualUsersList({ data }) {
  const options = {
    method: "GET",
  };
  const filteredStatus =
    data?.selectedOption === undefined
      ? ""
      : data?.completedStartDate && data?.completedEndDate
      ? "COMPLETED"
      : data?.selectedOption;

  const res = await requestPortal(
    `dbservice/auditor/patient/filter?page=${data?.pageNo}&size=15&userId=${data?.uId}&isAllocation=false&processedStatus=${filteredStatus}&auditedStatus=${data?.selectedAuditOption}&searchString=${data?.search}&processedStart=${data?.completedStartDate}&processedEnd=${data?.completedEndDate}&auditedDateStart=${data?.aduitCompletedStartDate}&auditedDateEnd=${data?.aduitCompletedEndDate}&dueDateStart=${data?.dueStartDate}&dueDateEnd=${data?.dueEndDate}&auditDueDateStart=${data?.aduitDueStartDate}&auditDueDateEnd=${data?.aduitDueEndDate}&allocatedBy=${data?.selAllocatedBy}&auditAllocatedBy=${data?.selAuditAllocatedBy}&auditDueDateStart=${data?.auditedStartDate}&auditDueDateEnd=${data?.auditedEndDate}&allocatedOnStart=${data?.allocatedStartDate}&allocatedOnEnd=${data?.allocatedEndDate}&sortfield=${data?.sort?.sortField}&sortdirection=${data?.sort?.sortDir}
     `,
    options
  );
  return res;
}
export async function CurrentUserInfo({ userId }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/get?userName=${userId}`,
    options
  );
  return data;
}
