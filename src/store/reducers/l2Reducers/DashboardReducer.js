import {
    WORKFLOWDATA,
    DATE_RANGE,
    DAILY_TASK,
    ACCURACY,
    COMPLETED,
    HOLD_STATUS,
    SELECTED_DAY,
    CHATBOT
  } from "../../actions/l2Action/DashboardAction";
  
  const initialState = {
    data: null,
    dateRange: null,
    dailyTask: [],
    accuracy: null,
    completed: null,
    holdStatus: null,
    dayDetails: null,
    chatReply:null
  };
  
  export const L2DashboardReducers = (state = initialState, action) => {
    if (action.type === WORKFLOWDATA) {
      return {
        ...state,
        data: action.payload,
      };
    }
    if (action.type === DATE_RANGE) {
      return {
        ...state,
        dateRange: action.payload,
      };
    }
    if (action.type === DAILY_TASK) {
      return {
        ...state,
        dailyTask: [...state.dailyTask, action.payload],
      };
    }
    if (action.type === ACCURACY) {
      return {
        ...state,
        accuracy: action.payload,
      };
    }
    if (action.type === COMPLETED) {
      return {
        ...state,
        completed: action.payload,
      };
    }
    if (action.type === HOLD_STATUS) {
      return {
        ...state,
        holdStatus: action.payload,
      };
    }
    if (action.type === SELECTED_DAY) {
      return {
        ...state,
        dayDetails: action.payload,
      };
    }
    if (action.type === CHATBOT) {
      return {
        ...state,
        chatReply: action.payload,
      };
    }
    return state;
  };
  