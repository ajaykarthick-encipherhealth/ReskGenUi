import { requestPortal } from "../../../utils/network";
import { apirequestPortal } from "../../../utils/network";

export const codify = async ({ diseases }) => {
  const options = {
    method: "GET",
  };
  const url = `q=${diseases}`;
  const data = await requestPortal(`dbservice/getDiags?${url}`, options);
  return data;
};

export const codes = async ({ code }) => {
  const options = {
    method: "GET",
  };
  const url = `q=${code}`;
  const data = await requestPortal(`management/getDiagDetails?${url}`, options);
  return data;
};

export const riskadjustment = async ({ year, code }) => {
  const options = {
    method: "GET",
  };
  const url = `year=${year}&code=${code}`;
  const data = await requestPortal(
    `dbservice/getRiskAdjustmentForYear?${url}`,
    options
  );
  return data;
};

export const searches = async ({ username }) => {
  const options = {
    method: "GET",
  };

  const data = await requestPortal("dbservice/getRecentSearches", options);
  return data;
};

export const autocomplete = async ({ code }) => {
  const options = {
    method: "GET",
  };
  
  const url = `q=${code}`;
  const data = await requestPortal(
    `management/autocomplete?q=${code}`,
    options
  );
  return data;
};
