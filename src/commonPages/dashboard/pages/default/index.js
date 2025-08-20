import { Card, Empty, Tooltip } from "antd";
import ReusableTable from "../../component/table";
import StatCard from "../../component/statChart";
import GroupCard from "../../component/groupcard";
import {
  DefaultWidget,
  formatKValue,
  getFormattedChartData,
  parseKValue,
  toFixedNum,
  useHasMounted,
  useWindowWidth,
} from "../../component/function";
import processing from "../../../../images/tenantAdmin/processing.svg";
import failed from "../../../../images/tenantAdmin/failed.svg";
import completed from "../../../../images/tenantAdmin/completed.svg";
import upload from "../../../../images/tenantAdmin/upload.svg";
import fileIcon from "../../../../images/tenantAdmin/file.svg";
import dosIcon from "../../../../images/tenantAdmin/dos.svg";
import pageIcon from "../../../../images/tenantAdmin/page.svg";
import { getColSpan } from "../../component/function";
import { getRowSpan } from "../../component/function";
import AppChart from "../../component/appchart";
import { getLocalStored } from "../../../../utils/storages";
import EmptyComponent from "../../component/empty/EmptyComponent";
import { getDashboardItems } from "../../component/function/resubaleGetStorage";
import { connect } from "react-redux";
import CardSkeleton from "../../../../components/skeleton/card";
import actions from "../../../../stores/admin/dashboard1/actions";
import { useEffect } from "react";
import pages from "../../../../images/dashboard/pages.png";
import patientCount from "../../../../images/dashboard/patientCount.png";
import dosCount from "../../../../images/dashboard/dosCount.png";
import uploadContainer from "../../../../images/dashboard/uploadContainer.png";
import processingContainer from "../../../../images/dashboard/processingContainer.png";
import completedContainer from "../../../../images/dashboard/completedContainer.png";
import failedContainer from "../../../../images/dashboard/failedContainer.png";
import codeCaptureContainer from "../../../../images/dashboard/codeCaptureContainer.png";
import {
  getColorValue,
  formatValues,
  getLast30Days,
  getLast7Days,
  getChartTimeLine,
  getStatusColor,
} from "../../../../utils/reusable";
import moment from "moment";
const statCardsData = [
  {
    title: "Radiology",
    value: 293,
    bgColor: getColorValue("5"),
  },
  {
    title: "Lab",
    value: 4,
    bgColor: getColorValue("6"),
  },
];

