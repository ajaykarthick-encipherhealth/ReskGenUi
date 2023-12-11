import axios from "axios";

export const patientDetails=(pagenum)=>{
  const token = localStorage.getItem("token");
  return axios.post(
    `https://hcc.encipherhealth.com/secure/dbservice/patient/patientdetailsl1?pageno=${pagenum}&size=10`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export const exportData=(data)=>{
  const token = localStorage.getItem("token");
  return axios.post(
    `https://hcc.encipherhealth.com/secure/management/patient/report/export`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export const usersList=(id,search)=>{
  const token = localStorage.getItem("token");
  return axios.get(
    `https://hcc.encipherhealth.com/secure/dbservice/user/getUsersByOrgIdAndSearchString?orgid=${id}&searchString=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
