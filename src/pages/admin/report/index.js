import React from "react";
import Reports from "../../../mainStream/reports";
const index = () => {
  return <Reports tab="Admin"/>;
};

export default index;

export const getActiveTab = (val) => ({
  type: ACTIVETAB,
  payload: val,
});