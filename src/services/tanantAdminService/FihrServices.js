import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";

export async function FihrServices(router) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${ENDPOINTS?.apiLocal}emr/fhir/emr`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    if (err?.response?.status === 401) {
      router.push("/login");
    }
  }
}
