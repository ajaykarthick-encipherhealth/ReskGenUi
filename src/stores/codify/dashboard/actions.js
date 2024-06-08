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

export const  searchesAction = createActionThunk(
  " RECENT SEARCHES ",
  network.searches
);


export const  autoCompleteAction = createActionThunk(
  " AUTO COMPLETE ",
  network.autocomplete
);