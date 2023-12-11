import {
  patientDetails,
  SentReport,
  ReceivedReport,
  GetSelectedReport,
  exportData,
  usersList,
} from "../../services/ReportService";

export const REPORT_PATIENTS_DETAILS = "REPORT_PATIENTS_DETAILS";
export const SENT_REPORT = "SENT_REPORT";
export const RECEIVED_REPORT = "RECEIVED_REPORT";
export const REPORT_DETAILS = "REPORT_DETAILS";
export const SELECTEDROW = "SELECTEDROW";
export const EXPORT = "EXPORT";
export const SEARCH = "SEARCH";

export const selectedRow = (val) => ({
  type: SELECTEDROW,
  payload: val,
});

export const getReportDetails = (pagenum,startDate,endDate,search) => {
  return (dispatch) => {
    try {
      patientDetails(pagenum,startDate,endDate,search).then((response) => {
        if (response) {
          dispatch({
            type: REPORT_PATIENTS_DETAILS,
            payload: response.data,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getExportDetails = (data) => {
  return (dispatch) => {
    try {
      exportData(data).then((response) => {
        dispatch({
          type: EXPORT,
          payload: response.data,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getUsersList = (id, search) => {
  return (dispatch) => {
    try {
      usersList(id, search).then((response) => {
        dispatch({
          type: SEARCH,
          payload: response.data,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const getSentDetails = (pagenum,startDate,endDate,search) => {
  return (dispatch) => {
    try {
      SentReport(pagenum,startDate,endDate,search).then((response) => {
        if (response) {
          dispatch({
            type: SENT_REPORT,
            payload: response,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};
export const getReceivedDetails = (pagenum,startDate,endDate,search) => {
  return (dispatch) => {
    try {
      ReceivedReport(pagenum,startDate,endDate,search).then((response) => {
        if (response) {
          dispatch({
            type: RECEIVED_REPORT,
            payload: response,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};
export const getSelectedReportDetails = (reportId) => {
  return (dispatch) => {
    try {
      GetSelectedReport(reportId).then((response) => {
        if (response) {
          dispatch({
            type: REPORT_DETAILS,
            payload: response.data,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};
