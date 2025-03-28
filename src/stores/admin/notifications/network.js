import { notification } from "antd";
import { requestPortal } from "../../../utils/network";
import { getStorage } from "../../../utils/storages";

export async function getNotifications({
  searchText,
  users,
  selectedDateRanges,
  selectedOption,
  page,
  limit,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/notification/get/sentnotification?searchString=${
      searchText ? searchText : ""
    }&userTo=${  selectedOption?.users || ""}&createdDateStart${
      selectedDateRanges?.startDate || ""
    }=&createdDateEnd=${selectedDateRanges?.endDate || ""}&notificationCategories=${
      selectedOption?.Priority || ""
    }&page=${page || 0}&limit=${12}`,
    options
  );
  return data;
}

export async function getPostNotifications(data) {
  const options = {
    method: "POST",
    body: JSON.stringify(data),
  };
  const res = await requestPortal(
    `communication/push-notifications/admin/send`,
    options
  );
  return res;
}
