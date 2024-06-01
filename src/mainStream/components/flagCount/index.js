import { Empty } from "antd";
import React from "react";

const Flags = ({ reportListAll, styles }) => {
  return (
    <div className={`col-xl-4 ${styles.flags}`}>
      <div className={styles.cardHead}>Flags</div>
      <div className={styles.contentOverFlow}>
        {reportListAll?.flagIdCountDTOs ? (
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
                    stroke-width="10"
                  />
                </svg>
                <span
                  style={{
                    fontSize: "12px",
                    paddingLeft: "10px",
                  }}
                >
                  {flagItem?.flagDetail?.flagName
                    ? flagItem?.flagDetail?.flagName.replaceAll("_", " ")
                    : "---"}
                </span>
              </div>
              <div className={styles.count}>
                {flagItem.count ? flagItem.count : 0}
              </div>
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
