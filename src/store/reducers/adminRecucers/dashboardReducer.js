import {
  WORKFLOWDATA,
  DATE_RANGE,
  DAILY_TASK,
  ACCURACY,
  COMPLETED,
  HOLD_STATUS,
  SELECTED_DAY,
  CHATBOT,
  INDIVIDUAL_USER,
  COMPLETED_STATUS,
  SELECTED_USER,
} from "../../actions/adminAction/DashboardAction";

import {
  MANAGERS,
  TEAM_CHART,
  SPEEDOMETER,
  ACCURACY_DAILY,
  ACCURACY_MONTHLY,
  ACCURACY_WEEKLY,
} from "../../../services/adminServices/DashboardService";
const initialState = {
  data: null,
  dateRange: null,
  dailyTask: [],
  accuracy: null,
  completed: null,
  holdStatus: null,
  dayDetails: null,
  chatReply: null,
  individualUser: null,
  teamData: null,
  managers: null,
  speedometer: null,
  completedStatus: null,
  selectedUsers: null,
};

export const AdminDashboardReducer = (state = initialState, action) => {
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
  if (action.type === ACCURACY_MONTHLY) {
    return {
      ...state,
      accuracy: action.payload,
    };
  }
  if (action.type === ACCURACY_WEEKLY) {
    return {
      ...state,
      accuracy: action.payload,
    };
  }
  if (action.type === ACCURACY_DAILY) {
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
  if (action.type === INDIVIDUAL_USER) {
    return {
      ...state,
      individualUser: action.payload,
    };
  }
  if (action.type === TEAM_CHART) {
    return {
      ...state,
      teamData: action.payload,
    };
  }
  if (action.type === MANAGERS) {
    return {
      ...state,
      managers: action.payload,
    };
  }
  if (action.type === SPEEDOMETER) {
    return {
      ...state,
      speedometer: action.payload,
    };
  }
  if (action.type === COMPLETED_STATUS) {
    return {
      ...state,
      completedStatus: action.payload,
    };
  }
  if (action.type === SELECTED_USER) {
    return {
      ...state,
      selectedUsers: action.payload,
    };
  }
  return state;
};
