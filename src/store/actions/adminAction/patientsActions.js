import {
  PatientsList,
  TrackingList,
} from "../../../services/adminServices/patientsService";

export const LIST = "LIST";
export const TRACKING = "TRACKING";

export const getPatients = (
  pageNo,
  computationStart,
  computationEnd,
  status,
  search,
  completedStartDate,
  completedEndDate,
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy
) => {
  return (dispatch) => {
    try {
      PatientsList(
        pageNo,
        computationStart,
        computationEnd,
        status,
        search,
        completedStartDate,
        completedEndDate,
        selAllocatedTo,
        selAllocatedBy,
        selCreatedBy
      ).then((response) => {
        if (response) {
          dispatch({
            type: LIST,
            payload: response.data,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getTrackingList = (
  pageNo,
  dStart ,
  dEnd ,
  search,
  status,
  pStart,
  pEnd,
  selAllocatedTo
) => {
  return (dispatch) => {
    try {
      TrackingList(
        pageNo,
        dStart ,
        dEnd ,
        search,
        status,
        pStart,
        pEnd,
        selAllocatedTo
      ).then((response) => {
        if (response) {
          dispatch({
            type: TRACKING,
            payload: response.data,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};
