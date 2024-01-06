import {
  PatientsList,
  SearchPatientsList,
  ChangePriority,
  PatientsListFilter
} from "../../services/PatientsListSevice";

export const PATIENTS_LIST = "PAIENTS_LIST";
export const SEARCH_PATIENT = "SEARCH_PATIENT";
export const CHANGE_PRIORITY = "CHANGE_PRIORITY";
export const FILTERATION='FILTERATION';
export const PATIENT_ID='PATIENT_ID';
export const PATIENTS_LIST_FILTER ='PATIENTS_LIST_FILTER'


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

export const getFilteredList = (data) => ({
  type: FILTERATION,
  payload: data,
});

export const getPatientID = (data) => ({
  type: PATIENT_ID,
  payload: data,
});

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

export const getPriorityChange = (patientId, year, priority) => {
  return (dispatch) => {
    try {
      ChangePriority(patientId, year, priority).then((response) => {
        console.log(response);
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getpatientsListFilter = (url) => {
  return (dispatch) => {
    try {
      PatientsListFilter(url).then((response) => {
        dispatch({
          type: PATIENTS_LIST_FILTER,
          payload: response,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};