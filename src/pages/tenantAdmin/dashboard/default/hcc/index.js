import React, { useEffect } from "react";
import { connect } from "react-redux";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/default/action.js";

const index = ({
  getAllHccCodesData,
  getAllHccCodes,
  getAllRafData,
  getAllRaf,
  getAllRafScoreData,
  getAllRafScore,
}) => {
  useEffect(() => {
    getAllHccCodesData();
    getAllRafData();
    getAllRafScore();
  }, []);

  return (
    <div className="d-flex justify-content-between">
      <div className="remianingLineGraph" style={{ width: "33%" }}>
        <div className="d-flex justify-content-between">
          <div className={styles.header}>HCC Codes</div>
          <div>
            <div className={styles.header}>Total Codes</div>
            <div className={styles.price}>{getAllHccCodes?.totalCount}</div>
          </div>
        </div>
        <CodesGraph
          gradientColor1={"#04B700"}
          gradientColor2={"#FAFFFA"}
          borderColor={"#04B700"}
          isHcc={true}
        />
      </div>
      <div
        className="remianingAreaGraph"
        style={{
          width: "33%",
          backgroundColor: "#F0ECFE",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-1`}>RAF</div>
          <div className="p-1">
            <div className={styles.header}>Overall RAF</div>
            <div className={styles.price}>
              {getAllRafScoreData?.totalHccRaf}
            </div>
          </div>
        </div>
        <RafGraph rafColor={"#8E68F7"} isHcc={true} />
      </div>
      <div
        style={{
          width: "33%",
          backgroundColor: "#EBFCFF",
          borderRadius: "16px",
          padding: "0px 5px 0 5px",
        }}
      >
        <div className="d-flex justify-content-between">
          <div className={`${styles.header} p-1`}>Revenue</div>
          <div className="p-1">
            <div className={styles.header}>Overall Revenue</div>
            <div className={styles.price}>{getAllRaf?.totalHccRafScore}</div>
          </div>
        </div>
        <RevenueGraph hccColor="#02BBDE" />
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.defaultHccCodes?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.defaultHccCodes?.allRafCounts?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.defaultRafScore?.allRafScore?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);

export default enhancer(index);
