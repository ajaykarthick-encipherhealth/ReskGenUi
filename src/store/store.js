import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { PostsReducer, toggleMenu } from "./reducers/PostsReducer";
import thunk from "redux-thunk";
import { AuthReducer, PatientStore } from "./reducers/AuthReducer";
import todoReducers from "./reducers/Reducers";
import { DashboardReducer } from "./reducers/DashboradReducer";
import { PatientsReducer } from "./reducers/PatientsReducer";
import { ReportReducer } from "./reducers/ReportReducer";
import { NotificationReducer } from "./reducers/NotificationReducer";
//import { reducer as reduxFormReducer } from 'redux-form';
import { createWrapper } from "next-redux-wrapper";
import { AdminPatientsReducer } from "./reducers/adminRecucers/fileProcessingReducer";
import { AdminPatientsListReducer } from "./reducers/adminRecucers/patientsReducers"
import { AdminUsersReducer } from "./reducers/adminRecucers/usewrsReducer";
// import { DashboardReducers } from "./reducers/l2Reducers/DashboardReducer";
import { WorkReducers } from "./reducers/l2Reducers/AuditReducer";
import { L2DashboardReducers } from "./reducers/l2Reducers/DashboardReducer";
import { AdminDashboardReducers } from "./reducers/adminRecucers/DashboardReducer";

import {L2UserReducers} from "./reducers/l2Reducers/usersReducers"
import { AuditReportReducer } from "./reducers/l2Reducers/AuditReportReducer";
const middleware = applyMiddleware(thunk);

const composeEnhancers = compose;

const reducers = combineReducers({
  sideMenu: toggleMenu,
  posts: PostsReducer,
  auth: AuthReducer,
  patientDetails: PatientStore,
  todoReducers,
  workFlow: DashboardReducer,
  // workFlows: DashboardReducers,
  report:ReportReducer,
  AuditReport:AuditReportReducer,
  patients:PatientsReducer,
  AuditWork:  WorkReducers,
  notificationDatas:NotificationReducer,
  adminPatient:AdminPatientsReducer,
  adminList:AdminPatientsListReducer,
  adminUsers:AdminUsersReducer,
  l2Dashboard:L2DashboardReducers,
  AdminDashboardReducers:AdminDashboardReducers,
  l2User:L2UserReducers

  //form: reduxFormReducer,
});

//const store = createStore(rootReducers);

export const store = createStore(reducers, composeEnhancers(middleware));

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
