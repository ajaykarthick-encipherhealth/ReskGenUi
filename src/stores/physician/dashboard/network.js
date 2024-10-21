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


export async function getPhysician({physicianId}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `physician/dashboard?physicianId=${physicianId}
  `,
    options
  );
  return data;
}

