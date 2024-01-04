import { PatientsList, TrackingList } from "../../../services/adminServices/patientsService";

export const LIST='LIST'
export const TRACKING='TRACKING'


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



export const getTrackingList = (pageNo,pageSize) => {
    return (dispatch) => {
      try {
        TrackingList(pageNo,pageSize).then((response) => {
          if (response) {
            dispatch({
              type:TRACKING,
              payload: response.data,
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
  };