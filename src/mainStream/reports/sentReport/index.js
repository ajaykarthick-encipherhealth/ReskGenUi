import React, { useState, useEffect } from "react";
import styles from "../../../resusablereport/reports/report.module.css";
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
    console.log(details?.receivedReportDTOList?.data, "rece");
  }, [details]);

  const handleCardSelection = (item, index) => {
    setSelectedCardIndex(index);
    setSelectedCard(item);
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
                <div className=" col-xl-12 d-flex">
                  <div className="col-xl-6">
                    {!details?.receivedReportDTOList?.data ? (
                      <SpinnerDots />
                    ) : (
                      <div>
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
                          <Empty />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-xl-6" style={{ marginLeft: "10px" }}>
                    {!details?.receivedReportDTOList?.data ? (
                      <SpinnerDots />
                    ) : (
                      <div className={styles.cardContainer}>
                        <div className={styles.card2}>
                          <div className={styles.summaryText}>Summary</div>
                          <div className="col-xl-12  d-flex mt-4">
                            <OverallReportsSection
                              totalReports={
                                details?.receivedReportDTOList?.totalElements
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
