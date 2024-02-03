import axios from "axios";
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
      }&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}`,
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

  const filteredStatus = datas?.selectedOption === undefined ? "" : datas?.selectedOption;
  const filteredDStart =
    datas?.dueDateStart === undefined ? "" : datas?.dueDateStart;
  const filteredDEnd = datas?.dueDateEnd === undefined ? "" : datas?.dueDateEnd;
  const filteredPStart =
    datas?.processedStart === undefined ? "" : datas?.processedStart;
  const filteredPEnd =
    datas?.processedEnd === undefined ? "" : datas?.processedEnd;
  const filteredSearch =
    datas?.searchTextValue === undefined ? "" : datas?.searchTextValue;
  const filteredSAllocated =
    datas?.allocatedStartDate === undefined ? "" : datas?.allocatedStartDate;
  const filteredEAllocatedOn =
    datas?.auditedEndDate === undefined ? "" : datas?.allocatedEndDate;
  const filteredSAuditedStart =
    datas?.auditedStartDate === undefined ? "" : datas?.auditedStartDate;
  const filteredEAuditedEnd =
    datas?.auditedEndDate === undefined ? "" : datas?.auditedEndDate;

  try {
    const response = await axios.get(
      `  ${
        ENDPOINTS?.apiEndoint
      }dbservice/patient/admin/filter?userId=${uId}&page=${
        datas?.pageNo
      }&size=15&processedStatus=${filteredStatus}&dueDateStart=${filteredDStart}&dueDateEnd=${filteredDEnd}&auditedStartDate=${filteredPStart}&auditedEndDate=${filteredPEnd}&searchString=${filteredSearch}&patientAllocated=${
        datas?.selAllocatedTo === "All" ? "" : datas?.selAllocatedTo
      }&auditAllocatedStart=${filteredSAllocated}&auditAllocatedEnd=${filteredEAllocatedOn}&allocatedOnStart=${filteredSAuditedStart}&allocatedOnEnd=${filteredEAuditedEnd}&allocatedBy=${datas?.selAllocatedBy}`,
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
