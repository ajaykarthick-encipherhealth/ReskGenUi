import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";

export const PatientsList = async (
  pageNo,
  computationStart = "",
  computationEnd = "",
  status,
  search = "",
  createdStartDate,
  createdEndDate,
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy,
  sort
) => {
  const token = localStorage.getItem("token");
  const uId = localStorage.getItem("userId");

  const filteredStatus = status === undefined ? "" : status;
  try {
    const response = await axios.get(
      `  ${
        ENDPOINTS?.apiEndoint
      }dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&isAllocation=false&computationStart=${computationStart}&computationEnd=${computationEnd}&status=${filteredStatus}&searchString=${search}&createdStartDate=${createdStartDate}&createdEndDate=${createdEndDate}&patientCreatedBy=${
        selAllocatedBy === "All" ? "" : selAllocatedBy
      }&patientAllocatedTo=${
        selAllocatedTo === "All" ? "" : selAllocatedTo
      }&patientAllocatedBy=${
        selCreatedBy === "All" ? "" : selCreatedBy
      }&sortfield=${sort?.sortField ? sort?.sortField : ""}&sortdirection=${
        sort?.sortDir ? sort?.sortDir : ""
      }`,
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

export const TrackingList = async (datas) => {
  const token = localStorage.getItem("token");
  const uId = localStorage.getItem("userId");

  const filteredStatus =
    datas?.selectedOption === undefined ? "" : datas?.selectedOption;
  const filteredDStart =
    datas?.dueDateStart === undefined ? "" : datas?.dueDateStart;

  try {
    const response = await axios.get(
      `  ${
        ENDPOINTS?.apiEndoint
      }dbservice/patient/admin/filter?userId=${uId}&page=${
        datas?.pageNo
      }&size=15&processedStatus=${filteredStatus}&dueDateStart=${filteredDStart}&dueDateEnd=${
        datas?.dueDateEnd
      }&auditedStartDate=${datas?.processedStart}&auditedEndDate=${
        datas?.processedEnd
      }&searchString=${datas?.searchTextValue}&patientAllocated=${
        datas?.selAllocatedTo === "All" ? "" : datas?.selAllocatedTo
      }&auditAllocatedStart=${datas?.allocatedStartDate}&auditAllocatedEnd=${
        datas?.allocatedEndDate
      }&allocatedOnStart=${datas?.auditedStartDate}&allocatedOnEnd=${
        datas?.auditedEndDate
      }&allocatedBy=${datas?.selAllocatedBy}&auditDueDateStart=${
        datas?.auditedDueStartDate
      }&auditDueDateEnd=${datas?.auditedDueEndDate}&auditedStatus=${
        datas?.auditSelectedOption ? datas?.auditSelectedOption : ""
      }&auditAllocatedBy=${
        datas?.selAuditAllocatedBy ? datas?.selAuditAllocatedBy : ""
      }&auditedAssigned=${
        datas?.auditSelAllocatedTo ? datas?.auditSelAllocatedTo : ""
      }&sortfield=${
        datas?.sort?.sortField ? datas?.sort?.sortField : ""
      }&sortdirection=${datas?.sort?.sortDir ? datas?.sort?.sortDir : ""}`,
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
