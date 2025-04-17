import { requestPortal, requestPortalRoleBased } from "../../utils/network";
import { getStorage } from "../../utils/storages";

export async function getTableView({
  pageId,
  pageNo,
  pageSize,
  selectedOption,
  sort,
  selectedDateRanges,
  searchText,
  activeStatus,
  roleId,
}) {
  const options = {
    method: "GET",
  };
  const uId = getStorage("userId");
  const data = await requestPortalRoleBased(
    `dbservice/table/view?pageId=${pageId}&pageNo=${pageNo}&pageSize=${pageSize}&status=${activeStatus?activeStatus:""}&roleId=${roleId}`,
    options
  );
  return data;
}
