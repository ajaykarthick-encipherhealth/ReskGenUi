import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { Paginator } from "primereact/paginator";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../components/headerFilters/functions";
import { colors } from "../sentReport";
import SpinnerDots from "../../../components/spinner";
import { Empty } from "antd";
import { selectedReport } from "../../../store/actions/adminAction/ReportActions";
import { useDispatch } from "react-redux";

const ReceivedReport = ({
  details,
  onPageChange,
  paginationFirst,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
}) => {
  const dispatch = useDispatch();
  const [reportActiveTab, setReportActiveTab] = useState("Supervisor");
  const getChartOption = (data) => {
    const excelCount =
      details?.sentReportCountByTypeDTOList?.find(
        (item) => item._id === "EXCEL"
      )?.count || 0;
    const csvCount =
      details?.sentReportCountByTypeDTOList?.find((item) => item._id === "CSV")
        ?.count || 0;

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
              value: excelCount,
              name: "Excel",
              itemStyle: {
                color: excelCount ? "#B35CE1" : "#d9d9d9",
              },
            },
            {
              value: csvCount,
              name: "Csv",
              itemStyle: {
                color: csvCount ? "#0A9FFF" : "#d9d9d9",
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
            formatter: `{b|${excelCount + csvCount}}`,
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
              value: excelCount + csvCount,
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

  const getChartUserOption = (response) => {
    const getRandomColor = (letter) =>
      colors[letter.toUpperCase()] || "#B35CE1";

    const data =
      details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForSupervisor?.map(
        (item) => ({
          value: item.userCount,
          name: `${item.userNameDTO?.firstName} ${item.userNameDTO?.lastName}`,
        })
      );

    const nameColors = {};

    data?.forEach((item) => {
      const firstLetter = item.name[0];

      if (!nameColors[item.name]) {
        nameColors[item.name] = getRandomColor(firstLetter);
      }
    });

    const pieData = data?.map((item) => ({
      value: item?.value,
      name: item?.name,
      itemStyle: {
        color: nameColors[item?.name],
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
            formatter: `{b|${data?.reduce(
              (acc, curr) => acc + curr.value,
              0
            )}}`,
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
              value: data?.reduce((acc, curr) => acc + curr.value, 0),
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

  const getChartAdminOption = (response) => {
    const getRandomColor = (letter) =>
      colors[letter.toUpperCase()] || "#B35CE1";

    const data =
      details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForAdmin?.map(
        (item) => ({
          value: item?.userCount,
          name: `${item?.userNameDTO?.firstName} ${item?.userNameDTO?.lastName}`,
        })
      );

    const nameColors = {};

    data?.forEach((item) => {
      const firstLetter = item.name[0];

      if (!nameColors[item.name]) {
        nameColors[item.name] = getRandomColor(firstLetter);
      }
    });

    const pieData = data?.map((item) => ({
      value: item?.value,
      name: item?.name,
      itemStyle: {
        color: nameColors[item?.name],
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
            formatter: `{b|${data?.reduce(
              (acc, curr) => acc + curr.value,
              0
            )}}`,
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
              value: data?.reduce((acc, curr) => acc + curr.value, 0),
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
    if (details?.reportStatusDTOList && details?.reportStatusDTOList > 0) {
      handleCardSelection(details?.reportStatusDTOList[0], 0);
    }
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
  const handleReceiverReport = (item) => {
    const info = {
      reportUser: item,
      receivedPageNo: receivedPageNo,
      receivedStartDate: receivedStartDate,
      receivedEndDate: receivedEndDate,
    };
    dispatch(selectedReport(info));
    const currentpath = localStorage.getItem("userRole");
    router?.push(
      `/${currentpath}/report/individualreport?reportId=${
        item?.reportId
      }&isAdminPage=${true}&page=${receivedPageNo}&limit=${paginationFirst}`
    );
  };
  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid py-4">
            <div className="row">
              <div>
                <div className=" col-xl-12 d-flex">
                  <div className="col-xl-6">
                    {!details?.reportStatusDTOList.content ? (
                      <SpinnerDots />
                    ) : (
                      <div className={styles.cardContainer}>
                        <div className={styles.cardContainer}>
                          {details?.reportStatusDTOList?.content?.length > 0 ? (
                            details?.reportStatusDTOList?.content?.map(
                              (item, index) => {
                                const formattedDate = dateFormate(
                                  dayjs,
                                  item?.receiveDate
                                );
                                return (
                                  <div key={index} className={styles.card}>
                                    <div className={styles.contentGroup}>
                                      <div className="col-xl-12 cr-pointer"
                                      onClick={() =>
                                        handleReceiverReport(item)
                                      }
                                       >
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            paddingBottom: "5px",
                                          }}
                                          
                                        >
                                          <div
                                            className={`col-xl-6 ${styles.pName}`}
                                           
                                          >
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
                                          <div
                                            className={`col-xl-2 ${styles.text}`}
                                          >
                                            {formattedDate}
                                          </div>
                                          <div
                                            className={`col-xl-4 ${styles.text}`}
                                          >
                                            {item.senderDetails?.firstName ||
                                            item.senderDetails?.lastName ||
                                            item?.senderDetails
                                              ?.profileImageUrl ? (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {" "}
                                                <span
                                                  style={{
                                                    marginRight: "10px",
                                                  }}
                                                >
                                                  {" "}
                                                  {renderUserPrfoileAvatar(
                                                    item.senderDetails
                                                      ?.firstName,
                                                    item.senderDetails
                                                      ?.lastName,
                                                    item?.senderDetails
                                                      ?.profileImageUrl,
                                                    "header"
                                                  )}
                                                </span>
                                                <span>
                                                  {
                                                    item.senderDetails
                                                      ?.firstName
                                                  }{" "}
                                                  {item.senderDetails?.lastName}
                                                </span>
                                              </div>
                                            ) : (
                                              <div
                                                style={{ textAlign: "center" }}
                                              >
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
                              }
                            )
                          ) : (
                            <div
                              className="d-flex justify-content-center align-items-center"
                              style={{ height: "700px" }}
                            >
                              <Empty />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                    {!details?.reportStatusDTOList?.content ? (
                      <SpinnerDots />
                    ) : (
                      <div className={styles.cardContainer}>
                        <div className={styles.card1}>
                          <div className={styles.summaryText}>Summary</div>
                          <div className="col-xl-12  d-flex mt-4">
                            <div className={`col-xl-6 ${styles.sentSubCard}`}>
                              <div>
                                <div>Overall Reports Sent</div>
                                <div className="fw-bold">
                                  {details?.reportStatusDTOList?.totalElements}
                                </div>
                              </div>
                            </div>
                            <div className={`col-xl-6 ${styles.sentSubCard}`}>
                              <div>Overall Users</div>
                              <div className="fw-bold">
                                {details?.overAllUsersCount}
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-12 d-flex mt-4">
                            {details?.reportCountResponseByAccessDTO?.map(
                              (item, index) => (
                                <React.Fragment key={index}>
                                  {item._id === "READ" && (
                                    <div
                                      className={`col-xl-6 ${styles.readSubCard}`}
                                    >
                                      <div>
                                        <div>No of Read</div>
                                        <div className="fw-bold">
                                          {item.roleCount}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {item._id === "DOWNLOAD" && (
                                    <div
                                      className={`col-xl-6 ${styles.downloadSubCard}`}
                                    >
                                      <div>
                                        <div>No of Download</div>
                                        <div className="fw-bold">
                                          {item.roleCount}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </React.Fragment>
                              )
                            )}
                          </div>

                          <div className={styles.summaryText}>
                            Overall Chart
                          </div>

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
                    )}
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
          totalRecords={details?.reportStatusDTOList?.totalElements}
          onPageChange={onPageChange}
        />
        <div className="total-pages">
          Total count:{" "}
          {details?.reportStatusDTOList?.totalElements > 0
            ? details?.reportStatusDTOList?.totalElements
            : 0}
        </div>
      </div>
    </>
  );
};

export default ReceivedReport;
