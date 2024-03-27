import { DASHBOARDCHART,GRAPHDATA,CALENDER } from "../../../services/physicianService/DashbaordServices";

  const initialState = {
    data:null,
    graphData:null,
    calenderData:null
  };

  export const PhysicianDashboardReducer = (state = initialState, action) => {
    if (action.type === DASHBOARDCHART) {
      return {
        ...state,
        data: action.payload,
      };
    }
    if (action.type === GRAPHDATA) {
        return {
          ...state,
          graphData: action.payload,
        };
      }
      if (action.type === CALENDER) {
        return {
          ...state,
          calenderData: action.payload,
        };
      }
    return state;
};