import { requestPortal } from "../../utils/network";

export async function icdCodes(search, page,size = 15) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/getAllIcdCodes?q=${search}&page=${page}&size=${size}
  `,
    options
  );
  return data;
}

export async function createIcdCode(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj)
  };
  const data = await requestPortal(
    `management/addOrUpdateIcdCodeWithYear
  `,
    options
  );
  return data;
}

export async function deleteIcdCode(id) {
  const options = {
    method: "POST"
  };
  const data = await requestPortal(
    `management/deleteIcdCodeWithYear?id=${id}
  `,
    options
  );
  return data;
}

export async function getSimple(search) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/hy?q=${search}
  `,
    options
  );
  return data;
}

export async function getSemantic(search) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/res?q=${search}
  `,
    options
  );
  return data;
}

export async function updateSemantic({obj}) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj)
  };
  const data = await requestPortal(
    `management/addOrUpdateIcdCodeWithYear
  `,
    options
  );
  return data;
}