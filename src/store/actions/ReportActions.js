import { patientDetails,exportData,usersList } from "../../services/ReportService";

export const REPORT_PATIENTS_DETAILS='REPORT_PATIENTS_DETAILS'
export const SELECTEDROW='SELECTEDROW'
export const EXPORT='EXPORT'
export const SEARCH='SEARCH'


export const selectedRow=(val)=>({
  type:SELECTEDROW,
  payload:val
})
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

  export const getExportDetails=(data) =>{
    return (dispatch) => {
      try{
        exportData(data).then((response) => {
          dispatch({
            type: EXPORT,
            payload: response.data,
          });
        });
      }catch(err){
        console.log(err)
      }
    };
  }

  export const getUsersList=(id,search) =>{
    return (dispatch) => {
      try{
        usersList(id,search).then((response) => {
          dispatch({
            type: SEARCH,
            payload: response.data,
          });
        });
      }catch(err){
        console.log(err)
      }
    };
  }