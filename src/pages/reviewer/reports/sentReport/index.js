import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { Paginator } from "primereact/paginator";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Avatar, Col, Row, Tooltip, Empty } from "antd";
import { workStatusApiAdmin } from "../../../../services/adminServices/DashboardService";
import ReactECharts from "echarts-for-react";

import {
  dateFormate,
  getBackgroundColor,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../../components/headerFilters/functions";
import EditButton from "../../../../images/adminUsers/EditButton";
import { IMAGES } from "src/jsx/constant/theme.js";
import SpinnerDots from "../../../../components/spinner";
import Export from "../../../admin/report/Export";
import TableStyle from "../../../../components/table/table.module.css";
import { selectedReport } from "../../../../store/actions/adminAction/ReportActions";
import { useSelector } from "react-redux";
import { getFlag } from "../../../../components/reuseableFunctions";

const SentReport = ({
  details,
  onSentPageChange,
  paginationFirst,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  isPhysician,
  isAdmin,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const DateRanges = useSelector((state) => state?.workFlow?.dateRange);
  const [dateRange, setDateRange] = useState({
    processedStatus: {
      PENDING: 0,
      COMPLETED: 0,
      HOLD: 0,
      DECLINED: 0,
    },
    auditedStatus: {
      AUDIT_PENDING: 0,
      DECLINED: 0,
      AUDITED: 0,
      AUDITHOLD: 0,
    },
  });
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

  const getChartUserOption = (res) => {
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
  const getChartAdminOption = (res) => {
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
              name: "priuy",
              itemStyle: {
                color: "#B35CE1",
              },
            },
            {
              value: 20,
              name: "priya",
              itemStyle: {
                color: "#0A9FFF",
              },
            },
            {
              value: 10,
              name: "sneha",
              itemStyle: {
                color: "#B35CE1",
              },
            },
            {
              value: 20,
              name: "john",
              itemStyle: {
                color: "#0A9FFF",
              },
            },
            {
              value: 10,
              name: "test",
              itemStyle: {
                color: "#B35CE1",
              },
            },
            {
              value: 20,
              name: "jk",
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
  const selectedChartOption =
    reportActiveTab === 'Supervisor' ? getChartUserOption() : getChartAdminOption();  
  const mostCommonHash = getBackgroundColor(hashes);

  const startDate = DateRanges?.startDate
    ? new Date(DateRanges?.startDate).toISOString()
    : "";
  const endDate = DateRanges?.endDate
    ? new Date(DateRanges?.endDate).toISOString()
    : "";
  const getWorkFlow = async () => {
    try {
      const data = await workStatusApiAdmin(startDate, endDate, router);
      setDateRange(data.response?.processedStatusCount);
      // setChartValue(d;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWorkFlow();
  }, [startDate, endDate, router]);
  useEffect(() => {
    // Automatically select the first card and display its content on mount
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
  const handleReceiverReport = (item) => {
    const info = {
      reportUser: item,
      receivedPageNo: receivedPageNo,
      receivedStartDate: receivedStartDate,
      receivedEndDate: receivedEndDate,
    };
    dispatch(selectedReport(info));
    isPhysician
      ? router?.push(
          `/reviewer/report/individualreport?reportId=${
            item?._id
          }&sentreport=${true}&page=${receivedPageNo}&limit=${paginationFirst}`
        )
      : router?.push(
          `/admin/report/individualreport?reportId=${
            item?._id
          }&sentreport=${true}&isAdmin=${isAdmin}&page=${receivedPageNo}&limit=${paginationFirst}`
        );
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
                          <div className={`col-xl-6 ${styles.sentSubCard}`}>
                            <div>
                              <div>No of Read</div>
                              <h4>60</h4>
                            </div>
                          </div>
                          <div className={`col-xl-6 ${styles.sentSubCard}`}>
                            <div>
                              <div>No of Download</div>
                              <h4>20</h4>
                            </div>
                          </div>
                        </div>
                        <div className={styles.summaryText}>Overall Chart</div>

                        <div
                          className={`d-flex ${styles.card}`}
                          style={{
                            justifyContent: "space-between",
                            padding: "45px",
                            margin:"30p"
                          }}
                        >
                        

                          <div style={{ width: '50%' }}>
      <div className={styles.summaryText} style={{ textAlign: 'center' }}>
        Report Type
      </div>
      <ReactECharts option={getChartOption()} style={{ height: '230px' }} />
    </div>
    <div style={{ width: '50%' }}>
      <div style={{ display: 'flex' }}>
        <div className={styles.summaryText}>Users</div>
        <div className={styles.userContainer}>
          <div className={styles.user}>
            <button
              className={reportActiveTab === 'Supervisor' ? `${styles.active}` : ''}
              onClick={() => {
                handleTabs('Supervisor');
              }}
            >
              Supervisor
            </button>
            <button
              className={reportActiveTab === 'Admin' ? `${styles.active}` : ''}
              onClick={() => {
                handleTabs('Admin');
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <ReactECharts option={selectedChartOption} style={{ height: '230px' }} />
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
