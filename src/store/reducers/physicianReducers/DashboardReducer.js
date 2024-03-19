import { DASHBOARDCHART } from "../../../services/physicianService/DashbaordServices";

  const initialState = {
    data:null
  };

  export const PhysicianDashboardReducer = (state = initialState, action) => {
    if (action.type === DASHBOARDCHART) {
      return {
        ...state,
        data: action.payload,
      };
    }
    return state;
};