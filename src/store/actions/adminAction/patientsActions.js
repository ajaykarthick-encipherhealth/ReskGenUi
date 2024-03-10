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
  createdStartDate,
  createdEndDate,
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy,
  sort
) => {
  return (dispatch) => {
    try {
      PatientsList(
        pageNo,
        computationStart,
        computationEnd,
        status,
        search,
        createdStartDate,
        createdEndDate,
        selAllocatedTo,
        selAllocatedBy,
        selCreatedBy,
        sort
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

export const getTrackingList = (datas) => {
  return (dispatch) => {
    try {
      TrackingList(datas).then((response) => {
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
