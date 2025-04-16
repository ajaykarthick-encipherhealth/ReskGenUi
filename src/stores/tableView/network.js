import { requestPortal } from "../../utils/network";
import { getStorage } from "../../utils/storages";

export async function getTableView(
  {pageNo, pageSize, selectedOption, sort,selectedDateRanges,searchText,}
  ) {
    const options = {
      method: "GET",
    };
    const uId = getStorage("userId") 
    const data = await requestPortal(
     `dbservice/table/view?pageId=3a5feaba-7de6-4557-961b-ab973a688f81&page=0&size=10`,
      options
    );
    return data;
  }
