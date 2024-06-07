import { requestPortal } from "../../../utils/network";

export async function reviewerApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  filter = "",
  sort,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/coderreport?pageno=${pagenum}&size=7&startdate=${startDate}&enddate=${endDate}&status=${filter}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}
  `,
    options
  );
  return data;
}

export async function sentApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/reportdetails/sent?pageNo=${pagenum}&size=8&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${
      sort.sortField || ""
    }&sortdirection=${sort.sortDir || ""}
  `,
    options
  );
  return data;
}

export async function receivedApi({
  pagenum,
  startDate = "",
  endDate = "",
  search,
  sort,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/reportdetails/received?pageNo=${pagenum}&size=8&startdate=${startDate}&enddate=${endDate}&searchstring=${search}&sortfield=${sort?.sortField}&sortdirection=${sort?.sortDir}
  `,
    options
  );
  return data;
}
