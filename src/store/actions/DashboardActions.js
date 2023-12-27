import {
  workStatusApi,
  DailyTaskApi,
  accuracyScore,
  CompletedScore,
  HoldStatus,
  ChatBot
} from "../../services/DashboardService";

export const WORKFLOWDATA = "WORKFLOWDATA";
export const DATE_RANGE = "DATE_RANGE";
export const DAILY_TASK = "DAILY_TASK";
export const ACCURACY = "ACCURACY";
export const COMPLETED = "COMPLETED";
export const HOLD_STATUS = "HOLD_STATUS";
export const SELECTED_DAY = "SELECTED_DAY";
export const CHATBOT='CHATBOT'

export const getSelectedDay = (day) => ({
  type: SELECTED_DAY,
  payload: day,
});
export const getDateRange = (val) => ({
  type: DATE_RANGE,
  payload: val,
});

export const getWorkFlow = (startDate, endDate, router) => {
  console.log(startDate, endDate)
  return (dispatch) => {
    try {
      workStatusApi(startDate, endDate, router).then((response) => {
        dispatch({
          type: WORKFLOWDATA,
          payload: response,
        });
      });
    } catch (err) {
      console.log("dasff", err);
    }
  };
};
export const getDailyTaskDatas = (date, router) => {
  return (dispatch) => {
    DailyTaskApi(date, router).then((response) => {
      dispatch({
        type: DAILY_TASK,
        payload: response,
      });
    });
  };
};

export const getAccuracyScore = (btn, month, year, router) => {
  return (dispatch) => {
    accuracyScore(btn, month, year, router).then((response) => {
      dispatch({
        type: ACCURACY,
        payload: response,
      });
    });
  };
};

export const getCOmpletedScore = (btn, date, month, year, router) => {
  return (dispatch) => {
    CompletedScore(btn, date, month, year, router).then((response) => {
      dispatch({
        type: COMPLETED,
        payload: response,
      });
    });
  };
};

export const getHoldStatusData = (router) => {
  return (dispatch) => {
    HoldStatus(router).then((response) => {
      dispatch({
        type: HOLD_STATUS,
        payload: response,
      });
    });
  };
};

export const getChatReply = (msg) => {
  return (dispatch) => {
    ChatBot(msg).then((response) => {
      dispatch({
        type: CHATBOT,
        payload: response,
      });
    });
  };
};

