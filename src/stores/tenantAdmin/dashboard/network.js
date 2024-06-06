import { requestPortal } from "../../../utils/network";

export async function getAllOrganization() {
    const options = {
      method: "GET",
    };
    const data = await requestPortal(
      `dbservice/tenant/getall/organization`,
      options
    );
    return data;
  }