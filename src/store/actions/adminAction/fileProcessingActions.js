import {
  patientDetails,
} from "../../../services/adminServices/fileProcessingService.js";

export const PATIENTS_LIST = "PATIENTS_LIST";
export const SELECTEDROW_FILEUPLOAD = "SELECTEDROW_FILEUPLOAD";
export const COMPLETED_REPORT='COMPLETED_REPORT'

export const selectedRoWDetails = (val) => ({
  type: SELECTEDROW_FILEUPLOAD,
  payload: val,
});

export const completedReport = (data) => {
  return (dispatch) => {
    try {
    
        dispatch({
          type: COMPLETED_REPORT,
          payload: data,
        });
    } catch (err) {
      console.log(err);
    }
  };
};
export const getPatientsList = (patientId, chartId) => {
  return (dispatch) => {
    try {
      patientDetails(patientId, chartId).then((response) => {
        if (response) {
          dispatch({
            type: PATIENTS_LIST,
            payload: response.data,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

