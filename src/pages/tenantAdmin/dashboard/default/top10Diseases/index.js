import React from "react";
import ReusableTable from "../../components/table";

const index = () => {
  return (
    <>
      <div>
        <span style={{fontSize:"18px",fontWeight:"600"}}>Top 10 Diseases</span>
        <span style={{color:"#FF8551",fontSize:"20px",fontWeight:"600",margin:"0 0 0 10px"}}>100K</span>
      </div>

      <ReusableTable />
    </>
  );
};

export default index;