const getCharts = ({
  type,
  chartType,
  pagesLoader,
  top10Codes,
  top10CodesLoading,
  top10OIG,
  top10OIGLoading,
  tinTableData,
  tinTableDataLoading,
  fileDosCount,
  fileDosCountLoading,
  rafTotal,
  rafTotalLoading,
  rafHcc,
  rafHccLoading,
  rafCareGap,
  rafCareGapLoading,
  rafPotential,
  rafPotentialLoading,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  dates,
  selectedValue,
  customDate,
}) => {
  switch (type) {
    case "filecount":
      const fileCountData = [
        {
          icon: fileIcon,
          title: "File / Patients Count",
          value: formatKValue(fileDosCount?.fileCount) || 0,
          bgColor: patientCount,
          color: getColorValue("1"),
          color: getColorValue("1"),
        },
        {
          icon: dosIcon,
          title: "DOS Count",
          value: formatKValue(fileDosCount?.dosCount) || 0,
          bgColor: dosCount,
          color: getColorValue("2"),
        },
        {
          icon: pageIcon,
          title: "Pages",
          value: formatKValue(fileDosCount?.pageCount) || 0,
          bgColor: pages,
          color: getColorValue("3"),
        },
      ];
      if (chartType === "card") {
        return fileDosCountLoading || pagesLoader ? (
          <CardSkeleton count={1} height={250} />
        ) : (
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "10px",
              justifyContent: "flex-start",
              gap: "20px",
            }}
            className="mx-auto"
          >
            {fileCountData.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                borderRadius="28px"
                padding="16px"
                // minWidth="150px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="283px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
              />
            ))}
          </div>
        );
      }
      const formattedChartData = fileCountData.map((item) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color,
      }));
      const {
        categories: fileChartCategories,
        formattedSeries: fileChartFormatted,
        height: fileChartHeight,
      } = getFormattedChartData(formattedChartData, chartType);

      return fileDosCountLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategories}
          series={fileChartFormatted}
          height={chartType !== "card" ? 250 : fileChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          title={"Total Count"}
        />
      );
    case "RafAndRevenue":
      const rafAndRevenueCategories = rafHcc?.codesAndRafSummaryDTOList?.map(
        (item) => moment(item.date).format("MMM D")
      );
      return rafHccLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          dates={dates}
          charts={[
            {
              type: "stat",
              size: "col-5",
              mainTitle: "HCC Raf Contribution",
              title: "HCC Raf",
              value: toFixedNum(rafHcc?.overallRaf, 3) || 0,
              bgColor: patientCount,
              backgroundColor: getColorValue("7"),
            },
            {
              type: chartType,
              size: "col-7",
              categories: dates,
              customHeader: {
                header: `HCC Revenue Impact`,
                value: formatKValue(rafHcc?.overallPremium),
              },
              series: [
                {
                  name: "Revenue",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("7"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "hccPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "TotalCodes":
      const totalCodesCategories = rafTotal?.codesAndRafSummaryDTOList?.map(
        (item) => moment(item.date).format("MMM D")
      );
      const totalCodesChartData = (
        rafTotal?.codesAndRafSummaryDTOList || []
      ).map((item) => ({
        totalCount: toFixedNum(item?.totalCount, 2),
        hccCount: toFixedNum(item?.hccCount, 2),
        suggestedCount: toFixedNum(item?.suggestedCount, 2),
        potentialCount: toFixedNum(item?.potentialCount, 2),
        totalRaf: toFixedNum(item?.totalRaf, 2),
        hccRafScore: toFixedNum(item?.hccRafScore, 2),
        suggestedRafScore: toFixedNum(item?.suggestedRafScore, 2),
        potentialRafScore: toFixedNum(item?.potentialRafScore, 2),
        totalPremium: toFixedNum(item?.totalPremium, 2),
        hccPremium: toFixedNum(item?.hccPremium, 2),
        suggestedPremium: toFixedNum(item?.suggestedPremium, 2),
        potentialPremium: toFixedNum(item?.potentialPremium, 2),
      }));

      return rafTotalLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Code Distribution",
                value: formatKValue(
                  toFixedNum(rafTotal?.overallCodesCount, 2) || 0
                ),
                header: "Overall Performance",
              },
              series: [
                {
                  name: "Total Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "totalCount",
                    dates: dates,
                  },
                },
                {
                  name: "HCC Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "hccCount", dates: dates },
                },
                {
                  name: "Care Gap Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("2"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedCount",
                    dates: dates,
                  },
                },
                {
                  name: "Potiential Codes",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialCount",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Overall RAF Score",
                value: toFixedNum(rafTotal?.overallRaf, 3) || 0,
                header: "RAF Score",
              },
              // chartBackground: "#ECF3FF",

              series: [
                {
                  name: "Total RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "totalRaf", dates: dates },
                },
                {
                  name: "HCC RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "hccRafScore",
                    dates: dates,
                  },
                },
                {
                  name: "Care Gap RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("2"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedRafScore",
                    dates: dates,
                  },
                },
                {
                  name: "Potiential RAF",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Overall Revenue Impact",
                value:
                  formatKValue(toFixedNum(rafTotal?.overallPremium, 2)) || 0,
                header: "Revenue",
              },
              // chartBackground: "#FCEEE9",
              series: [
                {
                  name: "Total Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "totalPremium",
                    dates: dates,
                  },
                },
                {
                  name: "HCC Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "hccPremium",
                    dates: dates,
                  },
                },
                {
                  name: "Care Gap Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("2"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "suggestedPremium",
                    dates: dates,
                  },
                },
                {
                  name: "Potiential Revenue",
                  data: rafTotal?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "potentialPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "HccCodes":
      const hccCodesCategories = rafHcc?.codesAndRafSummaryDTOList?.map(
        (item) => moment(item.date).format("MMM D")
      );
      const hccChartData = (rafHcc?.codesAndRafSummaryDTOList || []).map(
        (item) => ({
          hccCount: toFixedNum(item?.hccCount, 2),
          hccRafScore: toFixedNum(item?.hccRafScore, 2),
          hccPremium: toFixedNum(item?.hccPremium, 2),
        })
      );
      return rafHccLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "HCC Code Distribution",
                value:
                  formatKValue(toFixedNum(rafHcc?.overallCodesCount, 2)) || 0,
                header: "HCC Performance",
              },
              series: [
                {
                  name: "HCC Code Distribution",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: { key: "date", value: "hccCount", dates: dates },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "HCC RAF Contribution",
                value: toFixedNum(rafHcc?.overallRaf, 3) || 0,
                header: "RAF Score",
              },
              // chartBackground: "#EFECFE",
              series: [
                {
                  name: "HCC RAF Contribution",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "hccRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "HCC Revenue Impact",
                value: formatKValue(toFixedNum(rafHcc?.overallPremium, 2)) || 0,
                header: "Revenue",
              },
              // chartBackground: "#E2F1F3",
              series: [
                {
                  name: "HCC Revenue Impact",
                  data: rafHcc?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("1"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "hccPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "CareGapCodes":
      const careGapChartData = (
        rafCareGap?.codesAndRafSummaryDTOList || []
      ).map((item) => ({
        suggestedCount: toFixedNum(item?.suggestedCount, 2),
        suggestedRafScore: toFixedNum(item?.suggestedRafScore, 2),
        suggestedPremium: toFixedNum(item?.suggestedPremium, 2),
      }));
      const careGapCodesCategories = rafCareGap?.codesAndRafSummaryDTOList?.map(
        (item) => moment(item.date).format("MMM D")
      );
      return rafCareGapLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Care Gap Code Distribution",
                value: formatKValue(
                  toFixedNum(rafCareGap?.overallCodesCount, 2)
                ),
                header: "Care Gap Performance",
              },
              series: [
                {
                  name: "Care Gap Code Distribution",
                  data: rafCareGap?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedCount",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              // chartBackground: " #E2F1F3",
              customHeader: {
                label: "Care Gap RAF Contribution",
                value: toFixedNum(rafCareGap?.overallRaf, 3),
                header: "RAF Score",
              },
              series: [
                {
                  name: "Care Gap RAF Contribution",
                  data: rafCareGap?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "suggestedRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Care Gap Revenue Impact",
                value: formatKValue(toFixedNum(rafCareGap?.overallPremium, 2)),
                header: "Revenue",
              },
              // chartBackground: "#DAE0FC",
              series: [
                {
                  name: "Care Gap Revenue Impact",
                  data: rafCareGap?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("3"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "suggestedPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "PotientialCodes":
      const potentialChartData = (
        rafPotential?.codesAndRafSummaryDTOList || []
      ).map((item) => ({
        potentialCount: toFixedNum(item?.potentialCount, 2),
        potentialRafScore: toFixedNum(item?.potentialRafScore, 2),
        potentialPremium: toFixedNum(item?.potentialPremium, 2),
      }));
      const potentialCodesCategories =
        rafPotential?.codesAndRafSummaryDTOList?.map((item) =>
          moment(item.date).format("MMM D")
        );
      return rafPotentialLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard
          charts={[
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Potential Code Distribution",
                value: formatKValue(
                  toFixedNum(rafPotential?.overallCodesCount, 2)
                ),
                header: "Potential Performance",
              },
              series: [
                {
                  name: "Potential Code Distribution",
                  data: rafPotential?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialCount",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Potential RAF Contribution",
                value: toFixedNum(rafPotential?.overallRaf, 3),
                header: "RAF Score",
              },
              // chartBackground: "#EFECFE",
              series: [
                {
                  name: "Potential RAF Contribution",
                  data: rafPotential?.codesAndRafSummaryDTOList || [],
                  color: getColorValue("4"),
                  area: chartType === "area",
                  plotConfig: {
                    key: "date",
                    value: "potentialRafScore",
                    dates: dates,
                  },
                },
              ],
            },
            {
              type: chartType,
              size: "col-4",
              categories: dates,
              customHeader: {
                label: "Potential Revenue Impact",
                value: formatKValue(
                  toFixedNum(rafPotential?.overallPremium, 2)
                ),
                header: "Revenue",
              },
              // chartBackground: "#EBFCFF",
              series: [
                {
                  name: "Potential Revenue Impact",
                  data: rafPotential?.codesAndRafSummaryDTOList || [],

                  color: getColorValue("4"),
                  ...(chartType === "stepline" && { step: "middle" }),
                  plotConfig: {
                    key: "date",
                    value: "potentialPremium",
                    dates: dates,
                  },
                },
              ],
            },
          ]}
        />
      );
    case "labAndRadialogy":
      return (
        <div>
          <div className="d-flex gap-3">
            {statCardsData.map((card) => (
              <StatCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                padding="16px"
                minWidth="140px"
                gap="12px"
                display="flex"
                alignItems="center"
                borderRadius="12px"
                height="80px"
                fontWeight={
                  card.title === "Processing" || card.title === "Failed"
                    ? "900"
                    : undefined
                }
                justifyContent="center"
                textColor={"white"}
                border="4px solid #B3B3B3"
              />
            ))}
          </div>
          {pagesLoader ? (
            <CardSkeleton count={1} height={300} />
          ) : (
            <AppChart
              type={chartType}
              categories={[
                "Feb 26",
                "Mar 1",
                "Mar 4",
                "Mar 7",
                "Mar 9",
                "Mar 13",
                "Mar 16",
              ]}
              series={[
                {
                  name: "Lab",
                  data: [0, 0, 12.34, 0, 3, 0],
                  color: getColorValue("5"),
                  area: chartType === "area",
                },
                {
                  name: "Radiology",
                  data: [20, 56, 34, 67, 12],
                  color: getColorValue("6"),
                  area: chartType === "area",
                },
              ]}
            />
          )}
        </div>
      );
    case "fileChart":
      const {
        computedFiles = 0,
        failedFiles = 0,
        processingFiles = 0,
        uploadedFiles = 0,
        capturedCodesCount = 0,
        computedStats = [],
        failedStats = [],
        processingStats = [],
      } = filesCountData || [];
      const fileCardsData = [
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
        {
          icon: failed,
          title: "AI Codes Capture",
          value: capturedCodesCount || 0,
          bgColor: codeCaptureContainer,
          iconColor: "#ffdbcc",
        },
      ];
      const categories = dates;
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
          data: processingStats.map((item) => item.count) || [],
          color: getColorValue("7"),
        },
        {
          name: "Failed",
          data: failedStats.map((item) => item.count) || [],
          color: getColorValue("1"),
        },
      ];
      return (
        <div className="row">
          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
            {fileCardsData.map((card) =>
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
                  minWidth="180px"
                  gap="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="20px"
                  height="65px"
                  fontSize="20px"
                  fontWeight={700}
                  textColor={"white"}
                  textAlign={"center"}
                  border="4px solid #B3B3B3"
                />
              )
            )}
          </div>
          {filesCountDataLoading || pagesLoader ? (
            <div className="py-2">
              <CardSkeleton count={1} height={250} />
            </div>
          ) : (
            <AppChart
              type={chartType}
              categories={categories}
              series={series}
              xAxisInterval={1}
            />
          )}
        </div>
      );
    case "Top10Diseases":
      return top10CodesLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <ReusableTable
          title="Top 10 HCC Codes"
          items={top10Codes?.topDiseaseDTOList || []}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TopOIGCodes":
      return top10OIGLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <ReusableTable
          title="Top 10 OIG Codes"
          items={top10OIG?.topDiseaseDTOList || []}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TinTable":
      return tinTableDataLoading || pagesLoader ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <ReusableTable
          title="TIN Status Table"
          items={tinTableData?.tinStatisticsResponseDtoList || []}
          columns={[
            { title: "TIN Number", dataIndex: "tinNumber" },
            { title: "TIN Name", dataIndex: "tinName", className: "midRow" },
            {
              title: "Status",
              dataIndex: "progressPercentage",
              isProgress: true,
            },
          ]}
        />
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
    default:
      break;
  }
};

function Default({
  dispatch,
  data,
  getSelectedWidgets = [],
  getSelectedWidgetsLoader,
  dateRange,
  top10Codes,
  top10CodesLoading,
  top10OIG,
  top10OIGLoading,
  tinTableData,
  tinTableDataLoading,
  fileDosCount,
  fileDosCountLoading,
  rafTotal,
  rafTotalLoading,
  rafHcc,
  rafHccLoading,
  rafCareGap,
  rafCareGapLoading,
  rafPotential,
  rafPotentialLoading,
  filesCountData,
  filesCountDataLoading,
  allocatedStatusCountData,
  allocatedStatusCountDataLoading,
  selectedValue,
  customDate,
}) {
  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();
  const showDashboard = getSelectedWidgets
    .filter((item) => item?.active)
    .sort((a, b) => a?.orderValue - b?.orderValue);
  const api = [
    {
      key: "defaultTop10Codes",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c009"],
    },
    {
      key: "defaultTop10OIG",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c010"],
    },
    {
      key: "defaultFileDosCount",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c001"],
    },
    {
      key: "defaultRafTotal",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c003"],
    },
    {
      key: "defaultRafHcc",
      widgetId: [
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c004",
        "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
      ],
    },
    {
      key: "defaultRafCareGap",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c005"],
    },
    {
      key: "defaultRafPotential",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c006"],
    },
    {
      key: "workFlowFilesCount",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c008"],
    },
    {
      key: "defaultTinTable",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c040"],
    },
    {
      key: "workFlowAllocatedStatusCount",
      widgetId: ["acd1b072-3ca4-4bf2-8d32-973ab8c7c041"],
    },
  ];

  const apiKeys = api.filter((item) =>
    item.widgetId?.some((id) =>
      showDashboard.some((widget) => widget.widgetId === id)
    )
  );

  const getInitialApiCall = async () => {
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      // const apiKeys = [
      //   "defaultTop10Codes",
      //   "defaultTop10OIG",
      //   "defaultFileDosCount",
      //   "defaultRafTotal",
      //   "defaultRafHcc",
      //   "defaultRafCareGap",
      //   "defaultRafPotential",
      //   "workFlowFilesCount",
      // ];

      for (const item of apiKeys) {
        const actionKey = `${item.key}Action`;
        if (typeof actions[actionKey] === "function") {
          await dispatch(actions[actionKey](params));
        } else {
          console.warn(`Action not found for key: ${actionKey}`);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    getInitialApiCall();
  }, [dateRange, getSelectedWidgets]);

  const windowWidth = useWindowWidth();
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
      ) : showDashboard?.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
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
                <Card>
                  {item.widgetName !== "WorkFlow" &&
                    item.title !== "Notifications" &&
                    item.title !== "Hold Status" && (
                      <div className="fw-bold mb-2 fs-5">{item.title}</div>
                    )}
                  {getCharts({
                    type: item.widgetName,
                    chartType: item?.selectedChart,
                    pagesLoader: getSelectedWidgetsLoader,
                    top10Codes,
                    top10CodesLoading,
                    top10OIG,
                    top10OIGLoading,
                    tinTableData,
                    tinTableDataLoading,
                    fileDosCount,
                    fileDosCountLoading,
                    rafTotal,
                    rafTotalLoading,
                    rafHcc,
                    rafHccLoading,
                    rafCareGap,
                    rafCareGapLoading,
                    rafPotential,
                    rafPotentialLoading,
                    filesCountData,
                    filesCountDataLoading,
                    allocatedStatusCountData,
                    allocatedStatusCountDataLoading,
                    dates,
                    selectedValue,
                    customDate,
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
}
const enhancer = connect((state) => ({
  getSelectedWidgets: state.admin.dashboard1.getWidgetsList?.data?.response,
  getSelectedWidgetsLoader: state.admin.dashboard1.getWidgetsListLoader,
  data: state.admin?.dashboard1,
  top10Codes: state.admin?.dashboard1?.defaultTop10Codes?.data?.response,
  top10CodesLoading: state.admin?.dashboard1?.defaultTop10CodesLoader,
  top10OIG: state.admin?.dashboard1?.defaultTop10OIG?.data?.response,
  top10OIGLoading: state.admin?.dashboard1?.defaultTop10OIGLoader,
  fileDosCount: state.admin?.dashboard1?.defaultFileDosCount?.data?.response,
  fileDosCountLoading: state.admin?.dashboard1?.defaultFileDosCountLoader,
  rafTotal: state.admin?.dashboard1?.defaultRafTotal?.data?.response,
  rafTotalLoading: state.admin?.dashboard1?.defaultRafTotalLoader,
  rafHcc: state.admin?.dashboard1?.defaultRafHcc?.data?.response,
  rafHccLoading: state.admin?.dashboard1?.defaultRafHccLoader,
  rafCareGap: state.admin?.dashboard1?.defaultRafCareGap?.data?.response,
  rafCareGapLoading: state.admin?.dashboard1?.defaultRafCareGapLoader,
  rafPotential: state.admin?.dashboard1?.defaultRafPotential?.data?.response,
  rafPotentialLoading: state.admin?.dashboard1?.defaultRafPotentialLoader,
  filesCountData: state.admin?.dashboard1?.workFlowFilesCount?.data?.response,
  filesCountDataLoading: state.admin?.dashboard1?.workFlowFilesCountLoader,
  tinTableData: state.admin?.dashboard1?.defaultTinTable?.data?.response,
  tinTableDataLoading: state.admin?.dashboard1?.defaultTinTableLoader,
  allocatedStatusCountData:
    state.admin?.dashboard1?.workFlowAllocatedStatusCount?.data?.response,
  allocatedStatusCountDataLoading:
    state.admin?.dashboard1?.workFlowAllocatedStatusCountLoader,
}));
export default enhancer(Default);
