import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";


export const userStatusAction = createActionThunk(
    "USER_STATUS",
    network.getUserStatus
);
export const auditorStatusAction = createActionThunk(
  "AUDITOR_STATUS",
  network.getAuditorStatus
);
export const allocatedStatusAction = createActionThunk(
  "ALLOCATED_STATUS",
  network.getAllocatedStatus
);
export const reviewerStatusAction = createActionThunk(
  "REVIEWER_STATUS",
  network.getReviewerStatus
);

export const organizationStatusAction = createActionThunk(
  "ORGANIZATION_STATUS",
  network.getAllOrganization
);









