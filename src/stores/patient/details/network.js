import { requestPortal } from "../../../utils/network";

export async function patientDetails(patientId,processedYear,dos,setIsSpinnerLoading) {
  const options = {
    method: "GET",
  };
  var url = `patientId=${patientId}&processedYear=${processedYear}` 
  if(dos){
    url = `patientId=${patientId}&dateOfService=${dos}` 
  }
  try {
    const data = await requestPortal(
      `dbservice/patient/compute/get?${url}
    `,
      options
    );
    return data;
  } catch (error) {
    setIsSpinnerLoading(false);
  }
 
}

export async function patientIdDetails(patientId) {
  const orgId = localStorage.getItem("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/get?patientId=${patientId}`,
    options
  );
  return data;
}


export async function radiologyDetails(patientId) {
  const orgId = localStorage.getItem("orgId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/radiology/compute/get/radiology?patientid=${patientId}&orgid=${orgId}`,
    options
  );
  return data;
}

export async function labDetails(patientId) {
  const options = {
    method: "GET",
  };
  const orgId = localStorage.getItem("orgId");
  const data = await requestPortal(
    `dbservice/lab/compute/get/lab?patientid=${patientId}&orgid=${orgId}`,
    options
  );
  return data;
}

export async function patientHccFile(fileId) {
  const tenId = localStorage.getItem("tenantId");
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `aiservice/ai/getfile?fileId=${fileId}&tenantId=${tenId}`,
    options
  );
  return data;
}

export async function dosWiseList(patientId,year) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/get/alldos?patientId=${patientId}&processedYear=${year}`,
    options
  );
  return data;
}
export async function dosPageNumerList(patientId,year) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/patient/compute/get/alldossummaries?patientId=${patientId}&processedYear=${year}`,
    options
  );
  return data;
}

export async function meatQuery(patientId,year,dos) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/meatquery/getMeatQueryList?processedYear=${year}&patientId=${patientId}`,
    options
  );
  return data;
}
export async function getFlagsList(patientId,year,dos) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/flagdetails/get?patientId=${patientId}&processedYear=${year || ""}&dateOfService=${
      dos || ""
    }`,
    options
  );
  return data;
}


