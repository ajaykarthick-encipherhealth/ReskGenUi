import {
  PatientsList,
  SearchPatientsList,
} from "../../services/PatientsListSevice";

export const PATIENTS_LIST = "PAIENTS_LIST";
export const SEARCH_PATIENT = "SEARCH_PATIENT";

export const getpatientsList = (page, url) => {
  return (dispatch) => {
    try {
      PatientsList(page, url).then((response) => {
        dispatch({
          type: PATIENTS_LIST,
          payload: response,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getSearchPatients = (pagenum, search) => {
  return (dispatch) => {
    try {
      SearchPatientsList(pagenum, search).then((response) => {
        dispatch({
          type: SEARCH_PATIENT,
          payload: response,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};
