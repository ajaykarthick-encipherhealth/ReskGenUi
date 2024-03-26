import { message } from "antd";
import {
  workStatusApi,
  DailyTaskApi,
  accuracyScore,
  CompletedScore,
  HoldStatus,
  ChatBot,
} from "../../services/DashboardService";

export const WORKFLOWDATA = "WORKFLOWDATA";
export const DATE_RANGE = "DATE_RANGE";
export const DAILY_TASK = "DAILY_TASK";
export const ACCURACY = "ACCURACY";
export const COMPLETED = "COMPLETED";
export const HOLD_STATUS = "HOLD_STATUS";
export const SELECTED_DAY = "SELECTED_DAY";
export const CHATBOT = "CHATBOT";
var chatBotAllMessage = [];

export const getSelectedDay = (day) => ({
  type: SELECTED_DAY,
  payload: day,
});
export const getDateRange = (val) => ({
  type: DATE_RANGE,
  payload: val,
});

export const getWorkFlow = (startDate, endDate, router) => {
  return (dispatch) => {
    dispatch({
      type: WORKFLOWDATA,
      payload: {
        loding: true,
        data: null,
      },
    });
    try {
      workStatusApi(startDate, endDate, router).then((response) => {
        dispatch({
          type: WORKFLOWDATA,
          payload: {
            data: response,
            loding: false,
          },
        });
      });
    } catch (err) {
      console.log("dasff", err);
    }
  };
};
export const getDailyTaskDatas = (date, router) => {
  return (dispatch) => {
    dispatch({
      type: DAILY_TASK,
      payload: { loading: true },
    });
    try {
      DailyTaskApi(date, router).then((response) => {
        dispatch({
          type: DAILY_TASK,
          payload: { data: response, loading: false },
        });
      });
    } catch (Err) {
      console.log(Err);
    }
  };
};

export const getAccuracyScore = (btn, month, year, router, isAdmin) => {
  return (dispatch) => {
    dispatch({
      type: ACCURACY,
      payload: {
        loading: true,
      },
    });
    try {
      accuracyScore(btn, month, year, router, isAdmin).then((response) => {
        dispatch({
          type: ACCURACY,
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

export const getCOmpletedScore = (btn, date, month, year, router) => {
  return (dispatch) => {
    dispatch({
      type: COMPLETED,
      payload: { loading: true },
    });
    try {
      CompletedScore(btn, date, month, year, router).then((response) => {
        dispatch({
          type: COMPLETED,
          payload: {
            data: response,
            loading: false,
          },
        });
      });
    } catch (Err) {
      console.log(Err);
    }
  };
};

export const getHoldStatusData = (router) => {
  return (dispatch) => {
    dispatch({
      type: HOLD_STATUS,
      payload: {
        loading: true,
      },
    });
    try {
      HoldStatus(router).then((response) => {
        dispatch({
          type: HOLD_STATUS,
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

export const getChatReply = (msg) => {
  return (dispatch) => {
    dispatch({
      type: CHATBOT,
      payload: {
        loading: true,
        data: chatBotAllMessage,
      },
    });
    try {
      ChatBot(msg).then((response) => {
        chatBotAllMessage.push({
          details: response,
          question: msg,
        });
        dispatch({
          type: CHATBOT,
          payload: {
            data: chatBotAllMessage,
            loading: false,
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  // return (dispatch) => {
  //   ChatBot(msg).then((response) => {
  //     dispatch({
  //       type: CHATBOT,
  //       payload: response,
  //     });
  //   });
  // };
};
