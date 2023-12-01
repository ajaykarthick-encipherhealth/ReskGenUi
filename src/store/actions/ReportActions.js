import { patientDetails } from "../../services/ReportService";

export const REPORT_PATIENTS_DETAILS='REPORT_PATIENTS_DETAILS'

export const getReportDetails=(pagenum) =>{
    return (dispatch) => {
      try{
        patientDetails(pagenum).then((response) => {
          dispatch({
            type: REPORT_PATIENTS_DETAILS,
            payload: response.data,
          });
        });
      }catch(err){
        console.log(err)
      }
    };
  }