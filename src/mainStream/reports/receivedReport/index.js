import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { useRouter } from "next/router";
import ReactECharts from "echarts-for-react";
import SpinnerDots from "../../../components/spinner";
import { Empty } from "antd";
import { selectedReport } from "../../../store/actions/adminAction/ReportActions";
import { useDispatch } from "react-redux";
import TabSwitcher from "../../../mainStream/components/tabSwitch";
import {
  AccessCountSection,
  OverallReportsSection,
  OverallUsersSection,
} from "../../../mainStream/components/subMiniCard";
import CustomTable from "../../../mainStream/components/customTable";
import { color } from "highcharts";

import {
  getChartOption,
  getChartUserOption,
  getChartAdminOption,
} from "../../../mainStream/components/chartUtils";
import GroupCard from "../../../mainStream/components/cards/groupCard";
import Pagination from "../../components/pagination";
const ReceivedReport = ({
  details,
  onPageChange,
  paginationFirst,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  loader,
}) => {
  const dispatch = useDispatch();
  const [reportActiveTab, setReportActiveTab] = useState("Supervisor");

  useEffect(() => {
    if (details?.reportStatusDTOList && details?.reportStatusDTOList > 0) {
      handleCardSelection(details?.reportStatusDTOList[0], 0);
    }
  }, [details]);

  const router = useRouter();
  const handleTabs = (tab) => {
    setReportActiveTab(tab);
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
  const options = getChartOption(details);
  const userOptions = getChartUserOption(details);
  const adminOptions = getChartAdminOption(details);
  const selectedChartOption =
    reportActiveTab === "Supervisor" ? userOptions : adminOptions;
  const excelCount =
    details?.sentReportCountByTypeDTOList?.find((item) => item._id === "EXCEL")
      ?.count || 0;
  const csvCount =
    details?.sentReportCountByTypeDTOList?.find((item) => item._id === "CSV")
      ?.count || 0;
  const countValues = [
    {
      name: "Excel",
      value: excelCount,
      color: "#B35CE1",
    },
    {
      name: "Csv",
      value: csvCount,
      color: "#0A9FFF",
    },
  ];
  const data =
    details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForSupervisor?.map(
      (item) => ({
        value: item.userCount,
        name: `${item.userNameDTO?.firstName} ${item.userNameDTO?.lastName}`,
      })
    );
  const datas =
    details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForAdmin?.map(
      (item) => ({
        value: item?.userCount,
        name: `${item?.userNameDTO?.firstName} ${item?.userNameDTO?.lastName}`,
      })
    );

  return (
    <>
      <div>
        <div className="content-body">
          <div className="container-fluid py-4 px-2">
            <div className="row">
              <div>
                {loader ? (
                  <SpinnerDots />
                ) : (
                  <div className=" col-xl-12 d-flex">
                    <div className="col-xl-5">
                      <div style={{ height: "100%" }}>
                        {details?.reportStatusDTOList.content.length > 0 ? (
                          details?.reportStatusDTOList.content.map(
                            (item, index) => (
                              <GroupCard
                                key={item?.id}
                                data={details?.reportStatusDTOList.content}
                                handleReceiverReport={handleReceiverReport}
                                dispatch={dispatch}
                                selectedReport={selectedReport}
                                styles={styles}
                                item={item}
                                index={index}
                              />
                            )
                          )
                        ) : (
                          <div className={`col-xl-12 ${styles.emptyCard}`}>
                            <Empty />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-7" style={{ marginLeft: "10px" }}>
                      <div className={styles.cardContainer}>
                        <div className={styles.card2}>
                          <div className={styles.summaryText}>Summary</div>
                          <div className="col-xl-12  d-flex mt-4">
                            <OverallReportsSection
                              totalReports={
                                details?.reportStatusDTOList?.totalElements
                              }
                              styles={styles}
                            />
                            <OverallUsersSection
                              totalUsers={details?.overAllUsersCount}
                              styles={styles}
                            />

                            <AccessCountSection
                              data={details?.reportCountResponseByAccessDTO}
                              styles={styles}
                            />
                          </div>

                          <div
                            className={styles.summaryText}
                            style={{ marginTop: "10px" }}
                          >
                            Overall Chart
                          </div>

                          <div
                            className={` ${styles.card3} justify-content-between p-2 m-2`}
                          >
                            <div>
                              <div style={{ width: "100%" }}>
                                <div
                                  className={styles.summaryText}
                                  style={{ paddingLeft: "10px" }}
                                >
                                  Report Type
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <ReactECharts
                                      option={options}
                                      style={{ height: "230px" }}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <CustomTable
                                      data={countValues}
                                      head1={"Type"}
                                      head2={"Count"}
                                      color={color}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={` ${styles.card4} justify-content-between p-2 m-2`}
                          >
                            <div className="d-flex justify-content-between mb-5">
                              <div
                                className={styles.summaryText}
                                style={{ paddingLeft: "10px" }}
                              >
                                Users
                              </div>

                              <TabSwitcher
                                activeTab={reportActiveTab}
                                handleTabs={handleTabs}
                                styles={styles}
                              />
                            </div>
                            <div style={{ width: "100%" }}>
                              <div className="row">
                                <div className="col-md-6">
                                  <ReactECharts
                                    option={selectedChartOption}
                                    style={{ height: "230px" }}
                                  />
                                </div>
                                <div className="col-md-6">
                                  {reportActiveTab === "Supervisor" ? (
                                    <div
                                      style={{
                                        height: "200px",
                                        overflow: "scroll",
                                      }}
                                    >
                                      <CustomTable
                                        data={data}
                                        styles={styles}
                                        head1={"Supervisor"}
                                        head2={"Count"}
                                      />
                                    </div>
                                  ) : (
                                    <CustomTable
                                      data={datas}
                                      styles={styles}
                                      head1={"Admin"}
                                      head2={"Count"}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
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

      <Pagination
        first={paginationFirst}
        totalRecords={details?.reportStatusDTOList?.totalElements}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ReceivedReport;
