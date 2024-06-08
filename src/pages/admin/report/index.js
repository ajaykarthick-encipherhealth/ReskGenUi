import React, { useEffect } from "react";
import Reports from "../../../mainStream/reports";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";
import { useDispatch } from "react-redux";

const index = () => {
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(getActiveTab("Admin"));
  },[])
  return <Reports />;
};

export default index;

