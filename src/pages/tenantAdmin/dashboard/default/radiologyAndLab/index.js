import React, { useEffect } from "react";
import styles from "../../styles.module.css";
import CodesGraph from "../../components/codeGraph";
import { actions as allActions } from "../../../../../stores/tenantAdmin/dashboard/default";
import { connect } from "react-redux";

const index = ({
  getAllLabAndRadiologyCount,
  dateRange,
  selectedOrganization,
  labAndRadiologyCount,
  chartData
}) => {
  const cardData = [
    {
      id: 1,
      title: "Radiology",
      count: labAndRadiologyCount?.response?.labCount,
      color: "#F8D3E9",
    },
    {
      id: 2,
      title: "lab",
      count: labAndRadiologyCount?.response?.radiologyCount,
      color: "#D0E0FB",
    },
  ];
  const overallCount =
    labAndRadiologyCount?.response?.labCount +
      labAndRadiologyCount?.response?.radiologyCount || 0;
  useEffect(() => {
    getAllLabAndRadiologyCount({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      organizationId: selectedOrganization,
    });
  }, [dateRange]);

  return (
    <>
      <div className={styles.headers}>
        <div className="d-flex justify-content-between">
          <div className={styles.header} style={{ width: "50%" }}>
            <div
              className="d-flex justify-content-between"
              style={{ width: "100%" }}
            >
              {cardData?.map((item, index) => (
                <div
                  className="rounded-lg w-30"
                  style={{
                    backgroundColor: item?.color,
                    width: "48%",
                    height: "100px",
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                    borderRadius: "10px",
                  }}
                >
                  <div>
                    <div className="d-flex justify-content-center">
                      {item?.title}
                    </div>
                    <div className={styles.count}>{item?.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.header}>Overall Count</div>
            <div className={styles.price}>{overallCount}</div>
          </div>
        </div>
      </div>

      <CodesGraph
        borderColor={"#B51B75"}
        borderColor2={"#0E46A3"}
        isTwoWaves={true}
        isLabValues={true}
      />
    </>
  );
};
const enhancer = connect(
  (state) => ({
    labAndRadiologyCount:
      state?.tenantAdmin?.dashboard?.default?.getAllLabAndRadiologyCount?.data,
      chartData:state
  }),
  {
    getAllLabAndRadiologyCount: allActions.getAllLabAndRadiologyCount,
  }
);

export default enhancer(index);
