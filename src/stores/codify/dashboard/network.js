import { requestPortal } from "../../../utils/network";

export const codify = async ({ diseases }) => {
  const options = {
    method: "GET",
  };
  const url = `q=${diseases}`;
  const data = await requestPortal(`management/getDiags?${url}`, options);
  return data;
};
