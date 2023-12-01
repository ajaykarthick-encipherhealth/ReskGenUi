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