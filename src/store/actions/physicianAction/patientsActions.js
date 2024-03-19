import {
  PatientsList,
  TrackingList,
} from "../../../services/physicianService/patientsService";

export const LIST = "LIST";

export const getPatients = () => {
  return (dispatch) => {
    dispatch({
      type: LIST,
      payload: {
        loading: true,
        data: null,
      },
    });
    try {
      PatientsList().then((response) => {
        if (response?.data) {
          dispatch({
            type: LIST,
            payload: {
              loading: false,
              data: response?.data,
            },
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};
