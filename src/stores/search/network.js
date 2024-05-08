import { requestPortal } from "../../utils/network";

export async function icdCodes(search, page,size = 15, billable, source) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `management/getAllIcdCodes?q=${search}&page=${page}&size=${size}&billable=${billable}&source=${source}
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
    `dbservice/add-or-update-icd-code-with-year
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

export async function getSuggested(code) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/geticdsuggestedcodes?year=2023&diagnosisCode=${code}
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
    `management/update
  `,
    options
  );
  return data;
}