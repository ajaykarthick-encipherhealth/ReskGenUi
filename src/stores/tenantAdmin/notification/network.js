import { requestPortal } from "../../../utils/network";

export async function getCustomAllUsers() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/getuser/page`,
    options
  );
  return data;
}