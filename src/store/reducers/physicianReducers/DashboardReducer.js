import { DASHBOARDCHART,GRAPHDATA } from "../../../services/physicianService/DashbaordServices";

  const initialState = {
    data:null,
    graphData:null
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
    return state;
};