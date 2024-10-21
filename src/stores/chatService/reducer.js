// import { combineReducers } from "redux";
// import { handleActions } from "redux-actions";
// import {getChatReply,getChatHistory,getUsers,getHandleChatHistory,getHandleResetReadHistory,getHandleFilePost,getDddUser } from "./actions";

// const initialState = {
//   loading: true,
//   data: null,
//   error: null,
// };

// const createReducer = (actionType) =>
//   handleActions(
//     {
//       [actionType.STARTED]: (state, action) => ({
//         ...state,
//         loading: true,
//         error: null,
//       }),
//       [actionType.SUCCEEDED]: (state, action) => ({
//         ...state,
//         loading: false,
//         data: action.payload,
//         error: null,
//       }),
//       [actionType.FAILED]: (state, action) => ({
//         ...state,
//         loading: false,
//         error: action.payload,
//       }),
//     },
//     initialState
//   );


//   const getUsersDetailsLoading=(type) => handleActions(
//   {
//     [type.START]: () => true,
//     [type.SUCCEEDED]: () => false,
//     [type.FAILED]: () => false,
//   },
//   false
// );
// const chatServiceReducer = combineReducers({
//  chatReply: createReducer(getChatReply),
//  loading: getUsersDetailsLoading(getChatReply),
//  getChatHistory: createReducer(getChatHistory),
//  getUsers: createReducer(getUsers),
//  getHandleChatHistory: createReducer(getHandleChatHistory),
//  getHandleResetReadHistory: createReducer(getHandleResetReadHistory),
//  getHandleFilePost: createReducer(getHandleFilePost),
//  getDddUser: createReducer(getDddUser),
// });

// export default chatServiceReducer;
