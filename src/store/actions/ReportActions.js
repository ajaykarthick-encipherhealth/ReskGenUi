import {
  patientDetails,
  SentReport,
  ReceivedReport,
  GetSelectedReport,
} from "../../services/ReportService";

export const REPORT_PATIENTS_DETAILS = "REPORT_PATIENTS_DETAILS";
export const SENT_REPORT = "SENT_REPORT";
export const RECEIVED_REPORT = "RECEIVED_REPORT";
export const REPORT_DETAILS = "REPORT_DETAILS";

export const getReportDetails = (pagenum) => {
  return (dispatch) => {
    try {
      patientDetails(pagenum).then((response) => {
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
export const getSentDetails = (pagenum) => {
  return (dispatch) => {
    try {
      SentReport(pagenum).then((response) => {
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
export const getReceivedDetails = (pagenum) => {
  return (dispatch) => {
    try {
      ReceivedReport(pagenum).then((response) => {
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
