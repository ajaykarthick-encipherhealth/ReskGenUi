import React, { useEffect } from "react";
import Reports from "../../../mainStream/reports";
import { useDispatch } from "react-redux";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";

const index = () => {
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getActiveTab("Reviewer"));
  },[])
  return (
    <div>
      <Reports />
    </div>
  );
};

export default index;
