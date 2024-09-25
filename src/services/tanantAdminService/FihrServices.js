import axios from "../../utility/axiosConfig";
import ENDPOINTS from "../../utility/enpoints";
import { getStorage } from "../../utils/storages";

export async function FihrServices(router) {
  const token = getStorage("token");
  try {
    const response = await axios.get(`${ENDPOINTS?.apiLocal}emr/fhir/emr`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err)
  }
}
