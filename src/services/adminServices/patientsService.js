import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export const PatientsList = async (
  pageNo,
  computationStart = "",
  computationEnd = "",
  status,
  search = "",
  completedStartDate,
  completedEndDate,
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy
) => {
  const token = localStorage.getItem("token");
  const uId = localStorage.getItem("userId");
 
  const filteredStatus =
    status === undefined
      ? "":status;
  try {
    const response = await axios.get(
      `  ${
        ENDPOINTS?.apiEndoint
      }dbservice/patient/admin/computation/filter?page=${pageNo}&size=15&userId=${uId}&isAllocation=false&computationStart=${computationStart}&computationEnd=${computationEnd}&status=${filteredStatus}&searchString=${search}&completedStartDate=${completedStartDate}&completedEndDate=${completedEndDate}&patientCreatedBy=${
        selAllocatedBy === "All" ? "" : selAllocatedBy
      }&patientAllocatedTo=${
        selAllocatedTo === "All" ? "" : selAllocatedTo
      }&patientAllocatedBy=${selCreatedBy === "All" ? "" : selCreatedBy}`,
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

export const TrackingList = async (
  pageNo,
  dStart = "",
  dEnd = "",
  search = "",
  status,
  pStart="",
  pEnd="",
  selAllocatedTo,
  pageSize = 15
) => {
  const token = localStorage.getItem("token");
  const uId = localStorage.getItem("userId");

  const filteredStatus =
  status === undefined
      ? "": status
  try {
    const response = await axios.get(
      `  ${ENDPOINTS?.apiEndoint}dbservice/patient/admin/filter?userId=${uId}&page=${pageNo}&size=${pageSize}&computing=${filteredStatus}&dueDateStart=${dStart}&dueDateEnd=${dEnd}&processedStart=${pStart}&processedEnd=${pEnd}&searchString=${search}&patientAllocated=${
          selAllocatedTo === "All" ? "" : selAllocatedTo
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
