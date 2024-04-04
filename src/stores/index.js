import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { createWrapper } from "next-redux-wrapper";
import { PostsReducer, toggleMenu } from "../store/reducers/PostsReducer";
import { DashboardReducer } from "../store/reducers/DashboradReducer";
import { PatientsReducer } from "../store/reducers/PatientsReducer";
import { ReportReducer } from "../store/reducers/ReportReducer";
import { NotificationReducer } from "../store/reducers/NotificationReducer";
import { AdminPatientsReducer } from "../store/reducers/adminRecucers/fileProcessingReducer";
import { AdminPatientsListReducer } from "../store/reducers/adminRecucers/patientsReducers";
import { AdminUsersReducer } from "../store/reducers/adminRecucers/usewrsReducer";
import { WorkReducers } from "../store/reducers/l2Reducers/AuditReducer";
import { L2DashboardReducers } from "../store/reducers/l2Reducers/DashboardReducer";
import { L2UserReducers } from "../store/reducers/l2Reducers/usersReducers";
import { AuditReportReducer } from "../store/reducers/l2Reducers/AuditReportReducer";
import { AdminDashboardReducer } from "../store/reducers/adminRecucers/dashboardReducer";
import { AdminReportReducer } from "../store/reducers/adminRecucers/ReportReducer";
import { PhyicianReducer } from "../store/reducers/physicianReducers/patientsReducers";
import { PhysicianDashboardReducer } from "../store/reducers/physicianReducers/DashboardReducer";
import { PhysicianComparisonReducer } from "../store/reducers/physicianReducers/ComparisionReducer";
import { TanantAdminService } from "../store/reducers/tanantAdminReducers/fihrReducers";
import { ReviewerReducers } from "../store/reducers/ReviewerReducers/ReviewerReducers";
import { AuthReducer, PatientStore } from "./authflow/reducers";

import { reducer as UpdateDashboardReducer } from "./reviewer/dashboard";

const reducers = combineReducers({
  // old reducers
  sideMenu: toggleMenu,
  posts: PostsReducer,
  auth: AuthReducer,
  patientDetails: PatientStore,
  workFlow: DashboardReducer,
  report: ReportReducer,
  AuditReport: AuditReportReducer,
  patients: PatientsReducer,
  AuditWork: WorkReducers,
  notificationDatas: NotificationReducer,
  adminPatient: AdminPatientsReducer,
  adminList: AdminPatientsListReducer,
  adminUsers: AdminUsersReducer,
  l2Dashboard: L2DashboardReducers,
  AdminDashboardReducers: AdminDashboardReducer,
  adminReport: AdminReportReducer,
  l2User: L2UserReducers,
  // physician
  phyicianReducer: PhyicianReducer,
  physicianDashbaord: PhysicianDashboardReducer,
  physicianComparison: PhysicianComparisonReducer,
  tanantAdmin: TanantAdminService,
  ReviewerReducers: ReviewerReducers,
  // reviewer:UpdateDashboardReducer
  reviewer: combineReducers({
    dashboard: UpdateDashboardReducer,
  }),
});

const middlewares = [thunkMiddleware, promiseMiddleware];

// if (process.env.NODE_ENV !== "production") {
if (false) {
  // need to remove for this if condition from production
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

export const store = createStore(
  reducers,
  compose(applyMiddleware(...middlewares))
);
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
