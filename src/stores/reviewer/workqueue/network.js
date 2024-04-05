import { requestPortal } from "../../../utils/network";

export async function patientsList({url }) {
  const options = {
    method: "GET",
  };
  const uId = localStorage.getItem("userId");

  const data = await requestPortal(
    `dbservice/patient/filter?${url}
  `,
    options
  );
  return data;
}
