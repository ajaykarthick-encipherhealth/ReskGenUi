import React, { useState } from "react";
import { connect } from "react-redux";
import CodesGraph from "../../components/codeGraph";
import styles from "../../styles.module.css";
import RafGraph from "../../components/rafGraph";
import RevenueGraph from "../../components/revenueGraph";
import {
  HccCodes,
  RafCounts,
  getAllRafScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { Empty, Tooltip } from "antd";
import { Skeleton } from "antd";
import { formatNumber } from "../../../../../utils/reusable.js";
import HederMinimization from "../../components/headerMinimization";
const Index = ({
  getAllHccCodes,
  getAllRafScoreData,
  getAllRaf,
  selectedOrganization,
  selectedValue,
  totalCodesLoader,
  revenueChartLoader,
  rafScorechartLoader,
  customDate,
  selectDos,
}) => {
  const [minimize, setMinimize] = useState(false);
  const hccDiseaseCountValues = getAllHccCodes?.hccDiseaseCountMap
    ? Object.values(getAllHccCodes.hccDiseaseCountMap)
    : [];

  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc
    ? Object.values(getAllRaf.premiumByDateForHcc)
    : [];

  const rafScoreByDateForHcc = getAllRafScoreData?.rafScoreByDateForHcc
    ? Object.values(getAllRafScoreData.rafScoreByDateForHcc)
    : [];

  const TotalHccRevenue = getAllRaf?.totalHccRafScore;

  return (
    <>
      <HederMinimization
        title={"HCC"}
        minimize={minimize}
        setMinimize={setMinimize}
      />
      {!minimize && (
        <div className={`d-flex justify-content-between`}>
          <div className="remianingLineGraph" style={{ width: "33%" }}>
            <div className={styles.headers}>
              <div className="d-flex justify-content-between ">
                <div className={styles.header}>HCC Codes</div>
                <div>
                  <div className={styles.header}>Total Codes</div>
                  <div className={styles.price}>
                    <Tooltip
                      title={
                        getAllHccCodes?.hccCount && getAllHccCodes?.hccCount
                      }
                    >
                      {getAllHccCodes?.hccCount
                        ? formatNumber(getAllHccCodes?.hccCount)
                        : 0}
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {totalCodesLoader ? (
              <div>
                <Skeleton.Input
                  className="w-100"
                  style={{ height: "288px" }}
                  active
                />
              </div>
            ) : hccDiseaseCountValues?.length > 0 ? (
              <div className="totalCodesPies">
                <CodesGraph
                  gradientColor1={"#04B700"}
                  gradientColor2={"#FAFFFA"}
                  borderColor={"#04B700"}
                  isHcc={true}
                  selectedValue={selectedValue}
                  selectedOrganization={selectedOrganization}
                  className="codesGraphStyle3"
                  customDate={customDate}
                />
              </div>
            ) : (
              <Empty className="mt-3" />
            )}
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
            <div className={styles.headers}>
              <div className="d-flex justify-content-between">
                <div className={`${styles.header} p-1`}>RAF</div>
                <div className="p-1">
                  <div className={styles.header}>HCC RAF</div>
                  <div className={styles.price}>
                    <Tooltip
                      title={
                        getAllRafScoreData?.totalHccRaf &&
                        getAllRafScoreData?.totalHccRaf
                      }
                    >
                      {getAllRafScoreData?.totalHccRaf
                        ? formatNumber(getAllRafScoreData?.totalHccRaf)
                        : 0}
                    </Tooltip>
                    {/* {(getAllRafScoreData?.totalHccRaf || 0).toFixed(2)} */}
                  </div>
                </div>
              </div>
            </div>

            {rafScorechartLoader ? (
              <div>
                <Skeleton.Input
                  className="w-100"
                  style={{ height: "288px" }}
                  active
                />
              </div>
            ) : rafScoreByDateForHcc?.length > 0 ? (
              <div className="totalCodesPies2">
                <RafGraph
                  rafColor={"#8E68F7"}
                  isHcc={true}
                  selectedValue={selectedValue}
                  customDate={customDate}
                  selectDos={selectDos}
                  className={"carecapRAF2"}
                />
              </div>
            ) : (
              <Empty className="mt-3" />
            )}
          </div>
          <div
            style={{
              width: "33%",
              backgroundColor: "#EBFCFF",
              borderRadius: "16px",
              padding: "0px 5px 0 5px",
            }}
          >
            <div className={styles.headers}>
              <div className="d-flex justify-content-between">
                <div className={`${styles.header} p-1`}>Revenue</div>
                <div className="p-1">
                  <div className={styles.header}>HCC Revenue</div>
                  <div className={styles.price}>{`$ ${
                    TotalHccRevenue !== undefined
                      ? formatNumber(TotalHccRevenue.toFixed(2))
                      : 0
                  }`}</div>
                </div>
              </div>
            </div>

            {revenueChartLoader ? (
              <div>
                <Skeleton.Input
                  className="w-100"
                  style={{ height: "288px" }}
                  active
                />
              </div>
            ) : premiumByDateForHcc?.length > 0 ? (
              <div className="totalCodesPies">
                <div className="totalCodesPies2">
                  <RevenueGraph
                    isHcc={true}
                    hccColor="#02BBDE"
                    selectedValue={selectedValue}
                    className="revenueCharts2"
                    customDate={customDate}
                  />
                </div>
              </div>
            ) : (
              <Empty className="mt-3" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.dashboard?.default?.allRafScoreData?.data?.response,

    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    revenueChartLoader:
      state?.tenantAdmin?.dashboard?.default?.revenueChartLoader,
    totalCodesLoader: state?.tenantAdmin?.dashboard?.default?.totalHccLoader,
    rafScorechartLoader: state?.tenantAdmin?.dashboard?.default?.rafScoreLoader,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafScore: getAllRafScore,
    getAllRafData: RafCounts,
  }
);

export default enhancer(Index);
