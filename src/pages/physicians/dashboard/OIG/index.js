import React from "react";
import DoubleBarChant from "../doubleBarChant";

const HighRisk = ({ data }) => {
  const codesList = data?.map((item) => ([
   item?.diagnosisCode,
   item?.meatPresentCount,
   item?.meatAbsentCount,
  ]));
  return (
    <div>
      <DoubleBarChant data={codesList}/>
    </div>
  );
};

export default HighRisk;
