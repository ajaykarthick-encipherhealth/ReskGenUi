import React, { useState, useEffect } from "react";
import moment, { months } from "moment";
import styles from "../style.module.css";
import { renderUserPrfoileAvatarCustom } from "../../../../components/headerFilters/functions";

const SendList = ({ result }) => {
  return (
    <>
      {result?.map((data) => (
        <div className={styles.sendCard}>
          <div className={styles.sendCard2}>
            <div className="row">
              <div className="col-xl-10 d-flex">
                <div>
                  {renderUserPrfoileAvatarCustom(
                    data.userFrom,
                    "",
                    null,
                    "header",
                    "40px",
                    "40px"
                  )}
                </div>
                <div className="ms-3">
                  <span className={styles.sendCardHead}>{data.userFrom}</span>
                  <p className={styles.send_details}>{data.content}</p>
                </div>
              </div>
              <div className={`col-xl-2  ${styles.timeContainer}`}>
                <span className={styles.timeStatus}>
                  {moment(data.createdDate).format("MM/DD/YYYY HH:MM:A")}
                </span>
                {/* <span className={styles.typeStatus}>
                  {data.notificationType}
                </span> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SendList;
