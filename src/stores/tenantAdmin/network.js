import { requestPortal } from "../../utils/network";

export async function batchUploadCall({obj}) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj)
  };
  const data = await requestPortal(
    `aiservice/ai/batch/upload
  `,
    options
  );
  return data;
}