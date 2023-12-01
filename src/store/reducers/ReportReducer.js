import { REPORT_PATIENTS_DETAILS } from "../actions/ReportActions";

const initialState={
   details:null
}

export const ReportReducer=(state=initialState,action)=>{
    if (action.type === REPORT_PATIENTS_DETAILS) {
        return {
            ...state,
            details: action.payload,
        };
    }
    return state;
}
