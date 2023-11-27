import { WORKFLOWDATA,DATE_RANGE,DAILY_TASK } from "../actions/DashboardActions";

const initialState={
    data:null,
    dateRange:null,
    dailyTask:[]
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
    return state;
}
