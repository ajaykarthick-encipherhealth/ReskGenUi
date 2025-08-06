import React, { useEffect } from "react";
import styles from "../../styles.module.css";
import CodesGraph from "../../components/codeGraph";
import { actions as allActions } from "../../../../../stores/tenantAdmin/dashboard/default";
import { connect } from "react-redux";
import { Tooltip } from "antd";
import { formatNumber } from "../../../../../utils/reusable";

const index = ({
  getAllLabAndRadiologyCount,
  dateRange,
  selectedOrganization,
  labAndRadiologyCount,
  selectDos,
}) => {
  const cardData = [
    {
      id: 1,
      title: "Radiology",
      count: labAndRadiologyCount?.response?.radiologyCount,
      color: "#F8D3E9",
    },
    {
      id: 2,
      title: "lab",
      count: labAndRadiologyCount?.response?.labCount,
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
  }, [dateRange, selectedOrganization]);

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
                    <div className={styles.count}>
                      {
                        <Tooltip title={item?.count && item?.count}>
                          {item?.count ? formatNumber(item?.count) : 0}
                        </Tooltip>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.header}>Overall Count</div>
            <div className={styles.price}>
              {
                <Tooltip title={overallCount && overallCount}>
                  {overallCount ? formatNumber(overallCount) : 0}
                </Tooltip>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="totalCodesPies">
        <CodesGraph
          borderColor={"#B51B75"}
          borderColor2={"#0E46A3"}
          isTwoWaves={true}
          isLabValues={true}
          className="codesGraphStyle3"
        />
      </div>
    </>
  );
};
const enhancer = connect(
  (state) => ({
    labAndRadiologyCount:
      state?.tenantAdmin?.dashboard?.default?.getAllLabAndRadiologyCount?.data,
  }),
  {
    getAllLabAndRadiologyCount: allActions.getAllLabAndRadiologyCount,
  }
);

export default enhancer(index);
