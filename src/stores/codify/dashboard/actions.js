import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";


export const codifyAction = createActionThunk(
  "CODIFY",
  network.codify
);

export const codesAction = createActionThunk(
  "CODES",
  network.codes
);

export const riskadjustmentAction = createActionThunk(
  "RISK ADJUSTMENT",
  network.riskadjustment
);