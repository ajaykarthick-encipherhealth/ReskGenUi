import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllList = createActionThunk(
  "LIST",
  network.allocatedGetList
);

export const getSupervisorsList = createActionThunk(
  "L2_LIST",
  network.l2List
);

export const getSelectedSupervisorList = createActionThunk(
  "SELECTED_SUPERVISOR",
  network.selectedList
);
export const getFiltersList = createActionThunk(
  "FILTERS_LIST",
  network.filters
);
export const getPatientAllocatedList = createActionThunk(
  "FILTERS_LIST_PATIENT_ALLOCATED", 
  network.patientAllocatedFilters
);
export const getAuditAssignedList = createActionThunk(
  "FILTERS_LIST_AUDIT_ASSIGNED",
  network.auditAssignedFilters
);
export const getAllocatedByList = createActionThunk(
  "FILTERS_LIST_ALLOCATED_BY",
  network.allocatedByFilters
);

export const getAllCheckedListForReviewer = createActionThunk(
  "REVIEWER_CHECKED_LIST",
  network.reviewerCheckedList
);
export const getAllCheckedListForSupervisor = createActionThunk(
  "SUPERVISOR_CHECKED_LIST",
  network.supervisorCheckedList
);