import { requestPortal } from "../../utils/network";

export async function loadFilterPatientList(userId,pageNo,pageSize,processedStatus) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/patient/filter?userId=${userId}&page=${pageNo}&size=${pageSize}&processedStatus=${processedStatus}`, options);
  return data;
}