import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function patientsList({ url }) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");

  const data = await requestPortal(
    `dbservice/patient/filter?${url}
  `,
    options
  );
  return data;
}
export const flagsList = async () => {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/flag/getAllFlag
  `,
    options
  );
  return data;
};
export async function getAllReviewerPatients(
{pageNo, pageSize, selectedOption, sort,selectedDateRanges,searchText,}
) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId") 
  const data = await requestPortal(
   `dbservice/patient/filter?patientAllocated=${uId}&page=${
      pageNo ? pageNo : 0
    }&size=${pageSize ? pageSize : 15}&processedStatus=${
      selectedOption?.Status ? selectedOption?.Status : ""
    }&dueDateStart=${
      selectedDateRanges?.dueDate?.startDate
        ? selectedDateRanges?.dueDate?.startDate
        : ""
    }&dueDateEnd=${
      selectedDateRanges?.dueDate?.endDate ? selectedDateRanges?.dueDate?.endDate : ""
    }&processedStart=${selectedDateRanges?.completedDate?.startDate ? selectedDateRanges?.completedDate?.startDate : ""}&processedEnd=${
      selectedDateRanges?.completedDate?.endDate ? selectedDateRanges?.completedDate?.endDate : "" 
    }&batchId=${selectedOption?.batch || ""}&searchString=${
      searchText ? searchText : ""
    }&sortfield=${sort?.sortField ? sort?.sortField : ""}&sortdirection=${
      sort?.sortDir ? sort?.sortDir : ""
    }&priority=${selectedOption?.Priority ? selectedOption?.Priority : ""}`,
    options
  );
  return data;
}