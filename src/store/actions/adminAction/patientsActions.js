import { PatientsList } from "../../../services/adminServices/patientsService";

export const LIST='LIST'

export const getPatients = (pageNo,pageSize) => {
    return (dispatch) => {
      try {
        PatientsList(pageNo,pageSize).then((response) => {
          if (response) {
            dispatch({
              type:LIST,
              payload: response.data,
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
  };