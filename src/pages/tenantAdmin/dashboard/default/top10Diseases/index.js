import React, { useEffect } from "react";
import ReusableTable from "../../components/table";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../../stores/tenantAdmin/dashboard/default";

const index = ({ top10DiseasesData, getTop10DiseasesData, top10DisesesLoader, loaderButton }) => {
  useEffect(() => {
    getTop10DiseasesData();
  }, []);
console.log(top10DisesesLoader,"top10DisesesLoader")
  return (
    <>
      <div>
        <span style={{fontSize:"18px",fontWeight:"600"}}>Top 10 Diseases</span>
        <span style={{color:"#FF8551",fontSize:"20px",fontWeight:"600",margin:"0 0 0 10px"}}> {top10DiseasesData?.response?.totalCount}</span>
      </div>

      <ReusableTable items={top10DiseasesData?.response?.topDiseaseDTOList} />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    top10DiseasesData: state?.tenantAdmin?.dashboard?.default?.allTop10Diseases?.data,
    top10DisesesLoader:state?.tenantAdmin?.dashboard?.default?.topTenDiseasesLoader

  }),
  {
    getTop10DiseasesData: allActions?.top10Diseases,
  }
);

export default enhancer(index);
