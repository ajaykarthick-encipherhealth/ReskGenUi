import { requestPortal, requestPortalFiles } from "../../../utils/network";

export async function batchUploadCall({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `aiservice/ai/batch/upload
  `,
    options
  );
  return data;
}
export async function allBatches({
  page,
  search,
  batchUploadStatus,
  startDate,
  endDate,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/batch/batchupload?page=${page}&size=15&searchString=${
      search ? search : ""
    }&batchUploadStatus=${
      batchUploadStatus ? batchUploadStatus : ""
    }&startDate=${startDate ? startDate : ""}&endDate=${
      endDate ? endDate : ""
    }`,
    options
  );
  return data;
}
export async function createBatch({ info }) {
  const options = {
    method: "POST",
    body: JSON.stringify(info),
  };
  const data = await requestPortal(`management/batch`, options);
  return data;
}

export async function batchDetails({
  batchId,
  page,
  search,
  startDate,
  endDate,
  fileStatus,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/batch/batchuploaddetails?batchId=${batchId}&page=${page}&size=15&searchString=${search}&fileStatus=${
      fileStatus ? fileStatus : ""
    }&startDate=${startDate ? startDate : ""}&endDate=${
      endDate ? endDate : ""
    }`,
    options
  );
  return data;
}

export async function uploadFiles({ obj }) {
  const options = {
    method: "POST",
    body: obj,
  };
  const data = await requestPortalFiles(`management/batch/upload`, options);
  return data;
}
// triggerBatch
export async function triggerBatch({ obj }) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(`management/ftp/trigger`, options);
  return data;
}
