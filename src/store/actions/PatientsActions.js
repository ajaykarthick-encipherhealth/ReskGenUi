import { PatientsList } from "../../services/PatientsListSevice";

export const PATIENTS_LIST = "PAIENTS_LIST";
//status,ProcessStartDate,ProcessEndDate

export const getpatientsList = (
  page,
  url
) => {
  return (dispatch) => {
    try {
      PatientsList(page,url).then(
        (response) => {
          dispatch({
            type: PATIENTS_LIST,
            payload: response,
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
};
