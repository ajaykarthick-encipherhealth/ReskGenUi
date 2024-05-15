import {
  patientDetails,
  AuditSentReport,
  AuditReceivedReport,
  GetSelectedReport,
  exportData,
  usersList,
  getFile,
  TeamReport,
} from "../../../services/l2Service/AuditReportService";
import { notification } from "antd";

export const REPORT_PATIENTS_DETAILS = "REPORT_PATIENTS_DETAILS";
export const TEAM_REPORT = "TEAM_REPORT";
export const SENT_REPORT = "SENT_REPORT";
export const RECEIVED_REPORT = "RECEIVED_REPORT";
export const REPORT_DETAILS = "REPORT_DETAILS";
export const SELECTEDROW = "SELECTEDROW";
export const EXPORT = "EXPORT";
export const SEARCH = "SEARCH";
export const FILEPATH = "FILEPATH";
export const FILEDETAILS = "FILEDETAILS";
export const REPORT = "REPORT";
export const ACTIVETAB = "ACTIVETAB";

export const getActiveTab = (val) => ({
  type: ACTIVETAB,
  payload: val,
});
export const selectedRow = (val) => ({
  type: SELECTEDROW,
  payload: val,
});

export const selectedReport = (val) => ({
  type: REPORT,
  payload: val,
});

export const getReportDetails = (
  pagenum,
  startDate,
  endDate,
  search,
  filter,
  sort
) => {
  return (dispatch) => {
    try {
      patientDetails(pagenum, startDate, endDate, search, filter, sort).then(
        (response) => {
          if (response) {
            dispatch({
              type: REPORT_PATIENTS_DETAILS,
              payload: response.data,
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
};

export const getTeamReportDetails = (
  pagenum,
  startDate,
  endDate,
  search,
  sort
) => {
  return (dispatch) => {
    dispatch({
      type: TEAM_REPORT,
      payload:{loading:true,
        data: null
      },
    });
    try {
      TeamReport(pagenum, startDate, endDate, search, sort).then((response) => {
        if (response) {
          dispatch({
            type: TEAM_REPORT,
            payload:{loading:false,
              data: response?.data
            },
          });
        }
      });
    } catch (err) {
      dispatch({
        type: TEAM_REPORT,
        payload:{loading:false,
          data: null
        },
      });
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
        notification.success({
          message: "Details Exported Successfully",
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

export const getSentDetails = (pagenum, startDate, endDate, search, sort) => {
  return (dispatch) => {
    dispatch({
      type: SENT_REPORT,
      payload: {
        loading: true,
      },
    });
    try {
      AuditSentReport(pagenum, startDate, endDate, search, sort).then(
        (response) => {
          if (response) {
            dispatch({
              type: SENT_REPORT,
              payload: {
                data: response,
                loading: false,
              },
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
};
export const getReceivedDetails = (
  pagenum,
  startDate,
  endDate,
  search,
  sort
) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVED_REPORT,
      payload: {
        loading: true,
      },
    });
    try {
      AuditReceivedReport(pagenum, startDate, endDate, search, sort).then(
        (response) => {
          if (response) {
            dispatch({
              type: RECEIVED_REPORT,
              payload: {
                data: response,
                loading: false,
              },
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
};
export const getSelectedReportDetails = (reportId, reportInfo) => {
  return (dispatch) => {
    try {
      GetSelectedReport(reportId, reportInfo).then((response) => {
        if (response) {
          dispatch({
            type: REPORT_DETAILS,
            payload: response?.response,
          });
          dispatch(getFileDetails(response?.response?.reportPath, reportInfo));
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};
export const getFileDetails = (pathname, reportInfo) => {
  return async (dispatch) => {
    try {
      if (pathname) {
        const response = await getFile(pathname);
        if (response) {
          const splitPath = pathname?.split(".").pop();
          dispatch({
            type: FILEDETAILS,
            payload: {
              path: response.data?.response,
              extention: splitPath,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
};
