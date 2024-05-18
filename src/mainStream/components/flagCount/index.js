import React from "react";
import { SVGICON } from "../../../jsx/constant/theme";

const Flags = ({ flagsData, styles }) => {
  return (
    <div className={`col-xl-4 ${styles.flags}`}>
      <div className={styles.cardHead}>Flags</div>
      <div className={styles.contentOverFlow}>
        {flagsData?.map((flagItem) => (
          <div className={styles.contentGroups} key={flagItem.id}>
            <div>
              {SVGICON.flagsSvg}
              <span style={{ fontSize: "12px" }}>
                {flagItem?.flagName
                  ? flagItem?.flagName.replaceAll("_", " ")
                  : ""}
              </span>
            </div>
            <div className={styles.count}>
              {flagItem.count ? flagItem.count : 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flags;
