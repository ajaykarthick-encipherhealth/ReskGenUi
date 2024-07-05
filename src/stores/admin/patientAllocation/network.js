import { requestPortal } from "../../../utils/network";

export async function allocatedGetList({ url }) {
  const options = {
    method: "GET",
  };
  const res = await requestPortal(
    `dbservice/patient/admin/computation/filter?${url}`,
    options
  );
  return res;
}
export const l2List = async ({ url }) => {
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `${url}
  `,
    options
  );
  return res;
};
export const selectedList = async ({ url }) => {
  const options = {
    method: "GET",
  };

  const res = await requestPortal(
    `${url}
  `,
    options
  );
  return res;
};
