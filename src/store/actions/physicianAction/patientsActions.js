import {
  PatientsList,
  TrackingList,
} from "../../../services/physicianService/patientsService";

export const LIST = "LIST";

export const getPatients = (physicianId, from, to, priority, search) => {
  return (dispatch) => {
    dispatch({
      type: LIST,
      payload: {
        loading: true,
        data: null,
      },
    });
    try {
      PatientsList(physicianId, from, to, priority, search).then((response) => {
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
