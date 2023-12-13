import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
// import { reducer as configReducer } from "./config";
import { reducer as dashboardReducer } from "./dashboard";
import { reducer as patientReducer } from "./patients";

import { createWrapper } from "next-redux-wrapper";

const reducers = combineReducers({
  // config: configReducer,
  dashboard: dashboardReducer,
  patients:patientReducer
});

const middlewares = [thunkMiddleware, promiseMiddleware];

// if (process.env.NODE_ENV !== "production") {
if (true) { // need to remove for this if condition from production
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

export const store = createStore(reducers, compose(applyMiddleware(...middlewares)));
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);

