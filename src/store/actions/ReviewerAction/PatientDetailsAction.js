import { PatientDetails,MeatQuery,SectionColor } from "../../../services/ReviewerServices/PatientDetailsService";

  export const GET_PATIENT_DETAILS = "GET_PATIENT_DETAILS";
  export const GET_MEAT_QUERY = "GET_MEAT_QUERY";
  export const GET_SECTION_COLOR = "GET_SECTION_COLOR"

  
  export const getPatientDetailsResult = (patientid) => {
    return (dispatch) => {
      dispatch({
        type: GET_PATIENT_DETAILS,
        payload: {
          loading: true,
        },
      });
      try {
        PatientDetails(patientid).then((response) => {
          dispatch({
            type: GET_PATIENT_DETAILS,
            payload: {
              result: response,
              loading: false,
            },
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
  };

    
  export const getMeatQueryList = (dos,patientId) => {
    return (dispatch) => {
      dispatch({
        type: GET_MEAT_QUERY,
        payload: {
          loading: true,
        },
      });
      try {
        MeatQuery(dos,patientId).then((response) => {
          dispatch({
            type: GET_MEAT_QUERY,
            payload: {
              result: response,
              loading: false,
            },
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
  };

  export const getAllSectionColor = () => {
    return (dispatch) => {
      dispatch({
        type: GET_SECTION_COLOR,
        payload: {
          loading: true,
        },
      });
      try {
        SectionColor().then((response) => {
          dispatch({
            type: GET_SECTION_COLOR,
            payload: {
              result: response,
              loading: false,
            },
          });
        });
      } catch (err) {
        console.log(err);
      }
    };
  };