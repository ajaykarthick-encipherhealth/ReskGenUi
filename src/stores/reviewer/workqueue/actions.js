import { createAction } from "redux-actions";
import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const patientsAction = createActionThunk(
  "PATIENTS_LIST",
  network.patientsList
);

export const flagsAction = createActionThunk("FLAGS_LIST", network.flagsList);

export const getPatientDetails = createAction(
  "GET_ALL_REVIEWER_PATIENTS_FILES"
);

export const reviewerFilterList = createAction("GET_REVIEWER_FILTERED_LIST");
export const getReviewerPatients = createActionThunk(
  "GET_REVIEWER_PATIENTS",
  network.getAllReviewerPatients
);