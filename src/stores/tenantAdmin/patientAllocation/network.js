import { requestPortal } from "../../../utils/network";

export const usersList = async ({ userName }) => {
  const url = `dbservice/l2audit/statistics?username=${userName}`;

  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
export const allocateUsers = async ({ data }) => {
  const url = `dbservice/patient/admin/assignPatients/l2audit`;
  const options = {
    method: "POST",
    body:JSON.stringify(data)
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
export const errorHandling = async ({ data }) => {
  const url = `dbservice/sample/exceptionhandling`;
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};
export const getL2PatientList = async ({ value }) => {
  const url = `dbservice/l2audit/patients?username=${value}`;

  const options = {
    method: "GET",
  };

  const res = await requestPortal(`${url}`, options);
  return res;
};




