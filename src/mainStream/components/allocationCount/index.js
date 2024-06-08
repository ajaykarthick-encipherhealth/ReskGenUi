import { Empty } from "antd";
import React from "react";

const AllocationCount = ({
  title,
  allocationCount,
  renderUserPrfoileAvatar,
  styles,
}) => {
  return (
    <div className={`col-xl-4 ${styles.flags}`}>
      <div className={styles.cardHead}>
        <div>{title}</div>
        <div className={styles.contentOverFlow}>
          {allocationCount?.length > 0 ? (
            allocationCount?.map((item) => (
              <div className={styles.contentAuditor} key={item.id}>
                <div className={styles.avatar}>
                  <span className={styles.avatarAlign}>
                    {renderUserPrfoileAvatar(
                      item.userNameDTO?.firstName,
                      item?.userNameDTO?.lastName,
                      item?.userNameDTO?.profileImageUrl,
                      "header"
                    )}
                  </span>
                  <span className={styles.smallText}>
                    {item.userNameDTO?.firstName ||
                    item?.userNameDTO?.lastName ||
                    item?.userNameDTO?.profileImageUrl ? (
                      <span className={styles.smallText}>
                        {item.userNameDTO?.firstName}{" "}
                        {item?.userNameDTO?.lastName}
                      </span>
                    ) : (
                      <div>---</div>
                    )}
                  </span>
                </div>
                <div className={styles.count}>
                  {item?.count ? item?.count : 0}
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
    </div>
  );
};

export default AllocationCount;
