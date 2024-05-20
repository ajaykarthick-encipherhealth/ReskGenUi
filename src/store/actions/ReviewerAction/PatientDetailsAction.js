import { PatientDetails,MeatQuery,SectionColor ,HccFileDeatils,DosPageNumber,RadiologyDeatils,LabDeatils, DosWiseList} from "../../../services/ReviewerServices/PatientDetailsService";

  export const GET_PATIENT_DETAILS = "GET_PATIENT_DETAILS";
  export const GET_MEAT_QUERY = "GET_MEAT_QUERY";
  export const GET_SECTION_COLOR = "GET_SECTION_COLOR";
  export const GET_HCC_FILE = "GET_HCC_FILE";
  export const GET_DOS_PAGE = "GET_DOS_PAGE";
  export const GET_RADIOLOGY_DETAILS = "GET_RADIOLOGY_DETAILS";
  export const GET_RADIOLOGY_FILE = "GET_RADIOLOGY_FILE";
  export const GET_LAB_DETAILS = "GET_LAB_DETAILS";
  export const GET_LAB_FILE = "GET_LAB_FILE";
  export const GET_DOS_LIST = "GET_DOS_LIST";



  
  export const getPatientDetailsResult = (patientid,year) => {
    return (dispatch) => {
      dispatch({
        type: GET_PATIENT_DETAILS,
        payload: {
          loading: true,
        },
      });
      try {
        PatientDetails(patientid,year).then((response) => {
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

  export const getLabDetails = (patientid) => {
    return (dispatch) => {
      dispatch({
        type: GET_LAB_DETAILS,
        payload: {
          loading: true,
        },
      });
      try {
        LabDeatils(patientid).then((response) => {
          dispatch({
            type: GET_LAB_DETAILS,
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

  export const getLabFileDetails = (fileId) => {
    return (dispatch) => {
      dispatch({
        type: GET_LAB_FILE,
        payload: {
          loading: true,
        },
      });
      try {
        HccFileDeatils(fileId).then((response) => {
          dispatch({
            type: GET_LAB_FILE,
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

  export const getPatientDosList = (patientid,year) => {
    const dosSummaries = [
      {
        dos: {
          date: "2023-10-08T18:30:00.000Z",
        },
        startPageNumber: 1,
        endPagNumber: 9,
      },
      {
        dos: {
          date: "2023-09-24T18:30:00.000Z",
        },
        startPageNumber: 10,
        endPagNumber: 12,
      },
      {
        dos: {
          date: "2023-07-14T18:30:00.000Z",
        },
        startPageNumber: 13,
        endPagNumber: 15,
      },
      {
        dos: {
          date: "2023-06-21T18:30:00.000Z",
        },
        startPageNumber: 16,
        endPagNumber: 19,
      },
      {
        dos: {
          date: "2023-05-25T18:30:00.000Z",
        },
        startPageNumber: 20,
        endPagNumber: 27,
      },
      {
        dos: {
          date: "2023-01-16T18:30:00.000Z",
        },
        startPageNumber: 28,
        endPagNumber: 37,
      },
      {
        dos: {
          date: "2022-09-11T18:30:00.000Z",
        },
        startPageNumber: 38,
        endPagNumber: 45,
      },
      {
        dos: {
          date: "2022-05-08T18:30:00.000Z",
        },
        startPageNumber: 46,
        endPagNumber: 54,
      },
      {
        dos: {
          date: "2022-02-06T18:30:00.000Z",
        },
        startPageNumber: 55,
        endPagNumber: 58,
      },
      {
        dos: {
          date: "2021-10-10T18:30:00.000Z",
        },
        startPageNumber: 59,
        endPagNumber: 66,
      },
      {
        dos: {
          date: "2021-09-07T18:30:00.000Z",
        },
        startPageNumber: 67,
        endPagNumber: 74,
      },
      {
        dos: {
          date: "2021-06-29T18:30:00.000Z",
        },
        startPageNumber: 75,
        endPagNumber: 77,
      },
      {
        dos: {
          date: "2021-06-28T18:30:00.000Z",
        },
        startPageNumber: 78,
        endPagNumber: 81,
      },
      {
        dos: {
          date: "2021-06-08T18:30:00.000Z",
        },
        startPageNumber: 82,
        endPagNumber: 84,
      },
      {
        dos: {
          date: "2021-03-07T18:30:00.000Z",
        },
        startPageNumber: 85,
        endPagNumber: 94,
      },
      {
        dos: {
          date: "2021-02-21T18:30:00.000Z",
        },
        startPageNumber: 95,
        endPagNumber: 100,
      },
    ];
    return (dispatch) => {
      // dispatch({
      //   type: GET_DOS_LIST,
      //   payload: {
      //     loading: true,
      //   },
      // });
      // try {
      //   DosWiseList(patientid,year).then((response) => {
          dispatch({
            type: GET_DOS_LIST,
            payload: {
              result: dosSummaries,
              loading: false,
            },
          });
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
    };
  };