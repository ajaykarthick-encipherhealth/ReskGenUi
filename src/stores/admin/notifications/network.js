import { notification } from "antd";
import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function getNotifications() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/notification/get/sentnotification`,
    options
  );
  return data;
}

export async function getPostNotifications(data) {
  const options = {
    method: "POST",
    body:JSON.stringify(data)
  };
  const res = await requestPortal(
    `communication/push-notifications/admin/send`,
    options
  );
  return res;
}
