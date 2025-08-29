import { connect } from "react-redux";
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import AppChart from "../../component/appchart";
import {
  getFormattedChartData,
  getTotalChart,
  useHasMounted,
  useWindowWidth,
  WorkflowWidget,
} from "../../component/function";
import AccuracyChart from "../../component/accuracyChart";
import StatCard from "../../component/statChart";
import processing from "../../../../images/tenantAdmin/processing.svg";
import failed from "../../../../images/tenantAdmin/failed.svg";
import completed from "../../../../images/tenantAdmin/completed.svg";
import Buttonscroller from "../../../../components/buttonSroller";
import upload from "../../../../images/tenantAdmin/upload.svg";
import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Notifications from "../../component/notifications";
import Image from "next/image";
import { getColSpan } from "../../component/function";
import { getRowSpan } from "../../component/function";
import { getLocalStored } from "../../../../utils/storages";
import EmptyComponent from "../../component/empty/EmptyComponent";
import styles from "../../reviewerStyles.module.css";
import accuracy from "../../../../images/dashboard/accuracy.png";
import actions from "../../../../stores/admin/dashboard1/actions";
import moment from "moment";
import CardSkeleton from "../../../../components/skeleton/card";
import {
  getColorValue,
  getStatusColor,
  getRoleColor,
  getLast7Days,
  getLast30Days,
} from "../../../../utils/reusable";
import uploadContainer from "../../../../images/dashboard/uploadContainer.png";
import processingContainer from "../../../../images/dashboard/processingContainer.png";
import completedContainer from "../../../../images/dashboard/completedContainer.png";
import failedContainer from "../../../../images/dashboard/failedContainer.png";
import { companyDeatils } from "../../../../utils/config";

const statCardsData = [
  {
    icon: upload,
    title: "Upload",
    value: 293,
    bgColor: "#ecebff",
    iconColor: "#d0ccff",
  },
  {
    icon: processing,
    title: "Processing",
    value: 4,
    bgColor: "#eae9f6",
    iconColor: "#d0ccff",
  },
  {
    icon: completed,
    title: "Completed",
    value: 293,
    bgColor: "#d6ffda",
    iconColor: "#adffb5",
  },
  {
    icon: failed,
    title: "Failed",
    value: 4,
    bgColor: "#ffeae0",
    iconColor: "#ffdbcc",
  },
];

const TabButtons = [
  {
    id: 1,
    title: companyDeatils == "riskgenai" ? "AI Quality " : "CogentAI Accuracy",
  },
  {
    id: 2,
    title: "Organization Quality",
  },
];

const dummyData = [
  {
    id: 1,
    content: "Test notification 1 from dummy",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Priya",
      lastName: "V",
      role: "Developer",
    },
  },
  {
    id: 2,
    content: "System update scheduled",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Rahul",
      lastName: "Sharma",
      role: "Admin",
    },
  },
];

const organizationData = [
  { name: "3Gen", value: 0 },
  { name: "Encipher Health", value: 1 },
  { name: "Change Healthcare", value: 2 },
  { name: "Vanguard", value: 3 },
  { name: "3M Health Information Systems", value: 4 },
];

const orgData =
  organizationData.map((org, index) => ({
    name: org.name,
    value: org.value,
    itemStyle: {
      color: [
        getColorValue("1"),
        getColorValue("2"),
        getColorValue("3"),
        getColorValue("4"),
        getColorValue("5"),
        getColorValue("6"),
        getColorValue("7"),
      ][index % 10],
    },
  })) || [];

