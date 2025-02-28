import React from "react";
import moment from "moment";
import styles from "../style.module.css";
import { renderUserPrfoileAvatar, renderUserPrfoileAvatarCustom } from "../../../../components/headerFilters/functions";
import { Popover, Tooltip } from "antd";
import { formatDateTime } from "../../../../utils/reusable";

const SendList = ({ result }) => {
  return (
    <>
      {result?.length > 0 &&
        result?.map((data) => (
          <div className={styles.sendCard}>
            <div className={styles.sendCard2}>
              <div className="row">
                <div className="col-xl-10 d-flex flex-column">
                  <div className="d-flex align-items-center">
                    <div>
                      {data.userFromDto?.firstName ||
                      data.userFromDto?.lastName ||
                      data?.userFromDto?.profileImageUrl ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Tooltip title={data.userFrom} position="bottom">
                            <span style={{ marginRight: "10px" }}>
                              {renderUserPrfoileAvatar(
                                data.userFromDto?.firstName,
                                data.userFromDto?.lastName,
                                data?.userFromDto?.profileImageUrl,
                                "header"
                              )}
                            </span>
                          </Tooltip>

                          <div className="d-flex flex-column">
                            {" "}
                            <div>
                              {data.userFromDto?.firstName}{" "}
                              {data.userFromDto?.lastName}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" }}>---</div>
                      )}
                    </div>
                    <div className="m-3">To </div>
                    <div>
                      <div className="d-flex align-items-center">
                        {data.userToDtoList && data.userToDtoList.length > 0 ? (
                          <>
                            {data.userToDtoList
                              .slice(0, 3)
                              .map((user, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span style={{ marginRight: "10px" }}>
                                    {renderUserPrfoileAvatar(
                                      user.firstName,
                                      user.lastName,
                                      user.profileImageUrl,
                                      "header"
                                    )}
                                  </span>
                                  <span style={{ marginRight: "10px" }}>
                                    {user.firstName} {user.lastName}
                                    {index < 2 &&
                                      index < data.userToDtoList.length - 1 &&
                                      ", "}
                                  </span>
                                </div>
                              ))}
                            {data.userToDtoList.length > 3 && (
                              <Popover
                                content={
                                  <div
                                    style={{
                                      height: "auto",
                                      maxHeight: "200px",
                                      paddingRight: "10px",
                                      overflow: "scroll",
                                    }}
                                  >
                                    {data.userToDtoList
                                      .slice(3)
                                      .map((user, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div style={{ margin: "5px" }}>
                                            {renderUserPrfoileAvatar(
                                              user.firstName,
                                              user.lastName,
                                              user.profileImageUrl,
                                              "header"
                                            )}
                                          </div>
                                          <div>
                                            {user.firstName} {user.lastName}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                }
                                trigger="hover"
                              >
                                <div className={styles.send_count}>
                                  {data.userToDtoList.length - 3}+
                                </div>
                              </Popover>
                            )}
                          </>
                        ) : (
                          <div style={{ textAlign: "center" }}>---</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: "auto",
                      width: "100%",
                      marginLeft: "20px",
                    }}
                  >
                    <p
                      className={styles.send_details}
                      style={{ paddingLeft: "20px" }}
                    >
                      {data.content}
                    </p>
                  </div>
                </div>
                <div className={`col-xl-2  ${styles.timeContainer}`}>
                  <span className={styles.timeStatus}>
                    {formatDateTime({date: data?.createdDate, formatType: "dateTime"})}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default SendList;
