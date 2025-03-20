import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function usersList({ page, search }) {
  const options = {
    method: "GET",
  };
  const orgId = getStorage("orgId");
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
    `dbservice/auditor/patient/filter?page=${data?.pageNo}&size=15&userId=${
      data?.uId
    }&isAllocation=false&processedStatus=${
      filteredStatus || ""
    }&auditedStatus=${data?.selectedAuditOption}&searchString=${
      data?.search
    }&processedStart=${data?.completedStartDate}&processedEnd=${
      data?.completedEndDate
    }&auditedDateStart=${data?.aduitCompletedStartDate}&auditedDateEnd=${
      data?.aduitCompletedEndDate
    }&dueDateStart=${data?.dueStartDate}&dueDateEnd=${
      data?.dueEndDate
    }&auditDueDateStart=${data?.aduitDueStartDate}&auditDueDateEnd=${
      data?.aduitDueEndDate
    }&allocatedBy=${data?.selAllocatedBy}&auditAllocatedBy=${
      data?.selAuditAllocatedBy
    }&auditDueDateStart=${data?.auditedStartDate}&auditDueDateEnd=${
      data?.auditedEndDate
    }&allocatedOnStart=${data?.allocatedStartDate}&allocatedOnEnd=${
      data?.allocatedEndDate
    }&sortfield=${data?.sort?.sortField}&sortdirection=${
      data?.sort?.sortDir
    }&priority=${data?.priority || ""}
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
export async function getWorkQueue({
  pageNo,
  selectedOption,
  sort,
  selectedDateRanges,
  searchText,
}) {
  const options = {
    method: "GET",
  };
  const userId = getStorage("user")
  const res = await requestPortal(
    `dbservice/auditor/patient/filter?&page=${
      pageNo ? pageNo : 0
    }&userId=${
      userId
    }&size=15&dueDateStart=${
      selectedDateRanges?.dueDate?.startDate
        ? selectedDateRanges?.dueDate?.startDate
        : ""
    }&dueDateEnd=${
      selectedDateRanges?.dueDate?.endDate
        ? selectedDateRanges?.dueDate?.endDate
        : ""
    }&processedStart=${
      selectedDateRanges?.completedDate?.startDate
        ? selectedDateRanges?.completedDate?.startDate
        : ""
    }&processedeEnd=${
      selectedDateRanges?.completedDate?.endDate
        ? selectedDateRanges?.completedDate?.endDate
        : ""
    }&processedStatus=${
      selectedOption?.Status ? selectedOption?.Status : ""
    }&auditedStatus=${
      selectedOption?.auditedStatus ? selectedOption?.auditedStatus : ""
    }&batchId=${selectedOption?.batch || ""}&auditDueDateStart=${
      selectedDateRanges?.auditDueDate?.startDate
        ? selectedDateRanges?.auditDueDate?.startDate
        : ""
    }&auditDueDateEnd=${
      selectedDateRanges?.auditDueDate?.endDate
        ? selectedDateRanges?.auditDueDate?.endDate
        : ""
    }&auditedDateStart=${
      selectedDateRanges?.auditCompletedDate?.startDate
        ? selectedDateRanges?.auditCompletedDate?.startDate
        : ""
    }&auditedDateEnd=${
      selectedDateRanges?.auditCompletedDate?.endDate
        ? selectedDateRanges?.auditCompletedDate?.endDate
        : ""
    }&searchString=${searchText ? searchText : ""}&sortField=${
      sort?.sortField ? sort?.sortField : ""
    }&sortdirection=${sort?.sortDir ? sort?.sortDir : ""}&auditAllocatedBy=${
      selectedOption?.auditAlloactedBy ? selectedOption?.auditAlloactedBy : ""
    }&priority=${selectedOption?.Priority ? selectedOption?.Priority : ""}`,
    options
  );
  return res;
}
