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
