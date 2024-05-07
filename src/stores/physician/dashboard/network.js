import { requestPortal } from "../../../utils/network";

export async function getAllPhysicianApi() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/physician/getall
  `,
    options
  );
  return data;
}