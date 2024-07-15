import React, { useState, useEffect } from "react";
import styles from "../report.module.css";
import { useRouter } from "next/router";
import { Empty } from "antd";
import ReactECharts from "echarts-for-react";
import { useDispatch } from "react-redux";
import SpinnerDots from "../../../components/spinner";
import Export from "../Export";
import { selectedReport } from "../../../store/actions/adminAction/ReportActions";
import CardComponent from "../../../mainStream/components/cards/miniGroupCard";
import {
  AccessCountSection,
  OverallReportsSection,
  OverallUsersSection,
} from "../../../mainStream/components/subMiniCard";
import CustomTable from "../../../mainStream/components/customTable";
import { color } from "highcharts";
import {
  colors,
  getChartOption,
  getChartUserOption,
  getChartAdminOption,
} from "../../../mainStream/components/chartUtils";
import TabSwitcher from "../../components/tabSwitch";
import Pagination from "../../components/pagination";

const SentReport = ({
  details,
  onSentPageChange,
  paginationFirst,
  receivedPageNo,
  receivedStartDate,
  receivedEndDate,
  loader,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [reportActiveTab, setReportActiveTab] = useState("Supervisor");

  const handleTabs = (tab) => {
    setReportActiveTab(tab);
  };

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

  const nameColors = {};
  const getRandomColor = (letter) => colors[letter.toUpperCase()] || "#B35CE1";
  datas?.forEach((item) => {
    const firstLetter = item?.name[0];

    if (!nameColors[item?.name]) {
      nameColors[item?.name] = getRandomColor(firstLetter);
    }
  });
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

  useEffect(() => {
    if (
      details?.receivedReportDTOList?.data &&
      details?.receivedReportDTOList?.data > 0
    ) {
      handleCardSelection(details?.receivedReportDTOList?.data[0], 0);
    }
  }, [details]);

  const handleCardSelection = (item, index) => {
    setSelectedCardIndex(index);
  };

  const closeModal = () => {
    setOpenEdit(false);
  };
  const options = getChartOption(details);
  const userOptions = getChartUserOption(details);
  const adminOptions = getChartAdminOption(details);
  const selectedChartOption =
    reportActiveTab === "Supervisor" ? userOptions : adminOptions;
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
                    <div className={`col-xl-6 ${styles.cardDiv}`}>
                      <div className={styles.cardContainer}>
                        {details?.receivedReportDTOList?.data?.length > 0 ? (
                          details?.receivedReportDTOList?.data.map(
                            (item, index) => (
                              <CardComponent
                                key={index}
                                data={details?.receivedReportDTOList?.data}
                                selectedCardIndex={selectedCardIndex}
                                handleReceiverReport={handleReceiverReport}
                                setSelectedRows={setSelectedRows}
                                dispatch={dispatch}
                                selectedReport={selectedReport}
                                setOpenEdit={setOpenEdit}
                                styles={styles}
                                item={item}
                                index={index}
                              />
                            )
                          )
                        ) : (
                          <div className={styles.card}>
                            <Empty />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                      <div className={styles.cardContainer}>
                        <div className={styles.card2}>
                          <div className={styles.summaryText}>Summary</div>
                          <div className="col-xl-12  d-flex mt-4">
                            <OverallReportsSection
                              totalReports={
                                details?.receivedReportDTOList?.totalElements
                              }
                              styles={styles}
                              isSent={true}
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
                          {/* <div
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
                          </div> */}
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
      {details?.receivedReportDTOList?.data?.length > 0 ? (
        <Pagination
          first={receivedPageNo === 0 ? 0 : paginationFirst}
          totalRecords={details?.receivedReportDTOList?.totalElements}
          onPageChange={onSentPageChange}
        />
      ) : null}

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
