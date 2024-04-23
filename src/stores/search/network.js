import { requestPortal } from "../../utils/network";

export async function icdCodes(search) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/getAllIcdcodes?q=${search}
  `,
    options
  );
  return data;
}

export async function createIcdCode({obj}) {
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

export async function getSimple(search) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/getAllIcdcodes?q=${search}
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
    `management/getAllIcdcodes?q=${search}
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