const getCharts = ({
  type,
  chartType,
  pagesLoader,
  isOrgModalOpen,
  setIsOrgModalOpen,
  showModal,
  handleOk,
  handleCancel,
  handleTabButtonClick,
  currentTabBtn,
  activeTabButton,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  coder1StatusCountData,
  coder1StatusCountDataLoading,
  coder2StatusCountData,
  coder2StatusCountDataLoading,
  qaStatusCountData,
  qaStatusCountDataLoading,
  projectLeadStatusCountData,
  projectLeadStatusCountDataLoading,
  ownerStatusCountData,
  ownerStatusCountDataLoading,
  qaLeadStatusCountData,
  qaLeadStatusCountDataLoading,
  usersStatusCountData,
  usersStatusCountDataLoading,
  accuracyData,
  accuracyDataLoading,
  dates,
}) => {
  switch (type) {
    case "OrgPieChartInfo":
      const {
        categories: OrgPieChartCategories,
        formattedSeries: OrgPieChartFormatted,
        height: OrgPieChartHeight,
        legendData: OrePieChartLegendData,
      } = getFormattedChartData(orgData, chartType);
      return pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={OrgPieChartCategories}
          series={OrgPieChartFormatted}
          legendData={OrePieChartLegendData}
          height={300}
          showLegend={true}
          radius={["55%", "60%"]}
          showLabel={true}
          isOrgModalOpen={isOrgModalOpen}
          setIsOrgModalOpen={setIsOrgModalOpen}
          showModal={showModal}
          handleOk={handleOk}
          handleCancel={handleCancel}
          xAxisInterval={8}
          xAxisRotated ={true}
        />
      );
    case "WorkFlowFiles":
      const {
        computedFiles = 0,
        failedFiles = 0,
        processingFiles = 0,
        uploadedFiles = 0,
        computedStats = [],
        failedStats = [],
        processingStats = [],
      } = filesCountData || [];
      const statCardsData = [
        {
          icon: upload,
          title: "AI Upload",
          value: uploadedFiles || 0,
          bgColor: uploadContainer,
          iconColor: "#d0ccff",
        },
        {
          icon: processing,
          title: "AI Processing",
          value: processingFiles || 0,
          bgColor: processingContainer,
          iconColor: "#d0ccff",
        },
        {
          icon: completed,
          title: "AI Completed",
          value: computedFiles || 0,
          bgColor: completedContainer,
          iconColor: "#adffb5",
        },
        {
          icon: failed,
          title: "AI Failed",
          value: failedFiles || 0,
          bgColor: failedContainer,
          iconColor: "#ffdbcc",
        },
      ];
      const categories = computedStats.map((item) =>
        moment(item.date).format("MMM DD")
      );
      const series = [
        {
          name: "Completed",
          data: computedStats || [],
          color: getColorValue("5"),
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
        {
          name: "Processing",
          data: processingStats || [],
          color: getColorValue("7"),
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
        {
          name: "Failed",
          data: failedStats || [],
          color: getColorValue("1"),
          plotConfig: {
            key: "date",
            value: "count",
            dates: dates,
          },
        },
      ];
      return (
        <>
          <div className="d-flex justify-content-between flex-wrap gap-3">
            {statCardsData.map((card) =>
              filesCountDataLoading || pagesLoader ? (
                <CardSkeleton count={1} height={70} />
              ) : (
                <StatCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  bgColor={card.bgColor}
                  padding="16px"
                  minWidth="220px"
                  gap="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="14px"
                  height="63px"
                  fontSize="20px"
                  fontWeight={700}
                  backgroundColor={card.iconColor}
                  textColor={"white"}
                  textAlign={"center"}
                  border="4px solid #B3B3B3"
                />
              )
            )}
          </div>
          {filesCountDataLoading || pagesLoader ? (
            <div className="m-4">
              <CardSkeleton count={1} height={200} />
            </div>
          ) : (
            <AppChart type={chartType} categories={dates} series={series} />
          )}
        </>
      );

    case "AllocatedStatus":
      const allocatedSeries = [
        {
          name: "Allocated",
          value: allocatedStatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Not Allocated",
          value: allocatedStatusCountData?.notAllocatedCount || 0,
          color: getStatusColor("2"),
        },
      ];

      const {
        categories: allocatedCategories,
        formattedSeries: allocatedFormatted,
        height: allocatedHeight,
      } = getFormattedChartData(allocatedSeries, chartType);

      return allocatedStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={allocatedCategories}
          series={allocatedFormatted}
          height={allocatedHeight}
          showLegend={true}
          showLegendBarLine={false}
        />
      );

    case "Coder 1":
      const coder1Series = [
        {
          name: "Allocated",
          value: coder1StatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Completed",
          value: coder1StatusCountData?.completedCount || 0,
          color: getStatusColor("2"),
        },
        {
          name: "InProgress",
          value: coder1StatusCountData?.pendingCount || 0,
          color: getStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: coder1StatusCountData?.queryPendingCount || 0,
          color: getStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: coder1StatusCountData?.queryApprovedCount || 0,
          color: getStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: coder1StatusCountData?.reassignedPendingCount || 0,
          color: getStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: coder1StatusCountData?.reassignedCompletedCount || 0,
          color: getStatusColor("7"),
        },
      ];

      const {
        categories: coder1Categories,
        formattedSeries: coder1Formatted,
        height: coder1Height,
      } = getFormattedChartData(coder1Series, chartType);

      return coder1StatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={coder1Categories}
          series={coder1Formatted}
          height={coder1Height}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
          total={getTotalChart(coder1Series)}
        />
      );

    case "Coder 2":
      const coder2Series = [
        {
          name: "Allocated",
          value: coder2StatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Completed",
          value: coder2StatusCountData?.completedCount || 0,
          color: getStatusColor("2"),
        },
        {
          name: "InProgress",
          value: coder2StatusCountData?.pendingCount || 0,
          color: getStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: coder2StatusCountData?.queryPendingCount || 0,
          color: getStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: coder2StatusCountData?.queryApprovedCount || 0,
          color: getStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: coder2StatusCountData?.reassignedPendingCount || 0,
          color: getStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: coder2StatusCountData?.reassignedCompletedCount || 0,
          color: getStatusColor("6"),
        },
      ];
      const {
        categories: coder2Categories,
        formattedSeries: coder2Formatted,
        height: coder2Height,
      } = getFormattedChartData(coder2Series, chartType);

      return coder2StatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={coder2Categories}
          series={coder2Formatted}
          height={coder2Height}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
          total={getTotalChart(coder2Series)}
        />
      );
    case "QA":
      const QASeries = [
        {
          name: "Allocated",
          value: qaStatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Completed",
          value: qaStatusCountData?.completedCount || 0,
          color: getStatusColor("2"),
        },
        {
          name: "InProgress",
          value: qaStatusCountData?.pendingCount || 0,
          color: getStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: qaStatusCountData?.queryPendingCount || 0,
          color: getStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: qaStatusCountData?.queryApprovedCount || 0,
          color: getStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: qaStatusCountData?.reassignedPendingCount || 0,
          color: getStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: qaStatusCountData?.reassignedCompletedCount || 0,
          color: getStatusColor("6"),
        },
      ];
      const {
        categories: QACategories,
        formattedSeries: QAFormatted,
        height: QAHeight,
      } = getFormattedChartData(QASeries, chartType);

      return qaStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={QACategories}
          series={QAFormatted}
          height={QAHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
          total={getTotalChart(QASeries)}
        />
      );
    case "Project Lead":
      const PLSeries = [
        {
          name: "Allocated",
          value: projectLeadStatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Completed",
          value: projectLeadStatusCountData?.completedCount || 0,
          color: getStatusColor("2"),
        },
        {
          name: "InProgress",
          value: projectLeadStatusCountData?.pendingCount || 0,
          color: getStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: projectLeadStatusCountData?.queryPendingCount || 0,
          color: getStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: projectLeadStatusCountData?.queryApprovedCount || 0,
          color: getStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: projectLeadStatusCountData?.reassignedPendingCount || 0,
          color: getStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: projectLeadStatusCountData?.reassignedCompletedCount || 0,
          color: getStatusColor("6"),
        },
      ];
      const {
        categories: PLCategories,
        formattedSeries: PLFormatted,
        height: PLHeight,
      } = getFormattedChartData(PLSeries, chartType);

      return projectLeadStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={PLCategories}
          series={PLFormatted}
          height={PLHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
          total={getTotalChart(PLSeries)}
        />
      );

    case "QA Lead":
      const QALeadSeries = [
        {
          name: "Allocated",
          value: qaLeadStatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Completed",
          value: qaLeadStatusCountData?.completedCount || 0,
          color: getStatusColor("2"),
        },
        {
          name: "InProgress",
          value: qaLeadStatusCountData?.pendingCount || 0,
          color: getStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: qaLeadStatusCountData?.queryPendingCount || 0,
          color: getStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: qaLeadStatusCountData?.queryApprovedCount || 0,
          color: getStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: qaLeadStatusCountData?.reassignedPendingCount || 0,
          color: getStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: qaLeadStatusCountData?.reassignedCompletedCount || 0,
          color: getStatusColor("6"),
        },
      ];
      const {
        categories: QALeadCategories,
        formattedSeries: QALeadFormatted,
        height: QALeadHeight,
      } = getFormattedChartData(QALeadSeries, chartType);

      return qaLeadStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={QALeadCategories}
          series={QALeadFormatted}
          height={QALeadHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
          total={getTotalChart(QALeadSeries)}
        />
      );
    case "Owner":
      const OwnerSeries = [
        {
          name: "Allocated",
          value: ownerStatusCountData?.allocatedCount || 0,
          color: getStatusColor("1"),
        },
        {
          name: "Completed",
          value: ownerStatusCountData?.completedCount || 0,
          color: getStatusColor("2"),
        },
        {
          name: "InProgress",
          value: ownerStatusCountData?.pendingCount || 0,
          color: getStatusColor("7"),
        },
        {
          name: "QueryPending",
          value: ownerStatusCountData?.queryPendingCount || 0,
          color: getStatusColor("4"),
        },
        {
          name: "QueryApproved",
          value: ownerStatusCountData?.queryApprovedCount || 0,
          color: getStatusColor("5"),
        },
        {
          name: "ReassignedPending",
          value: ownerStatusCountData?.reassignedPendingCount || 0,
          color: getStatusColor("3"),
        },
        {
          name: "ReassignedCompleted",
          value: ownerStatusCountData?.reassignedCompletedCount || 0,
          color: getStatusColor("6"),
        },
      ];
      const {
        categories: OwnerCategories,
        formattedSeries: OwnerFormatted,
        height: OwnerHeight,
      } = getFormattedChartData(OwnerSeries, chartType);

      return ownerStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={OwnerCategories}
          series={OwnerFormatted}
          height={OwnerHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
          total={getTotalChart(OwnerSeries)}
        />
      );
    case "Users":
      const UsersSeries = [
        {
          name: "Admin",
          value: usersStatusCountData?.usersCount?.admin || 0,
          color: getRoleColor("1"),
        },
        {
          name: "Coder 1",
          value: usersStatusCountData?.usersCount?.coder1 || 0,
          color: getRoleColor("2"),
        },
        {
          name: "Coder 2",
          value: usersStatusCountData?.usersCount?.coder2 || 0,
          color: getRoleColor("3"),
        },
        {
          name: "QA",
          value: usersStatusCountData?.usersCount?.qa || 0,
          color: getRoleColor("4"),
        },
        {
          name: "QA Lead",
          value: usersStatusCountData?.usersCount?.qaLead || 0,
          color: getRoleColor("5"),
        },
        {
          name: "Project Lead",
          value: usersStatusCountData?.usersCount?.projectLead || 0,
          color: getRoleColor("6"),
        },
        {
          name: "Owner",
          value: usersStatusCountData?.usersCount?.owner || 0,
          color: getRoleColor("7"),
        },
        {
          name: "Downloader",
          value: usersStatusCountData?.usersCount?.downloader || 0,
          color: getRoleColor("8"),
        },
      ];
      const {
        categories: UsersSeriesCategories,
        formattedSeries: UsersSeriesFormatted,
        height: UsersSeriesHeight,
      } = getFormattedChartData(UsersSeries, chartType);

      return usersStatusCountDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={UsersSeriesCategories}
          series={UsersSeriesFormatted}
          height={UsersSeriesHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
    case "Accuracy":
      const accuracyList = accuracyData?.accuracyResultDTOList || [];

      const machineAccuracyData = accuracyList.map(
        (item) => +(item.machineAccuracy?.toFixed(2) ?? 0)
      );
      const correctedCodesData = accuracyList.map(
        (item) => +(item.correctedCodes?.toFixed(2) ?? 0)
      );
      const orgAccuracyData = accuracyList.map(
        (item) => +(item.organisationAccuracy?.toFixed(2) ?? 0)
      );
      const averageMachineAccuracy = accuracyData?.avgMachineAccuracy ?? 0;
      const averageOrganizationAccuracy =
        accuracyData?.avgOrganisationAccuracy ?? 0;
      return (
        <>
          <div
            style={{
              margin: "20px 20px 0px 0px",
              display: "flex",
            }}
            className="d-flex justify-content-end"
          >
            <div>
              <Buttonscroller
                Buttons={TabButtons}
                handleButtonClick={handleTabButtonClick}
                activeButton={activeTabButton}
                activeColor="#fff"
                inActiveColor="#000000"
                activeBg="#2472FF"
                // inActiveBg="#E6EEFF"
                containerBg="#E6EEFF"
                width="150px"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              {accuracyDataLoading || pagesLoader ? (
                <CardSkeleton count={1} height={300} />
              ) : (
                <AccuracyChart
                  type="column"
                  xAxisFontColor="Gray"
                  LeftYaxisFont="black"
                  yAxis1Title="Accuracy Changes Count"
                  yAxis2Title="Accuracy Changes Count"
                  yAxisFont1="#2CAFFE"
                  yAxisFont2="#2472FF"
                  rightYaxisFont="black"
                  series={[
                    {
                      name: "Total Codes Count",
                      data: correctedCodesData,
                      color: "#2472FF",
                      yAxis: 1,
                      type: "column",
                    },
                    {
                      name:
                        currentTabBtn === "CogentAI Accuracy"
                          ? companyDeatils == "riskgenai"
                            ? "AI Quality"
                            : "CogentAI Accuracy"
                          : "Organization Score",
                      data:
                        currentTabBtn === "CogentAI Accuracy"
                          ? machineAccuracyData
                          : orgAccuracyData,
                      color: "#2CAFFE",
                      yAxis: 0,
                      type: "spline",
                    },
                  ]}
                />
              )}
            </div>
            <div className="col-3 my-4">
              {accuracyDataLoading || pagesLoader ? (
                <div className="m-2">
                  <CardSkeleton count={1} height={200} />
                </div>
              ) : (
                <div
                  style={{
                    height: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
                    border: "0.5px solid #3479FE",
                    backgroundColor: "#F0F6FF",
                  }}
                  className="w-100"
                >
                  <div className="p-4">
                    <div className="d-flex justify-content-center py-2">
                      <FontAwesomeIcon
                        className={`mt-1 ${styles.Img}`}
                        icon={faGaugeHigh}
                      />
                      <div className={styles.heading}>
                        {currentTabBtn === "CogentAI Accuracy"
                          ? "Accuracy"
                          : "Average Score"}
                      </div>
                    </div>
                    <div className={styles.percentage}>
                      <span className={styles.insideTitle}>
                        {currentTabBtn === "CogentAI Accuracy" ? (
                          <>
                            {" "}
                            {averageMachineAccuracy
                              ? `${Math.floor(averageMachineAccuracy)}%`
                              : `0%`}
                          </>
                        ) : (
                          <>
                            {" "}
                            {averageOrganizationAccuracy
                              ? `${Math.floor(averageOrganizationAccuracy)}%`
                              : `0%`}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      );
    case "Notificatin":
      return (
        <div className="py-2">
          <Notifications
            useDummyData={true}
            dummyNotificationData={dummyData}
          />
        </div>
      );
    default:
      break;
  }
};

const Workflow = ({
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  dispatch,
  dateRange,
  data,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  coder1StatusCountData,
  coder1StatusCountDataLoading,
  coder2StatusCountData,
  coder2StatusCountDataLoading,
  qaStatusCountData,
  qaStatusCountDataLoading,
  projectLeadStatusCountData,
  projectLeadStatusCountDataLoading,
  ownerStatusCountData,
  ownerStatusCountDataLoading,
  qaLeadStatusCountData,
  qaLeadStatusCountDataLoading,
  usersStatusCountData,
  usersStatusCountDataLoading,
  accuracyData,
  accuracyDataLoading,
  selectedValue,
  customDate,
}) => {
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();
  const showDashboard = getSelectedWidgets
    .filter((item) => item?.active)
    .sort((a, b) => a?.orderValue - b?.orderValue);
  const windowWidth = useWindowWidth();
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [activeTabButton, setActiveTabButton] = useState(0);
  const [currentTabBtn, setCurrentTabBtn] = useState("CogentAI Accuracy");
  const [averageReviewerScore, setAverageReviewerScore] = useState(0);
  const [averageEngineScore, setAverageEngineScore] = useState(0);

  const { userName = "" } = getLocalStored();
  const showModal = () => {
    setIsOrgModalOpen(true);
  };
  const handleOk = () => {
    setIsOrgModalOpen(false);
  };
  const handleCancel = () => {
    setIsOrgModalOpen(false);
    console.log("handle cancel called");
  };
  const handleTabButtonClick = (index, btn) => {
    setActiveTabButton(index);
    setCurrentTabBtn(btn);
  };
  const getInitialApiCall = async () => {
    const commonParams = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };
    try {
      const api = [
        {
          key: "workFlowFilesCount",
          params: commonParams,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c023"],
        },
        {
          key: "workFlowAllocatedStatusCount",
          params: commonParams,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c024"],
        },
        {
          key: "workFlowUsersCount",
          params: {},
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c037"],
        },
        {
          key: "workFlowAccuracy",
          params: commonParams,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c038"],
        },
      ];

      const independentApiKeys = api.filter((item) =>
        item.widgetId?.some((id) =>
          showDashboard.some((widget) => widget.widgetId === id)
        )
      );

      for (const { key, params } of independentApiKeys) {
        const actionKey = `${key}Action`;
        if (typeof actions[actionKey] === "function") {
           dispatch(actions[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
      const api1 = [
        {
          key: "workFlowCoder1StatusCount",
          roleId: 4,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c025"],
        },
        {
          key: "workFlowCoder2StatusCount",
          roleId: 5,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c026"],
        },
        {
          key: "workFlowQAStatusCount",
          roleId: 6,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c027"],
        },
        {
          key: "workFlowProjectLeadStatusCount",
          roleId: 8,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c028"],
        },
        {
          key: "workFlowOwnerStatusCount",
          roleId: 2,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c036"],
        },
        {
          key: "workFlowQALeadStatusCount",
          roleId: 7,
          widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c029"],
        },
      ];

      const roleBasedApiKeys = api1.filter((item) =>
        item.widgetId?.some((id) =>
          showDashboard.some((widget) => widget.widgetId === id)
        )
      );

      const roleApiCalls = roleBasedApiKeys.map(({ key, roleId }) => {
        const actionKey = `${key}Action`;
        const params = { ...commonParams, roleId };
        if (typeof actions[actionKey] === "function") {
           dispatch(actions[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
          return Promise.resolve();
        }
      });

      await Promise.all(roleApiCalls);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    getInitialApiCall();
  }, [dateRange, getSelectedWidgets]);

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <>
      {getSelectedWidgetsLoader ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            padding: 20,
          }}
          className="container-fluid"
        >
          <CardSkeleton count={9} height={300} />
        </div>
      ) : showDashboard.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 10,
            height: "100%",
          }}
          className="container-fluid"
        >
          {showDashboard?.map((item, id) => {
            const style = {
              gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
              gridRow: `span ${getRowSpan(item.size)}`,
              height: "100%",
            };

            return (
              <div className="dynamicChart" key={id} style={style}>
                {console.log(item, "item")}
                <Card>
                  {item.title === "Notifications" ? null : (
                    <div className="fw-bold mb-2 fs-5">
                      {item.title === "Notifications" ? null : item.title}
                    </div>
                  )}

                  {getCharts({
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    pagesLoader: getSelectedWidgetsLoader,
                    isOrgModalOpen,
                    setIsOrgModalOpen,
                    showModal,
                    handleOk,
                    handleCancel,
                    handleTabButtonClick,
                    currentTabBtn,
                    activeTabButton,
                    averageEngineScore,
                    averageReviewerScore,
                    filesCountData,
                    filesCountDataLoading,
                    allocatedStatusCountData,
                    allocatedStatusCountDataLoading,
                    coder1StatusCountData,
                    coder1StatusCountDataLoading,
                    coder2StatusCountData,
                    coder2StatusCountDataLoading,
                    qaStatusCountData,
                    qaStatusCountDataLoading,
                    projectLeadStatusCountData,
                    projectLeadStatusCountDataLoading,
                    ownerStatusCountData,
                    ownerStatusCountDataLoading,
                    qaLeadStatusCountData,
                    qaLeadStatusCountDataLoading,
                    usersStatusCountData,
                    usersStatusCountDataLoading,
                    accuracyData,
                    accuracyDataLoading,
                    dates,
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyComponent />
      )}
    </>
  );
};
const enhancer = connect((state) => ({
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard1.getWidgetsListLoader,
  data: state.admin?.dashboard1,
  filesCountData: state.admin?.dashboard1?.workFlowFilesCount?.data?.response,
  filesCountDataLoading: state.admin?.dashboard1?.workFlowFilesCountLoader,
  allocatedStatusCountData:
    state.admin?.dashboard1?.workFlowAllocatedStatusCount?.data?.response,
  allocatedStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowAllocatedStatusCountLoader,
  coder1StatusCountData:
    state.admin?.dashboard1?.workFlowCoder1StatusCount?.data?.response,
  coder1StatusCountDataLoading:
    state.admin?.dashboard1?.workFlowCoder1StatusCountLoader,
  coder2StatusCountData:
    state.admin?.dashboard1?.workFlowCoder2StatusCount?.data?.response,
  coder2StatusCountDataLoading:
    state.admin?.dashboard1?.workFlowCoder2StatusCountLoader,
  qaStatusCountData:
    state.admin?.dashboard1?.workFlowQAStatusCount?.data?.response,
  qaStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowQAStatusCountLoader,
  projectLeadStatusCountData:
    state.admin?.dashboard1?.workFlowProjectLeadStatusCount?.data?.response,
  projectLeadStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowProjectLeadStatusCountLoader,
  ownerStatusCountData:
    state.admin?.dashboard1?.workFlowOwnerStatusCount?.data?.response,
  ownerStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowOwnerStatusCountLoader,
  qaLeadStatusCountData:
    state.admin?.dashboard1?.workFlowQALeadStatusCount?.data?.response,
  qaLeadStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowQALeadStatusCountLoader,
  usersStatusCountData:
    state.admin?.dashboard1?.workFlowUsersCount?.data?.response,
  usersStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowUsersCountLoader,
  accuracyData: state.admin?.dashboard1?.workFlowAccuracy?.data?.response,
  accuracyDataLoading: state.admin?.dashboard1?.workFlowAccuracyLoader,
}));

export default enhancer(Workflow);
