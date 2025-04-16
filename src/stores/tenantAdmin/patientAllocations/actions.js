import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";

export const getAllReviewerList = createActionThunk(
  "LIST",
  network.reviewerAllocation
);
export const getAllCheckedReviewers = createActionThunk(
  "CHECKED_LIST",
  network.checkedReviewersList
);

export const getUserList = createActionThunk("USERS_LIST", network.usersList);

export const getAllCheckListForUsers = createActionThunk(
  "CHECKED_USERS_LIST",
  network.usersCheckedList
);

export const getUsersAllocate = createActionThunk(
  "ALLOCATE_USERS",
  network.usersAllocate
);

// supervisor allocation

export const getAllSupervisorList = createActionThunk("SUPERVISORS_LIST", network.supervisorsList);

export const getSelectedSupervisorList = createActionThunk(
  "SELECTED_SUPERVISOR",
  network.selectedList
);

export const getFilterOptions=createActionThunk('FILTER_OPTIONS',network.getFilters)

export const getAllCheckListForSupervisor = createActionThunk(
  "CHECKED_SUPERVISORS_LIST",
  network.supervisorCheckedList
);
export const getAllocatedCheckListForSupervisor = createActionThunk(
  "CHECKED_SELECTED_SUPERVISORS_LIST",
  network.supervisorAllocatedList
);

export const getAllAllocationList = createActionThunk(
  "GET_ALL_ALLOCATION_LIST",
  network.getAllocationList
);

export const getAllocatedCount = createActionThunk(
  "GET_ALLOCATED_COUNT",
  network.allocatedCount
);

export const updateAllocationList = createActionThunk(
  "GET_ALLOCATED_COUNT",
  network.updateAllocation
);

export const getAllCheckedListForReviewer = createActionThunk(
  "REVIEWER_CHECKED_LIST",
  network.reviewerCheckedList
);

export const randomSamplingAction = createActionThunk(
  "RANDOM_SAMPLING",
  network.randomSampling
);

export const getMoveBackLevel = createActionThunk(
  "GET_MOVEBACK_LEVEL",
  network.getmoveBackLevel
);

export const postMoveBack = createActionThunk(
  "POST_MOVEBACK_LEVEL",
  network.moveBack
);





