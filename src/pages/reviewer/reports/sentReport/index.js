import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import { Avatar } from "antd";
import ReactECharts from "echarts-for-react";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import EditButton from "../../../../images/adminUsers/EditButton";
import SpinnerDots from "../../../../components/spinner";
import Export from "../../../admin/report/Export";

export const colors = {
  A: "#8A2BE2",
  B: "#5F9EA0",
  C: "#8EE5EE",
  D: "#42426F",
  E: "#00BFFF",
  F: "#EEB4B4",
  G: "#FF4040",
  H: "#D2691E",
  I: "#4A766E",
  J: "#FF7F00",
  K: "#F08080",
  L: "#FF7256",
  M: "#FFA500",
  N: "#FF2400",
  O: "#FFB5C5",
  P: "#CD919E",
  Q: "#FF6347",
  R: "#E35BD8",
  S: "#E066FF",
  T: "#EAADEA",
  U: "#FFB90F",
  V: "#EEE9BF",
  W: "#EEEE00",
  X: "#CD0000",
  Y: "#CD8500",
  Z: "#607B8B",
};
const SentReport = ({ details, onSentPageChange, paginationFirst }) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [reportActiveTab, setReportActiveTab] = useState("Supervisor");

  const handleTabs = (tab) => {
    setReportActiveTab(tab);
  };
  const hashes = selectedUsers.map((user) => {
    const hash = (user?.userDetails?.firstName.charCodeAt(0) % 6) + 1;
    return hash;
  });

  const getChartOption = (res) => {
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"],
          label: {
            show: false,
            position: "inside",
            formatter: "{b}: {c}",
          },
          data: [
            {
              value: 10,
              name: "Excel",
              itemStyle: {
                color: "#B35CE1",
              },
            },
            {
              value: 20,
              name: "Csv",
              itemStyle: {
                color: "#0A9FFF",
              },
            },
          ],
        },
        {
          type: "pie",
          radius: ["0%", "30%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: `{b|${60}}`,
            backgroundColor: "transparent",

            rich: {
              a: {
                fontSize: 12,
              },
              b: {
                fontSize: 18,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 90,
              name: "Total",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };

  const getChartUserOption = () => {
    const getRandomColor = (letter) =>
      colors[letter.toUpperCase()] || "#B35CE1";

    const data = [
      { value: 10, name: "Benjamin " },
      { value: 20, name: " Micheal" },
      { value: 20, name: "kack" },
      { value: 20, name: "johan " },
      { value: 20, name: "Tset" },
    ];

    const nameColors = {};

    data.forEach((item) => {
      const firstLetter = item.name[0];

      if (!nameColors[item.name]) {
        nameColors[item.name] = getRandomColor(firstLetter);
      }
    });
    const pieData = data.map((item) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: nameColors[item.name],
      },
    }));

    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"],
          label: {
            show: false,
            position: "inside",
            formatter: "{b}: {c}",
          },
          data: pieData,
        },
        {
          type: "pie",
          radius: ["0%", "30%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: `{b|${60}}`,
            backgroundColor: "transparent",
            rich: {
              a: {
                fontSize: 12,
              },
              b: {
                fontSize: 18,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 90,
              name: "Total",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };

  const getChartAdminOption = () => {
    const getRandomColor = (letter) =>
      colors[letter.toUpperCase()] || "#B35CE1";

    const data = [
      { value: 10, name: "Benjamin Mitchell" },
      { value: 20, name: "David Micheal" },
      { value: 20, name: "Richard William" },
      { value: 20, name: "Thomas Joseph" },
      { value: 20, name: "Andrew paul" },
    ];

    const nameColors = {};

    data.forEach((item) => {
      const firstLetter = item.name[0];

      if (!nameColors[item.name]) {
        nameColors[item.name] = getRandomColor(firstLetter);
      }
    });

    const pieData = data.map((item) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: nameColors[item.name],
      },
    }));

    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        show: false,
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"],
          label: {
            show: false,
            position: "inside",
            formatter: "{b}: {c}",
          },
          data: pieData,
        },
        {
          type: "pie",
          radius: ["0%", "30%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "center",
            formatter: `{b|${60}}`,
            backgroundColor: "transparent",
            rich: {
              a: {
                fontSize: 12,
              },
              b: {
                fontSize: 18,
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 90,
              name: "Total",
              itemStyle: {
                color: "#fff",
              },
            },
          ],
        },
      ],
    };
  };

  const selectedChartOption =
    reportActiveTab === "Supervisor"
      ? getChartUserOption()
      : getChartAdminOption();

  useEffect(() => {
    if (details?.data && details.data.length > 0) {
      handleCardSelection(details.data[0], 0);
    }
  }, [details]);

  const handleCardSelection = (item, index) => {
    setSelectedCardIndex(index);
    setSelectedCard(item);
  };

  const closeModal = () => {
    setOpenEdit(false);
  };

  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
                  <div className="col-xl-6">
                    {!details?.data ? (
                      <SpinnerDots />
                    ) : (
                      <div className={styles.cardContainer}>
                        {details?.data?.map((item, index) => {
                          const formattedDate = dateFormate(
                            dayjs,
                            item?.sendDate
                          );
                          return (
                            <div
                              key={index}
                              className={`${styles.card} ${
                                index === selectedCardIndex
                                  ? styles.selectedCard
                                  : ""
                              }`}
                              onClick={() => handleCardSelection(item, index)}
                            >
                              <div className={styles.contentGroup}>
                                <div className="col-xl-12">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div className={`col-xl-6 ${styles.pName}`}>
                                      {item.reportName}
                                    </div>
                                    <div
                                      className={`col-xl-2 ${styles.dataContainer}`}
                                    >
                                      <div
                                        onClick={() => {
                                          setSelectedRows(item);
                                          setOpenEdit(true);
                                        }}
                                      >
                                        <EditButton />
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div
                                      className={`col-xl-12 ${styles.headText}`}
                                    >
                                      {item._id}
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className={`col-xl-2 ${styles.text}`}>
                                      {formattedDate}
                                    </div>
                                    <div className={`col-xl-4 ${styles.text}`}>
                                      <Avatar.Group maxCount={2}>
                                        {item?.receivedUsers?.map(
                                          (data, index) =>
                                            selectedCard?.receivedUsers
                                              .length === 1 ? (
                                              <div
                                                key={index}
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <span
                                                  style={{ marginRight: "5px" }}
                                                >
                                                  {renderUserPrfoileAvatar(
                                                    data?.userDetails
                                                      ?.firstName,
                                                    data?.userDetails?.lastName,
                                                    data?.userDetails
                                                      ?.profileImageUrl,
                                                    "header"
                                                  )}
                                                </span>
                                                <span>
                                                  {data?.userDetails?.firstName}{" "}
                                                  {data?.userDetails?.lastName}
                                                </span>
                                              </div>
                                            ) : (
                                              <div key={index}>
                                                {data?.userDetails
                                                  ?.profileImageUrl && (
                                                  <Avatar
                                                    style={{
                                                      objectFit: "unset",
                                                    }}
                                                    src={
                                                      data.userDetails
                                                        .profileImageUrl
                                                    }
                                                  />
                                                )}
                                              </div>
                                            )
                                        )}
                                      </Avatar.Group>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                    <div className={styles.cardContainer}>
                      <div className={styles.card1}>
                        <div className={styles.summaryText}>Summary</div>
                        <div className="col-xl-12  d-flex mt-4">
                          <div className={`col-xl-6 ${styles.sentSubCard}`}>
                            <div>
                              <div>Overall Reports Sent</div>
                              <h4>80</h4>
                            </div>
                          </div>
                          <div className={`col-xl-6 ${styles.sentSubCard}`}>
                            <div>Overall Users</div>
                            <h4>140</h4>
                          </div>
                        </div>
                        <div className="col-xl-12  d-flex mt-4">
                          <div className={`col-xl-6 ${styles.readSubCard}`}>
                            <div>
                              <div>No of Read</div>
                              <h4>60</h4>
                            </div>
                          </div>
                          <div className={`col-xl-6 ${styles.downloadSubCard}`}>
                            <div>
                              <div>No of Download</div>
                              <h4>20</h4>
                            </div>
                          </div>
                        </div>
                        <div className={styles.summaryText}>Overall Chart</div>

                        <div
                          className={` ${styles.card} justify-content-between p-2 m-2`}
                        >
                          <div className="d-flex justify-content-end">
                            <div className={styles.userContainer}>
                              <div className={styles.user}>
                                <button
                                  className={
                                    reportActiveTab === "Supervisor"
                                      ? `${styles.active}`
                                      : ""
                                  }
                                  onClick={() => {
                                    handleTabs("Supervisor");
                                  }}
                                >
                                  Supervisor
                                </button>
                                <button
                                  className={
                                    reportActiveTab === "Admin"
                                      ? `${styles.active}`
                                      : ""
                                  }
                                  onClick={() => {
                                    handleTabs("Admin");
                                  }}
                                >
                                  Admin
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className=" d-flex justify-content-between p-2 m-2">
                            <div style={{ width: "50%" }}>
                              <div
                                className={styles.summaryText}
                                style={{ textAlign: "center" }}
                              >
                                Report Type
                              </div>
                              <ReactECharts
                                option={getChartOption()}
                                style={{ height: "230px" }}
                              />
                            </div>
                            <div style={{ width: "50%" }}>
                              <div
                                className={styles.summaryText}
                                style={{ textAlign: "center" }}
                              >
                                Users
                              </div>

                              <ReactECharts
                                option={selectedChartOption}
                                style={{ height: "230px" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={7}
          totalRecords={details?.totalElements}
          onPageChange={onSentPageChange}
        />
        <div className="total-pages">
          Total count: {details?.totalElements > 0 ? details?.totalElements : 0}
        </div>
      </div>
      {openEdit && (
        <Export
          isModalVisible={openEdit}
          closeModal={closeModal}
          setIsModalVisible={setOpenEdit}
          setSelectedRows={setSelectedRows}
          setSelectAll={setSelectAll}
          selectedRows={selectedRows}
          isSent={true}
        />
      )}
    </>
  );
};

export default SentReport;
