import { PatientDetails,MeatQuery,SectionColor ,HccFileDeatils,DosPageNumber,RadiologyDeatils} from "../../../services/ReviewerServices/PatientDetailsService";

  export const GET_PATIENT_DETAILS = "GET_PATIENT_DETAILS";
  export const GET_MEAT_QUERY = "GET_MEAT_QUERY";
  export const GET_SECTION_COLOR = "GET_SECTION_COLOR";
  export const GET_HCC_FILE = "GET_HCC_FILE";
  export const GET_DOS_PAGE = "GET_DOS_PAGE";
  export const GET_RADIOLOGY_DETAILS = "GET_RADIOLOGY_DETAILS";
  export const GET_RADIOLOGY_FILE = "GET_RADIOLOGY_FILE";


  
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

  export const getRadiologyDetails = (patientid) => {
    return (dispatch) => {
      dispatch({
        type: GET_RADIOLOGY_DETAILS,
        payload: {
          loading: true,
        },
      });
      try {
        RadiologyDeatils(patientid).then((response) => {
          dispatch({
            type: GET_RADIOLOGY_DETAILS,
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
          result: [],
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

  export const getHccFileDetails = (fileId) => {
    return (dispatch) => {
      dispatch({
        type: GET_HCC_FILE,
        payload: {
          loading: true,
        },
      });
      try {
        HccFileDeatils(fileId).then((response) => {
          dispatch({
            type: GET_HCC_FILE,
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

  export const getDosPageNumber = (fileId) => {
    return (dispatch) => {
      dispatch({
        type: GET_DOS_PAGE,
        payload: {
          loading: true,
        },
      });
      try {
        DosPageNumber(fileId).then((response) => {
          dispatch({
            type: GET_DOS_PAGE,
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

  export const getRadiologyFileDetails = (fileId) => {
    return (dispatch) => {
      dispatch({
        type: GET_RADIOLOGY_FILE,
        payload: {
          loading: true,
        },
      });
      try {
        HccFileDeatils(fileId).then((response) => {
          dispatch({
            type: GET_RADIOLOGY_FILE,
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