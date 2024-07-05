import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getpatientsList = createActionThunk(
  "PATIENTS_LIST",
  network.PatientsList
);
export const getSearchPatients = createActionThunk(
  "SEARCH_PATIENT",
  network.SearchPatientsList
);


export const getPriorityChange = createActionThunk(
  "CHANGE_PRIORITY",
  network.ChangePriority
);

export const getWorkListFilter = createActionThunk(
  "WORK_LIST_FILTER",
  network.GetWorkListFilters
);

export const getFilteredList = createAction(
  "FILTERATION",
);
export const getPatientID = createAction(
  "PATIENT_ID",

);