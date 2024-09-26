import {
  patientDetails,
  SentReport,
  ReceivedReport,
  GetSelectedReport,
  exportData,
  usersList,
  getFile,
  SelectUserList,
} from "../../../services/adminServices/ReportService";
import { notification } from "antd";

export const REPORT_PATIENTS_DETAILS = "REPORT_PATIENTS_DETAILS";
export const SENT_REPORT = "SENT_REPORT";
export const RECEIVED_REPORT = "RECEIVED_REPORT";
export const REPORT_DETAILS = "REPORT_DETAILS";
export const SELECTEDROW = "SELECTEDROW";
export const EXPORT = "EXPORT";
export const SEARCH = "SEARCH";
export const FILEPATH = "FILEPATH";
export const FILEDETAILS = "FILEDETAILS";
export const REPORT = "REPORT";
export const SELECTED_USER_REPORT = "SELECTED_USER_REPORT";
export const ACTIVETAB = "ACTIVETAB";

export const getReportActiveTab = (val) => ({
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

export const getReportDetails = ({
  pagenum,
  startDate,
  endDate,
  search,
  filter,
  userName,
  sort,
  selectManager = "",
  size,
  flagsList,
  allPatientIds
}) => {
  return (dispatch) => {
    dispatch({
      type: REPORT_PATIENTS_DETAILS,
      payload:{data: null,loading:true},
    });
    try {
      patientDetails({
        pagenum,
        startDate,
        endDate,
        search,
        filter,
        userName,
        sort,
        selectManager,
        size,
        flagsList,
        allPatientIds
      }).then((response) => {
        if (response) {
          dispatch({
            type: REPORT_PATIENTS_DETAILS,
            payload:{data: response.data,loading:false},
          });
        }
      });
    } catch (err) {
      dispatch({
        type: REPORT_PATIENTS_DETAILS,
        payload:{data: null,loading:false},
      });
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
    try {
      SentReport(pagenum, startDate, endDate, search, sort).then((response) => {
        if (response) {
          dispatch({
            type: SENT_REPORT,
            payload: {
              data: response,
              loading: false,
            },
          });
        }
      });
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
    try {
      ReceivedReport(pagenum, startDate, endDate, search, sort).then(
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
export const getSelectUserListReport = (role) => {
  return (dispatch) => {
    dispatch({
      type: SELECTED_USER_REPORT,
      payload: {
        loading: true,
      },
    });
    try {
      SelectUserList(role).then((response) => {
        dispatch({
          type: SELECTED_USER_REPORT,
          payload: {
            data: response,
            loading: false,
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
};
