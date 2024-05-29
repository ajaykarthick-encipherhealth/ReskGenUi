import { createActionThunk } from "../../../utils/redux";
import * as network from "./network";


export const codifyAction = createActionThunk(
  "CODIFY",
  network.codify
);