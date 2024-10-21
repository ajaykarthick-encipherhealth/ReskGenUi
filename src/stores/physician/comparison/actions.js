import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllPatientListAction = createActionThunk(
  "GET_ALL_PHYSISCIANS",
  network.PatientsList
);

export const getColorAction = createActionThunk(
  "GET_COLORS",
  network.getColors
);

export const getPatientAction = createActionThunk(
  "GET_ALL_PATIENTLIST",
  network.getPatientList
);

export const calendarAction = createActionThunk(
  "GET_CALENDAR_ACTION",
  network.getPatientList
);

export const graphContentAction = createActionThunk(
  "GET_CALENDAR_ACTION",
  network.getCalendarData
);