import React, { useEffect } from "react";
import ReusableTable from "../../components/table";
import { connect } from "react-redux";
import { top10Diseases } from "../../../../../stores/tenantAdmin/default/action.js";

const index = ({ top10DiseasesData, getTop10DiseasesData }) => {
  useEffect(() => {
    getTop10DiseasesData();
  }, []);
  return (
    <>
      <div>
        <span style={{ fontSize: "18px", fontWeight: "600" }}>
          Top 10 Diseases
        </span>
        <span
          style={{
            color: "#FF8551",
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 0 10px",
          }}
        >
          100K
        </span>
      </div>

      <ReusableTable items={top10DiseasesData?.response?.topDiseaseDTOList} />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    top10DiseasesData: state?.tenantAdmin?.tenantAdmindefault?.allTop10Diseases.data,1
  }),
  {
    getTop10DiseasesData: top10Diseases,
  }
);

export default enhancer(index);
