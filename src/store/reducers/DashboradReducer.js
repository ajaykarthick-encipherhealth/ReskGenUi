import { WORKFLOWDATA,DATE_RANGE,DAILY_TASK,ACCURACY,COMPLETED,HOLD_STATUS } from "../actions/DashboardActions";

const initialState={
    data:null,
    dateRange:null,
    dailyTask:[],
    accuracy:null,
    completed:null,
    holdStatus:null
}

export const DashboardReducer=(state=initialState,action)=>{
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
    return state;
}
