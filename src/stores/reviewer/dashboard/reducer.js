// import { combineReducers } from "redux";
// import { handleActions } from "redux-actions";
// import { workFlowAction } from "./actions";


// const WorkFlowData = handleActions(
//   {
//     [workFlowAction.SUCCEEDED]: (state, { payload }) => {
//       return payload;
//     },
//   },
//   {}
// );

// export default combineReducers({
//   response:WorkFlowData
// });

import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import { workFlowAction } from "./actions";

const initialState = {
  loading: true,
  data: null, 
  error:null
};

const WorkFlowData = handleActions(
  {
    [workFlowAction.REQUESTED]: (state, action) => {
      return { ...state, loading: true, error: null }; 
    },
    [workFlowAction.SUCCEEDED]: (state, action) => {
      return { ...state, loading: false, data: action.payload, error: null }; 
    },
    [workFlowAction.FAILED]: (state, action) => {
      return { ...state, loading: false, error: action.payload }; 
    }
  },
  initialState 
);

export default combineReducers({
  response: WorkFlowData
});
