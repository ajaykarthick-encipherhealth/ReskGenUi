import { requestPortal, requestPortalImgUpload } from "../../../utils/network";

export async function uploadURL({ type }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/getuploadurl?filetype=${type}&filelocation=PROFILE_IMAGE
  `,
    options
  );
  return data;
}
export async function getURL({ url, urlType, file }) {
  const type =
    urlType === "jpg" || urlType === "jpeg" ? "image/jpeg" : "image/png";
  const options = {
    method: "PUT",
    body: file,
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": type,
      "Content-Length": file.size,
    },
  };
  const data = await requestPortalImgUpload(url, options);
  return data;
}

export async function updateImage({ url }) {
  const splitUrl = url.split("?").shift();
  const options = {
    method: "PUT",
    body: JSON.stringify({ profileImageUrl: splitUrl }),
  };
  const data = await requestPortal(
    `dbservice/user/profileimage
  `,
    options
  );
  return data;
}

export async function getUser({ userId }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/get?userName=${userId}
  `,
    options
  );
  return data;
}
