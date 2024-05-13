import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { Paginator } from "primereact/paginator";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../../components/headerFilters/functions";
import { colors } from "../sentReport";

const ReceivedReport = ({ details, onPageChange, paginationFirst }) => {
  const [detailsContent, setDetailsContent] = useState(details?.content);
  const [reportActiveTab, setReportActiveTab] = useState("Supervisor");
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
    setDetailsContent(details?.content);
  }, [details]);

  const router = useRouter();
  const handleTabs = (tab) => {
    setReportActiveTab(tab);
  };

  const accessTemplate = (item) => {
    switch (item?.role) {
      case "READ":
        return <span className={styles.readStyle}>Read</span>;

      case "DOWNLOAD":
        return <span className={styles.downloadStyle}>Download</span>;

      default:
        return null;
    }
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
                    <div className={styles.cardContainer}>
                      <div className={styles.cardContainer}>
                        {detailsContent?.map((item, index) => {
                          const formattedDate = dateFormate(
                            dayjs,
                            item?.receiveDate
                          );
                          return (
                            <div key={index} className={styles.card}>
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

                                    <div className={`col-xl-2 `}>
                                      {accessTemplate(item)}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      paddingBottom: "5px",
                                    }}
                                  >
                                    <div
                                      className={`col-xl-8 ${styles.headText}`}
                                    >
                                      {item.id}
                                    </div>
                                    <div
                                      className={`col-xl-4 ${styles.headText}`}
                                    >
                                      {item.repotee}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div className={`col-xl-2 ${styles.text}`}>
                                      {formattedDate}
                                    </div>
                                    <div className={`col-xl-4 ${styles.text}`}>
                                      {item.senderDetails?.firstName ||
                                      item.senderDetails?.lastName ||
                                      item?.senderDetails?.profileImageUrl ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {" "}
                                          <span style={{ marginRight: "10px" }}>
                                            {" "}
                                            {renderUserPrfoileAvatar(
                                              item.senderDetails?.firstName,
                                              item.senderDetails?.lastName,
                                              item?.senderDetails
                                                ?.profileImageUrl,
                                              "header"
                                            )}
                                          </span>
                                          <span>
                                            {item.senderDetails?.firstName}{" "}
                                            {item.senderDetails?.lastName}
                                          </span>
                                        </div>
                                      ) : (
                                        <div style={{ textAlign: "center" }}>
                                          ---
                                        </div>
                                      )}

                                      <span>
                                        {item.firstName} {item.lastName}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
          rows={15}
          totalRecords={details?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count: {details?.totalElements > 0 ? details?.totalElements : 0}
        </div>
      </div>
    </>
  );
};

export default ReceivedReport;
