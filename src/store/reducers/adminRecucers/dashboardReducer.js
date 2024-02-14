import { TEAM_CHART } from "../../../services/adminServices/dashboardService";

const initialState = {
    data: null,
   
  };
  export const AdminDashboardReducer = (state = initialState, action) => {
    if (action.type === TEAM_CHART) {
      return {
        ...state,
        data: action.payload,
      };
    }
    return state;
  };