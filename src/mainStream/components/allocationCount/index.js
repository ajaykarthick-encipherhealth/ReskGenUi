import { Empty, Tooltip } from "antd";
import React from "react";
import { createIdGen } from "../../../utils/reusable";
import { useRouter } from "next/router";

const AllocationCount = ({
  title,
  allocationCount,
  renderUserPrfoileAvatar,
  styles,
  id,
}) => {
  const router = useRouter();
  return (
    <div className={`col-6 ${styles.flags}`}>
      <div className={styles.cardHead}>
        <div>{title}</div>
        <div className={styles.contentOverFlow}>
          {allocationCount?.length > 0 ? (
            allocationCount?.map((item, index) => (
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
                <div
                  id={
                    id
                      ? createIdGen("flagcount" + index)
                      : createIdGen(
                          "flagcount " +
                            index +
                           router.pathname.replaceAll("/", " ")
                        )
                  }
                  className={`cr-pointer ${styles.count}`}
                >
                  {item?.count ? (
                    item.count < 99 ? (
                      item.count
                    ) : (
                      <Tooltip title={item.count}>99+</Tooltip>
                    )
                  ) : (
                    0
                  )}
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
