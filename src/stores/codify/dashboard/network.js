import { apirequestPortal } from "../../../utils/network";

export const codify = async ({ diseases }) => {
  const options = {
    method: "GET",
  };
  const url = `q=${diseases}`;
  const data = await apirequestPortal(`controlzen/getDiags?${url}`, options);
  return data;
};


export const codes = async({code}) =>{
  const options = {
    method: "GET",
  };
  const url = `q=${code}`;
  const data = await apirequestPortal(`controlzen/getDiagDetails?${url}`, options);
  return data;

}


export const riskadjustment = async({year,code}) =>{
  const options = {
    method: "GET",
  };
  const url = `year=${year}&code=${code}`;
  const data = await apirequestPortal(`controlzen/riskAdjustment?${url}`, options);
  return data;

}