import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Popover, Avatar, Empty } from "antd";
import ReactECharts from "echarts-for-react";
import { useDispatch } from "react-redux";
import {
  dateFormate,
  renderUserPrfoileAvatar,
} from "../../../components/headerFilters/functions";
import EditButton from "../../../images/adminUsers/EditButton";
import SpinnerDots from "../../../components/spinner";
import Export from "../../../pages/admin/reports/Export";
import { selectedReport } from "../../../store/actions/adminAction/ReportActions";

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
  R: "#B9FF66",
  S: "#E066FF",
  T: "#EAADEA",
  U: "#FFB90F",
  V: "#EEE9BF",
  W: "#EEEE00",
  X: "#CD0000",
  Y: "#CD8500",
  Z: "#607B8B",
};
const SentReport = ({
  details,
  onSentPageChange,
  paginationFirst,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
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
                color: "#B35CE1",
              },
            },
            {
              value: csvCount,
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

  const chartOption = getChartOption(details?.sentReportCountByTypeDTOList);
  const handleReceiverReport = (item) => {
    const info = {
      reportUser: item,
      receivedPageNo: receivedPageNo,
      receivedStartDate: receivedStartDate,
      receivedEndDate: receivedEndDate,
    };
    dispatch(selectedReport(info));
    router?.push(
      `/supervisor/report/individualreport?reportId=${
        item?._id
      }&sentreport=${true}&page=${receivedPageNo}&limit=${paginationFirst}`
    );
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
    if (
      details?.receivedReportDTOList?.data &&
      details?.receivedReportDTOList?.data > 0
    ) {
      handleCardSelection(details?.receivedReportDTOList?.data[0], 0);
    }
    console.log(details?.receivedReportDTOList?.data, "rece");
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
                    {!details?.receivedReportDTOList?.data ? (
                      <SpinnerDots />
                    ) : (
                      <div className={styles.cardContainer}>
                        {details?.receivedReportDTOList?.data?.length > 0 ? (
                          details?.receivedReportDTOList?.data?.map(
                            (item, index) => {
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
                                  // onClick={() => handleCardSelection(item, index)}
                                  onClick={() => handleReceiverReport(item)}
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
                                        <div
                                          className={`col-xl-6 ${styles.pName}`}
                                        >
                                          {item.reportName}
                                        </div>
                                        <div
                                          className={`col-xl-2 ${styles.dataContainer}`}
                                        >
                                          <div
                                            onClick={() => {
                                              setSelectedRows(item);
                                              dispatch(selectedReport(item));
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
                                        <div
                                          className={`col-xl-2 ${styles.text}`}
                                        >
                                          {formattedDate}
                                        </div>
                                        <div
                                          className={`col-xl-4 ${styles.text}`}
                                        >
                                          <Avatar.Group maxCount={2}>
                                            {item?.receivedUsers?.map(
                                              (data, index) => (
                                                <Popover
                                                  key={index}
                                                  content={
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        flexDirection: "column",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          padding: "10px",
                                                        }}
                                                      >
                                                        {
                                                          data?.userDetails
                                                            ?.firstName
                                                        }{" "}
                                                        {
                                                          data?.userDetails
                                                            ?.lastName
                                                        }
                                                      </div>
                                                      {data?.userDetails
                                                        ?.profileImageUrl && (
                                                        <img
                                                          src={
                                                            data.userDetails
                                                              .profileImageUrl
                                                          }
                                                          alt="Profile"
                                                          style={{
                                                            maxWidth: "100px",
                                                            maxHeight: "100px",
                                                          }}
                                                        />
                                                      )}
                                                    </div>
                                                  }
                                                >
                                                  <div
                                                    style={{
                                                      display: "inline-block",
                                                      marginRight: "5px",
                                                    }}
                                                  >
                                                    {item.receivedUsers
                                                      .length === 1 && (
                                                      <div className="d-flex justify-content-center align-items-center">
                                                        <div
                                                          style={{
                                                            marginRight: "10px",
                                                          }}
                                                        >
                                                          {renderUserPrfoileAvatar(
                                                            data?.userDetails
                                                              ?.firstName,
                                                            data?.userDetails
                                                              ?.lastName,
                                                            data?.userDetails
                                                              ?.profileImageUrl,
                                                            "header"
                                                          )}
                                                        </div>

                                                        <div>
                                                          {
                                                            data?.userDetails
                                                              ?.firstName
                                                          }{" "}
                                                          {
                                                            data?.userDetails
                                                              ?.lastName
                                                          }
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </Popover>
                                              )
                                            )}
                                          </Avatar.Group>
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
                    )}
                  </div>

                  <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                    {!details?.receivedReportDTOList?.data ? (
                      <SpinnerDots />
                    ) : (
                      <div className={styles.cardContainer}>
                        <div
                          className={styles.card1}
                          style={{ height: "816 !important" }}
                        >
                          <div className={styles.summaryText}>Summary</div>
                          <div className="col-xl-12  d-flex mt-4">
                            <div className={`col-xl-6 ${styles.sentSubCard}`}>
                              <div>
                                <div>Overall Reports Sent</div>
                                <div className="fw-bold">
                                  {
                                    details?.receivedReportDTOList
                                      ?.totalElements
                                  }
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
          rows={7}
          totalRecords={details?.receivedReportDTOList?.totalElements}
          onPageChange={onSentPageChange}
        />
        <div className="total-pages">
          Total count:{" "}
          {details?.receivedReportDTOList?.totalElements > 0
            ? details?.receivedReportDTOList?.totalElements
            : 0}
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
