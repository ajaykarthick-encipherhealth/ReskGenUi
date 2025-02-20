import { Empty, Popover, Tooltip } from "antd";
import React from "react";
import { truncateString } from "../../../components/patientDetails/details/components/function/ReusableFunctions";

const Flags = ({ reportListAll, styles, activeTab }) => {
  return (
    <div className={`col-12 ${styles.flags}`}>
      <div className={styles.cardHead}>Flags</div>
      <div className={styles.contentOverFlow}>
        {reportListAll?.flagIdCountDTOs?.length > 0 ? (
          reportListAll?.flagIdCountDTOs?.map((flagItem) => (
            <div
              className={styles.contentGroups}
              key={flagItem?.flagDetail?.id}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 800 800"
                  fill={
                    flagItem?.flagDetail?.flagColour
                      ? flagItem?.flagDetail?.flagColour
                      : "transparent"
                  }
                >
                  <path
                    d="M223 100V102H225H696.392L573.304 298.94L572.642 300L573.304 301.06L696.392 498H225H223V500V748H152V52H223V100Z"
                    stroke="#000"
                    strokeWidth="10"
                  />
                </svg>
                <span
                  className="cr-pointer"
                  style={{
                    fontSize: "12px",
                    paddingLeft: "10px",
                  }}
                >
                  <Tooltip
                    title={flagItem?.flagDetail?.flagName.replaceAll("_", " ")}
                  >
                    {flagItem?.flagDetail?.flagName
                      ? truncateString(
                          flagItem?.flagDetail?.flagName.replaceAll("_", " "),
                          30
                        )
                      : "---"}
                  </Tooltip>
                </span>
              </div>
              <Popover
                content={() => (
                  <div
                    style={{
                      maxHeight: "200px",
                      overflow: "scroll",
                    }}
                  >
                    <h5 className="border-bottom">
                      Total Flags: {flagItem.patientIds.length}
                    </h5>
                    {flagItem.patientIds.map((item) => (
                      <label className="d-block">{item}</label>
                    ))}
                  </div>
                )}
                trigger="hover"
              >
                <div className={`cr-pointer ${styles.count}`}>
                  {flagItem.count
                    ? flagItem.count < 99
                      ? flagItem.count
                      : "99+"
                    : 0}
                </div>
              </Popover>
            </div>
          ))
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
};

export default Flags;
