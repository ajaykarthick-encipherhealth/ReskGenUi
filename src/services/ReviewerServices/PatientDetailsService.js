import axios from "axios";
import ENDPOINTS from "../../utility/enpoints";
import { getStorage } from "../../utils/storages";

export async function PatientDetails(patientId,year) {
  const token = getStorage("token");
  const orgId = getStorage("orgId");
  var apiurl = `patientid=${patientId}&orgid=${orgId}`;
  if(year){
    apiurl = `patientid=${patientId}&orgid=${orgId}&year=${year}`
  }
 
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/patient/compute/get?`+apiurl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}

export async function PatientDetailsNew(patientId,year,dos) {
  const token = getStorage("token");
  const orgId = getStorage("orgId");
   var apiurl = `patientId=${patientId}&processedYear=${year}` 
   if(dos){
    apiurl = `patientId=${patientId}&dateOfService=${dos}` 
   }
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/patient/compute/get?`+apiurl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}


export async function RadiologyDeatils(patientId) {
  const token = getStorage("token");
  const orgId = getStorage("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}

export async function LabDeatils(patientId) {
  const token = getStorage("token");
  const orgId = getStorage("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/lab/compute/get/lab?patientid=${patientId}&orgid=${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}

export async function MeatQuery(dos,patientId) {
  const token = getStorage("token");
  const orgId = getStorage("orgId");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/meatquery/getMeatQueryList?processedYear=${dos}&patientId=${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}

export async function SectionColor() {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/section/color/getallsections`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}

export async function HccFileDeatils(fileId) {
  const token = getStorage("token");
  const tenId = getStorage("tenantId");
  try {
    if (fileId) {
       const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
    }
   
  } catch (err) {
  }
}
export async function DosPageNumber(patientId,year) {
  const token = getStorage("token");
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}dbservice/patient/compute/get/alldossummaries?patientId=${patientId}&processedYear=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}

export async function DosWiseList(patientId,year) {
  const token = getStorage("token");
  var apiurl = `dbservice/patient/compute/get/alldos?patientId=${patientId}&processedYear=${year}` 
  try {
    const response = await axios.get(
      `${ENDPOINTS?.apiEndoint}`+apiurl,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
  }
}