import {
  PatientsList,
  TrackingList,
} from "../../../services/physicianService/patientsService";

export const LIST = "LIST";


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

